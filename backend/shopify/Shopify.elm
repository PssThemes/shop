module Shopify exposing (..)

-- import AllDict exposing (..)

import Data exposing (..)
import Logic


-- import Dict exposing (Dict)

import Json.Decode as JD
import Json.Encode as JE
import Platform
import Ports
import Process
import Rocket exposing ((=>))
import Task
import EveryDict exposing (EveryDict)
import EverySet exposing (EverySet)


je1 : JE.Value
je1 =
    JE.int 2


jd1 : JD.Decoder Int
jd1 =
    JD.int


main : Program Never Model Msg
main =
    { init = Rocket.batchInit init
    , update = update >> Rocket.batchUpdate
    , subscriptions = subscriptions
    }
        |> Platform.program


type alias Model =
    { settings : Maybe Settings
    , internalCategories : Maybe (EveryDict InternalCatId InternalCategory)
    , internalProducts : Maybe (EveryDict InternalProductId InternalProduct)
    , externalProducts : Maybe (EveryDict ExternalProductId NormalizedProduct)
    , shopifyCollects : Maybe (List ( ExternalCatId, ExternalProductId ))
    }


init : ( Model, List (Cmd Msg) )
init =
    ( { settings = Nothing
      , internalCategories = Nothing
      , internalProducts = Nothing
      , externalProducts = Nothing
      , shopifyCollects = Nothing
      }
    , []
    )


type Msg
    = Start
    | Finish
    | ReceivedSettings Settings
    | ReceivedInternalCategories (EveryDict InternalCatId InternalCategory)
    | ReceivedInternalProducts (EveryDict InternalProductId InternalProduct)
    | ReceivedNormalizedProduct (EveryDict ExternalProductId NormalizedProduct)
    | ReceivedShopifyCollects (List ( ExternalCatId, ExternalProductId ))
    | DecodingError String
    | Work


selfCall : Msg -> Cmd Msg
selfCall msg =
    Task.perform (\_ -> msg) (Task.succeed ())


update : Msg -> Model -> ( Model, List (Cmd Msg) )
update msg model =
    (case msg of
        Start ->
            [ Process.sleep 6000
                |> Task.andThen (\_ -> Task.succeed ())
                |> Task.perform (\_ -> Finish)
            ]
                |> (,) model

        Finish ->
            [ Ports.finish () ]
                |> (,) model

        ReceivedSettings settings ->
            { model | settings = Just settings }
                => [ selfCall Work ]

        ReceivedInternalCategories intCats ->
            { model | internalCategories = Just intCats } => [ selfCall Work ]

        ReceivedInternalProducts internalProducts ->
            { model | internalProducts = Just internalProducts } => [ selfCall Work ]

        ReceivedNormalizedProduct normalizedProducts ->
            { model | externalProducts = Just normalizedProducts }
                => [ selfCall Work ]

        ReceivedShopifyCollects collects ->
            { model | shopifyCollects = Just collects } => [ selfCall Work ]

        Work ->
            Maybe.map5
                (\settings internalCategories internalProducts externalProducts shopifyCollects ->
                    let
                        externalCategoriesIdsFormFirebase : EverySet ExternalCatId
                        externalCategoriesIdsFormFirebase =
                            Logic.getExternalCategoriesFromFirebase internalCategories Shopify

                        ( oneExtCatToManyExtProducts, oneExtProductToManyExtCats ) =
                            Logic.extractAsociations shopifyCollects

                        relevantProducts : EveryDict ExternalProductId NormalizedProduct
                        relevantProducts =
                            Logic.getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase externalProducts

                        externalProductIdsFromFirebase : EverySet ExternalProductId
                        externalProductIdsFromFirebase =
                            Logic.getExternalProductIdsFromFirebase internalProducts

                        externalProductIdsFromShopify : EverySet ExternalProductId
                        externalProductIdsFromShopify =
                            Logic.getExternalProductsIdsFromShopify externalProducts

                        deletedProductsExternalIds : EverySet ExternalProductId
                        deletedProductsExternalIds =
                            Logic.getDeletedProductsIds externalProductIdsFromFirebase externalProductIdsFromShopify

                        deletedProducts : List InternalProductId
                        deletedProducts =
                            deletedProductsExternalIds
                                |> EverySet.map (\externalProductId -> Logic.findAsociatedInternalProductId externalProductId internalProducts)
                                |> EverySet.toList
                                |> Logic.removeNothings

                        createdProductsIds : EverySet ExternalProductId
                        createdProductsIds =
                            Logic.getCreatedProductsIds externalProductIdsFromFirebase externalProductIdsFromShopify

                        createdProducts : List NormalizedProduct
                        createdProducts =
                            createdProductsIds
                                |> EverySet.map (\externalProductId -> EveryDict.get externalProductId relevantProducts)
                                |> EverySet.toList
                                |> Logic.removeNothings

                        updatedProducts : List ( InternalProductId, NormalizedProduct )
                        updatedProducts =
                            Logic.getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShopify
                                |> EverySet.map
                                    (\externalProductId ->
                                        ( EveryDict.get externalProductId relevantProducts, Logic.findAsociatedInternalProductId externalProductId internalProducts )
                                            |> (\( maybe_NormalizedProduct, maybe_InternalProductId ) -> Maybe.map2 (,) maybe_InternalProductId maybe_NormalizedProduct)
                                    )
                                |> EverySet.toList
                                |> Logic.removeNothings
                                |> List.filter (Logic.ensureItRelyNeedsUpdating internalProducts)
                    in
                        model
                            => [ Logic.saveToFirebase deletedProducts createdProducts updatedProducts
                               ]
                )
                model.settings
                model.internalCategories
                model.internalProducts
                model.externalProducts
                model.shopifyCollects
                |> Maybe.withDefault (model => [])

        DecodingError error ->
            model
                => []
                |> Debug.log ("DecodingError errr: " ++ error)
    )
        |> (\( model, cmds ) ->
                let
                    _ =
                        Debug.log "new model: " model.internalCategories
                in
                    ( model, cmds )
           )


subscriptions : Model -> Sub Msg
subscriptions model =
    [ Ports.start (\_ -> Start)
    , Ports.received_settings
        (\value ->
            case JD.decodeValue settingsDecoder value of
                Ok settings ->
                    ReceivedSettings settings

                Err error ->
                    DecodingError error
        )
    , Ports.received_internalCategories
        (\value ->
            case JD.decodeValue internalCategoriesDecoder value of
                Ok internalCategories ->
                    ReceivedInternalCategories internalCategories

                Err error ->
                    DecodingError error
        )
    , Ports.received_InternalProducts
        (\value ->
            case JD.decodeValue internalProductsDecoder value of
                Ok internalProducts ->
                    ReceivedInternalProducts internalProducts

                Err error ->
                    DecodingError error
        )
    , Ports.received_ExternalProducts
        (\value ->
            case JD.decodeValue normalizedProductsDecoder value of
                Ok normalizedProducts ->
                    ReceivedNormalizedProduct normalizedProducts

                Err error ->
                    DecodingError error
        )
    , Ports.received_Collects
        (\value ->
            case JD.decodeValue shopifyCollectsDecoder value of
                Ok normalizedProducts ->
                    ReceivedShopifyCollects normalizedProducts

                Err error ->
                    DecodingError error
        )
    ]
        |> Sub.batch