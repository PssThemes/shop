module Logic exposing (createNewProduct, ensureItRelyNeedsUpdating, extractCategoryProductAsociations, extractCateogoryToCategoryAssociations, extractFieldsToUpdate, findAsociatedInternalProductId, getCreatedProductsIds, getExternalCategoriesFromFirebase, getExternalProductIdsFromFirebase, getExternalProductsIdsFromShop, getIdsOfDeletedProducts, getPosiblyUpdatedProductsIds, getRelevantProducts, getRelevantProductsIds, listContains, removeNothings, saveToFirebase, updateOrInsert)

-- import Json.Encode as JE
-- import Rocket exposing ((=>))

import Data exposing (..)
import EveryDict exposing (..)
import EverySet exposing (EverySet)
import Ports


getIdsOfDeletedProducts :
    EverySet ExternalProductId
    -> EverySet ExternalProductId
    -> EverySet ExternalCatId
    -> EveryDict ExternalProductId NormalizedProduct
    -> EverySet ExternalProductId
getIdsOfDeletedProducts firebaseProductsIds shopProductsIds emptyedOrDeletedExternalCategories allShopProducts =
    let
        _ =
            Debug.log "emptyedOrDeletedExternalCategories: " emptyedOrDeletedExternalCategories

        _ =
            Debug.log "deasociatedProducts: " deasociatedProducts

        deasociatedProducts : EverySet ExternalProductId
        deasociatedProducts =
            allShopProducts
                -- Removing the emptyedOrDeletedExternalCategories
                |> EveryDict.map
                    (\k product ->
                        { product
                            | externalCatIds =
                                EverySet.diff product.externalCatIds emptyedOrDeletedExternalCategories
                        }
                    )
                -- Keep only the products with no categories.. now this are the ones that will be removed.
                |> EveryDict.filter (\k product -> product.externalCatIds == EverySet.empty)
                |> EveryDict.foldl (\k product acc -> product.externalId :: acc) []
                |> EverySet.fromList
    in
    -- means products that are in firebase but not on shop.
    -- and alo remove products that remain and are present
    EverySet.diff (EverySet.diff firebaseProductsIds shopProductsIds) deasociatedProducts


getCreatedProductsIds :
    EverySet ExternalProductId
    -> EverySet ExternalProductId
    -> EverySet ExternalProductId
getCreatedProductsIds firebaseProductsIds shopProductsIds =
    -- created products means they are in the shop but not in firebase.
    EverySet.diff shopProductsIds firebaseProductsIds


findAsociatedInternalProductId :
    ExternalProductId
    -> EveryDict InternalProductId InternalProduct
    -> Maybe InternalProductId
findAsociatedInternalProductId externalProductId internalProducts =
    internalProducts
        |> EveryDict.filter (\_ product -> product.externalId == externalProductId)
        |> EveryDict.toList
        |> List.head
        |> Maybe.map Tuple.first


removeNothings : List (Maybe a) -> List a
removeNothings list =
    case list of
        [] ->
            []

        maybe :: xs ->
            case maybe of
                Nothing ->
                    removeNothings xs

                Just a ->
                    a :: removeNothings xs


getPosiblyUpdatedProductsIds :
    EverySet ExternalProductId
    -> EverySet ExternalProductId
    -> EverySet ExternalProductId
    -> EverySet ExternalProductId
getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShopify =
    -- whatever external product id which is not created or deleted.. must be updated.
    -- so its everything in the big set except the createdOrDeleted
    let
        createdOrDeleted =
            EverySet.union createdProductsIds deletedProductsExternalIds
    in
    EverySet.diff externalProductIdsFromShopify createdOrDeleted


ensureItRelyNeedsUpdating :
    EveryDict InternalProductId InternalProduct
    -> EveryDict ExternalProductId (EverySet ExternalCatId)
    -> ( InternalProductId, NormalizedProduct )
    -> Bool
ensureItRelyNeedsUpdating internalProducts oneExtProductToManyExtCats ( internalProductId, normalizedProduct ) =
    -- EveryDict.get internalProductId internalProducts
    --     |> Maybe.andThen
    --         (\internalProduct ->
    --             EveryDict.get internalProduct.externalId oneExtProductToManyExtCats
    --                 |> Maybe.andThen
    --                     (\externalCats ->
    --                         let
    --                             short_descriptionForNormalizedProduct =
    --                                 getShopifyShortDescription normalizedProduct.description
    --
    --                             areTheSame =
    --                                 (internalProduct.externalCatIds == externalCats)
    --                                     && (internalProduct.externalId == normalizedProduct.externalId)
    --                                     && (internalProduct.name == normalizedProduct.name)
    --                                     && (internalProduct.mainImage == normalizedProduct.mainImage)
    --                                     && (internalProduct.price == normalizedProduct.price)
    --                                     && (internalProduct.short_description == short_descriptionForNormalizedProduct)
    --                                     && (internalProduct.media == normalizedProduct.media)
    --                         in
    --                             -- it needs updating if products are NOT the same.
    --                             Just (not areTheSame)
    --                     )
    --         )
    --     |> Maybe.withDefault False
    True



