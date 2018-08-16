module Logic exposing (..)

import Data exposing (..)
import EveryDict exposing (..)
import Json.Encode as JE
import Rocket exposing ((=>))
import Ports


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
