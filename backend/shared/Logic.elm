module Logic exposing (..)

import Data exposing (..)
import EveryDict exposing (..)


-- import Json.Encode as JE
-- import Rocket exposing ((=>))

import Ports
import EverySet exposing (EverySet)


getDeletedProductsIds : EverySet ExternalProductId -> EverySet ExternalProductId -> EverySet ExternalProductId
getDeletedProductsIds firebaseProductsIds shopProductsIds =
    -- means products that are in firebase but not on shop.
    -- accumulate over ids in firebase and check if the id is in shopifyu also.
    -- if is not it means it was deleted.. added to accumulator.
    -- firebaseProductsIds
    --     |> EverySet.foldl
    --         (\firebaseId acc ->
    --             if EverySet.member firebaseId shopProductsIds then
    --                 acc
    --             else
    --                 -- // does not contain.. is deleted.
    --                 EverySet.insert firebaseId acc
    --         )
    --         EverySet.empty
    -- or we can use set differtence
    EverySet.diff firebaseProductsIds shopProductsIds


getCreatedProductsIds : EverySet ExternalProductId -> EverySet ExternalProductId -> EverySet ExternalProductId
getCreatedProductsIds firebaseProductsIds shopProductsIds =
    -- created products means they are in the shop but not in firebase.
    -- accumulating over the shop ids..
    -- we check if exist in firebase..
    -- if it doesnt.. it means is a new product  -wchich means we add it to accumulator.
    -- shopProductsIds
    --     |> EverySet.foldl
    --         (\shopId acc ->
    --             if EverySet.member shopId firebaseProductsIds then
    --                 acc
    --             else
    --                 EverySet.insert shopId acc
    --         )
    --         EverySet.empty
    EverySet.diff shopProductsIds firebaseProductsIds


findAsociatedInternalProductId : ExternalProductId -> EveryDict InternalProductId InternalProduct -> Maybe InternalProductId
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


getPosiblyUpdatedProductsIds : EverySet ExternalProductId -> EverySet ExternalProductId -> EverySet ExternalProductId -> EverySet ExternalProductId
getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShopify =
    -- whatever external product id which is not created or deleted.. must be updated.
    -- so its everything in the big set except the createdOrDeleted
    let
        createdOrDeleted =
            EverySet.union createdProductsIds deletedProductsExternalIds
    in
        EverySet.diff createdOrDeleted externalProductIdsFromShopify


ensureItRelyNeedsUpdating : EveryDict InternalProductId InternalProduct -> ( InternalProductId, NormalizedProduct ) -> Bool
ensureItRelyNeedsUpdating internalProducts ( internalProductId, normalizedProduct ) =
    True


saveToFirebase : List InternalProductId -> List NormalizedProduct -> List ( InternalProductId, NormalizedProduct ) -> Cmd msg
saveToFirebase deleted created updated =
    { deleted =
        deleted
            |> List.map (\(InternalProductId id) -> id)
    , created =
        created
            |> List.map normalizedProductEncoder
    , updated =
        updated
            |> List.map
                (\( InternalProductId id, normalizedProduct ) ->
                    { id = id
                    , normalizedProduct = normalizedProductEncoder normalizedProduct
                    }
                )
    }
        |> Ports.saveToFirebase


getExternalCategoriesFromFirebase : EveryDict InternalCatId InternalCategory -> ShopName -> EverySet ExternalCatId
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
    -> ( EveryDict ExternalCatId (List ExternalProductId), EveryDict ExternalProductId (List ExternalCatId) )
extractAsociations mappings =
    mappings
        |> List.foldl
            (\( externalCatId, externalProductId ) ( acc1, acc2 ) ->
                ( updateOrInsert externalCatId externalProductId acc1
                , updateOrInsert externalProductId externalCatId acc2
                )
            )
            ( EveryDict.empty, EveryDict.empty )


updateOrInsert : key -> value -> EveryDict key (List value) -> EveryDict key (List value)
updateOrInsert key value dict =
    dict
        |> EveryDict.update key
            (\maybe_value ->
                case maybe_value of
                    Nothing ->
                        Just [ value ]

                    Just list ->
                        if listContains value list then
                            Just list
                        else
                            Just (list ++ [ value ])
            )


listContains : a -> List a -> Bool
listContains a list =
    List.filter (\item -> item == a) list
        |> (\list -> list == [] |> not)


getRelevantProductsIds :
    EveryDict ExternalCatId (List ExternalProductId)
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
                        productsIds
                            |> List.foldl (\id acc -> EverySet.insert id acc) acc
            )
            EverySet.empty


getRelevantProducts :
    EveryDict ExternalCatId (List ExternalProductId)
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