-- #region Prepare Data for Firebase


acumulateData :
    ShopName
    -> List InternalProductId
    -> List NormalizedProduct
    -> List ( InternalProductId, NormalizedProduct )
    -> EveryDict ExternalProductId (EverySet ExternalCatId)
    -> EveryDict ExternalCatId (EverySet InternalCatId)
    ->
        { deleted : List InternalProductId
        , created : List NewlyCreatedProduct
        , updated : List ( InternalProductId, FieldsToUpdate )
        }
acumulateData shopName deleted created updated oneExtProductToManyExtCats oneExternalCatIdToManyInternalCatIds =
    { deleted = deleted
    , created =
        created
            |> List.map (createNewProduct shopName oneExternalCatIdToManyInternalCatIds)
            |> removeNothings
    , updated =
        updated
            |> List.map (Tuple.mapSecond extractFieldsToUpdate)
    }


saveToFirebase :
    { deleted : List InternalProductId
    , created : List NewlyCreatedProduct
    , updated : List ( InternalProductId, FieldsToUpdate )
    }
    -> Cmd msg
saveToFirebase { deleted, created, updated } =
    { deleted =
        deleted
            |> List.map (\(InternalProductId id) -> id)
    , created =
        created
            |> List.map newlyCreatedProductEncoder
    , updated =
        updated
            |> List.map (Tuple.mapSecond fieldsToUpdateEncoder)
            |> List.map
                (\( InternalProductId id, fieldsToUpdate ) ->
                    { firebaseKey = id
                    , fieldsToUpdate = fieldsToUpdate
                    }
                )
    }
        |> Ports.saveToFirebase


createNewProduct : ShopName -> EveryDict ExternalCatId (EverySet InternalCatId) -> NormalizedProduct -> Maybe NewlyCreatedProduct
createNewProduct shopName oneExternalCatIdToManyInternalCatIds nProduct =
    nProduct.externalCatIds
        |> EverySet.map (\catId -> EveryDict.get catId oneExternalCatIdToManyInternalCatIds)
        |> EverySet.toList
        |> removeNothings
        |> EverySet.fromList
        |> EverySet.foldl (\item acc -> EverySet.union acc item) EverySet.empty
        |> (\internalCatIds ->
                Just
                    { shopName = shopName
                    , externalId = nProduct.externalId
                    , name = nProduct.name
                    , short_description = nProduct.short_description
                    , price = nProduct.price
                    , externalCatIds = nProduct.externalCatIds
                    , internalCatIds = internalCatIds
                    , mainImage = nProduct.mainImage
                    , media = nProduct.media
                    , isHidden = False
                    , howManyTimesWasOrdered = 0
                    }
           )


extractFieldsToUpdate : NormalizedProduct -> FieldsToUpdate
extractFieldsToUpdate nProduct =
    { name = nProduct.name
    , short_description = nProduct.short_description
    , price = nProduct.price
    , externalCatIds = nProduct.externalCatIds
    , mainImage = nProduct.mainImage
    , media = nProduct.media
    }



-- #endregion Prepare Data for Firebase


getExternalCategoriesFromFirebase :
    EveryDict InternalCatId InternalCategory
    -> ShopName
    -> EverySet ExternalCatId
getExternalCategoriesFromFirebase internalCategories shopName =
    internalCategories
        |> EveryDict.map
            (\k cat ->
                case shopName of
                    Shopify ->
                        cat.shopify

                    Prestashop ->
                        cat.prestashop
            )
        |> EveryDict.toList
        |> EverySet.fromList
        |> EverySet.map (Tuple.second >> List.map Tuple.first >> EverySet.fromList)
        |> EverySet.foldl (\externalCatIds acc -> EverySet.union externalCatIds acc) EverySet.empty


extractCategoryProductAsociations :
    List ( ExternalCatId, ExternalProductId )
    -> ( EveryDict ExternalCatId (EverySet ExternalProductId), EveryDict ExternalProductId (EverySet ExternalCatId) )
