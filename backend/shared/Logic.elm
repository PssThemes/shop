module Logic exposing (..)

import Data exposing (..)
import EveryDict exposing (..)


-- import Json.Encode as JE
-- import Rocket exposing ((=>))

import Ports
import EverySet exposing (EverySet)


getDeletedProductsIds : List ExternalProductId -> List ExternalProductId -> List ExternalProductId
getDeletedProductsIds firebaseProducts shopProducts =
    []


getCreatedProductsIds : List ExternalProductId -> List ExternalProductId -> List ExternalProductId
getCreatedProductsIds firebaseProducts shopProducts =
    []


findAsociatedInternalProductId : ExternalProductId -> EveryDict InternalProductId InternalProduct -> Maybe InternalProductId
findAsociatedInternalProductId externalProductId internalProducts =
    Nothing


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


getPosiblyUpdatedProductsIds : List ExternalProductId -> List ExternalProductId -> List ExternalProductId -> List ExternalProductId
getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShopify =
    []


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
                        Just (list ++ [ value ])
            )


getRelevantProducts : EveryDict ExternalProductId NormalizedProduct -> EverySet ExternalCatId -> EveryDict ExternalProductId NormalizedProduct
getRelevantProducts allExternalProducts asociatedExternalCategories =
    -- allExternalProducts
    --     |> EveryDict.filter
    --         (\k normalizedProduct ->
    --             normalizedProduct
    --         )
    --
    EveryDict.empty



-- externalCategories
--   |> EveryDict.foldl  (\ k v acc ->
--
--
--   ) []
--
--
--
