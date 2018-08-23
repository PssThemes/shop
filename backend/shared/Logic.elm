module Logic exposing (..)

import Data exposing (..)
import EveryDict exposing (..)


-- import Json.Encode as JE

import EveryDict exposing (EveryDict)


-- import Rocket exposing ((=>))

import Ports
import EverySet exposing (EverySet)


getDeletedProductsIds :
    EverySet ExternalProductId
    -> EverySet ExternalProductId
    -> EverySet ExternalProductId
getDeletedProductsIds firebaseProductsIds shopProductsIds =
    -- means products that are in firebase but not on shop.
    EverySet.diff firebaseProductsIds shopProductsIds


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


saveToFirebase :
    ShopName
    -> List InternalProductId
    -> List NormalizedProduct
    -> List ( InternalProductId, NormalizedProduct )
    -> EveryDict ExternalProductId (EverySet ExternalCatId)
    -> Cmd msg
saveToFirebase shopName deleted created updated oneExtProductToManyExtCats =
    let
        _ =
            Debug.log "saveToFirebase: " saveToFirebase
    in
        { deleted =
            deleted
                |> List.map (\(InternalProductId id) -> id)
        , created =
            created
                |> List.map (newlyCreatedProductEncoder shopName)
        , updated =
            updated
                |> List.map
                    (\( InternalProductId id, normalizedProduct ) ->
                        let
                            externalCatIds =
                                case EveryDict.get normalizedProduct.externalId oneExtProductToManyExtCats of
                                    Nothing ->
                                        EverySet.empty

                                    Just set ->
                                        set
                        in
                            { id = id
                            , fieldsToUpdate = updatableProductDataEncoder normalizedProduct externalCatIds
                            }
                    )
        }
            |> Ports.saveToFirebase


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
        |> EveryDict.foldl
            (\k list acc ->
                list
                    |> List.foldl
                        (\( externalCatId, _ ) acc ->
                            EverySet.insert externalCatId acc
                        )
                        acc
            )
            EverySet.empty


extractAsociations :
    List ( ExternalCatId, ExternalProductId )
    -> ( EveryDict ExternalCatId (EverySet ExternalProductId), EveryDict ExternalProductId (EverySet ExternalCatId) )
extractAsociations mappings =
    mappings
        |> List.foldl
            (\( externalCatId, externalProductId ) ( acc1, acc2 ) ->
                ( updateOrInsert externalCatId externalProductId acc1
                , updateOrInsert externalProductId externalCatId acc2
                )
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
        |> EveryDict.foldl
            (\id internalProduct acc ->
                EverySet.insert internalProduct.externalId acc
            )
            EverySet.empty


getExternalProductsIdsFromShopify : EveryDict ExternalProductId NormalizedProduct -> EverySet ExternalProductId
getExternalProductsIdsFromShopify externalProducts =
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