extractCategoryProductAsociations mappings =
    mappings
        |> List.foldl
            (\( externalCatId, externalProductId ) ( acc1, acc2 ) ->
                ( updateOrInsert externalCatId externalProductId acc1
                , updateOrInsert externalProductId externalCatId acc2
                )
            )
            ( EveryDict.empty, EveryDict.empty )


extractCateogoryToCategoryAssociations :
    ShopName
    -> EveryDict InternalCatId InternalCategory
    -> ( EveryDict ExternalCatId (EverySet InternalCatId), EveryDict InternalCatId (EverySet ExternalCatId) )
extractCateogoryToCategoryAssociations shopName internalCats =
    let
        getExtCatIds : InternalCategory -> EverySet ExternalCatId
        getExtCatIds internalCat =
            (case shopName of
                Shopify ->
                    internalCat.shopify

                Prestashop ->
                    internalCat.prestashop
            )
                |> List.map Tuple.first
                |> EverySet.fromList
    in
    internalCats
        |> EveryDict.foldl
            (\internalCatId internalCat (( oneExtCatToManyIntCats, oneIntToManyExtCats ) as totalAcc) ->
                let
                    externalCatIds =
                        getExtCatIds internalCat

                    acc1 : EveryDict ExternalCatId (EverySet InternalCatId)
                    acc1 =
                        externalCatIds
                            |> EverySet.foldl
                                (\extCatId acc ->
                                    acc
                                        |> updateOrInsert extCatId internalCat.selfId
                                )
                                oneExtCatToManyIntCats

                    acc2 : EveryDict InternalCatId (EverySet ExternalCatId)
                    acc2 =
                        externalCatIds
                            |> EverySet.foldl
                                (\extCatId acc ->
                                    acc
                                        |> updateOrInsert internalCatId extCatId
                                )
                                oneIntToManyExtCats
                in
                ( acc1, acc2 )
            )
            ( EveryDict.empty, EveryDict.empty )


updateOrInsert :
    key
    -> value
    -> EveryDict key (EverySet value)
    -> EveryDict key (EverySet value)
updateOrInsert key value dict =
    dict
        |> EveryDict.update key
            (\maybe_value ->
                case maybe_value of
                    Nothing ->
                        Just (EverySet.fromList [ value ])

                    Just set ->
                        if EverySet.member value set then
                            Just set
                        else
                            Just (EverySet.insert value set)
            )


listContains : a -> List a -> Bool
listContains a list =
    List.filter (\item -> item == a) list
        |> (\list -> list == [] |> not)


getRelevantProductsIds :
    EveryDict ExternalCatId (EverySet ExternalProductId)
    -> EverySet ExternalCatId
    -> EverySet ExternalProductId
getRelevantProductsIds oneExtCatToManyExtProducts externalCategoriesIdsFromFirebase =
    -- relevant products means products that contain an external category on them.. which is present in firebase .
    --
    -- TODO:  understand what this function does.. i cant focust..
    --
    -- any external cateogy presnent in firebase is included here.
    -- we use the accumultors : oneExtCatToManyExtProducts
    -- which is constructed from external products..
    -- the ids are automatically deduplicated this beeing a set and all.
    externalCategoriesIdsFromFirebase
        |> EverySet.foldl
            (\catId acc ->
                case EveryDict.get catId oneExtCatToManyExtProducts of
                    Nothing ->
                        acc

                    Just productsIds ->
                        EverySet.union productsIds acc
            )
            EverySet.empty


getRelevantProducts :
    EveryDict ExternalCatId (EverySet ExternalProductId)
    -> EverySet ExternalCatId
    -> EveryDict ExternalProductId NormalizedProduct
    -> EveryDict ExternalProductId NormalizedProduct
getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase allExternalProducts =
    let
        relevantIds =
            getRelevantProductsIds oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase
    in
    allExternalProducts
        |> EveryDict.filter (\k v -> EverySet.member k relevantIds)


getExternalProductIdsFromFirebase : EveryDict InternalProductId InternalProduct -> EverySet ExternalProductId
getExternalProductIdsFromFirebase internalProducts =
    internalProducts
        |> EveryDict.toList
        |> List.map (Tuple.second >> .externalId)
        |> EverySet.fromList


getExternalProductsIdsFromShop : EveryDict ExternalProductId NormalizedProduct -> EverySet ExternalProductId
getExternalProductsIdsFromShop externalProducts =
    externalProducts
        |> EveryDict.foldl (\id product acc -> EverySet.insert product.externalId acc) EverySet.empty



--
-- const relevantProductIdsSet = Shared.getRelevantProductIds(relevantExternalCatsIds, externalProductsGroupedByCategory);
-- externalCategories
--   |> EveryDict.foldl  (\ k v acc ->
--
--
--   ) []
--
--
--
