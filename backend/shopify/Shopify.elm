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
    , rawShopifyProducts : Maybe (List RawShopifyProduct)
    , shopifyCollects : Maybe (List ( ExternalCatId, ExternalProductId ))
    }


init : ( Model, List (Cmd Msg) )
init =
    ( { settings = Nothing
      , internalCategories = Nothing
      , internalProducts = Nothing
      , rawShopifyProducts = Nothing
      , shopifyCollects = Nothing
      }
    , []
    )


type Msg
    = Start
    | Finish
    | ReceivedSettings Settings
    | ReceivedInternalCategories (EveryDict InternalCatId InternalCategory)
    | ReceivedInternalProducts (List InternalProduct)
    | ReceivedRawProducts (List RawShopifyProduct)
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
            let
                _ =
                    Debug.log "internalProducts: " internalProducts

                _ =
                    Debug.log "" "----------------------------------------------"
            in
                { model
                    | internalProducts =
                        internalProducts
                            |> List.map (\product -> ( product.selfId, product ))
                            |> EveryDict.fromList
                            |> Just
                }
                    => [ selfCall Work ]

        ReceivedRawProducts rawShopifyProducts ->
            { model | rawShopifyProducts = Just rawShopifyProducts }
                => [ selfCall Work ]

        ReceivedShopifyCollects collects ->
            { model | shopifyCollects = Just collects } => [ selfCall Work ]

        Work ->
            Maybe.map5
                (\settings internalCategories internalProducts rawShopifyProducts shopifyCollects ->
                    let
                        _ =
                            Debug.log "hmm." "yes.."

                        externalCategoriesIdsFormFirebase : EverySet ExternalCatId
                        externalCategoriesIdsFormFirebase =
                            Logic.getExternalCategoriesFromFirebase internalCategories Shopify

                        -- |> Debug.log "externalCategoriesIdsFormFirebase: "
                        ( oneExtCatToManyExtProducts, oneExtProductToManyExtCats ) =
                            Logic.extractCategoryProductAsociations shopifyCollects

                        ( oneExtCatToManyIntCats, oneIntToManyExtCats ) =
                            Logic.extractCateogoryToCategoryAssociations Shopify internalCategories

                        allShopProducts : EveryDict ExternalProductId NormalizedProduct
                        allShopProducts =
                            rawShopifyProducts
                                |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
                                |> List.map (\p -> ( p.externalId, p ))
                                |> EveryDict.fromList

                        relevantShopProducts : EveryDict ExternalProductId NormalizedProduct
                        relevantShopProducts =
                            allShopProducts
                                |> Logic.getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase

                        externalProductIdsFromFirebase : EverySet ExternalProductId
                        externalProductIdsFromFirebase =
                            Logic.getExternalProductIdsFromFirebase internalProducts

                        --
                        -- -- |> Debug.log "externalProductIdsFromFirebase: "
                        externalProductIdsFromShop : EverySet ExternalProductId
                        externalProductIdsFromShop =
                            -- TODO: think if this is supposed to be relevant producxts or just all Products..????
                            Logic.getExternalProductsIdsFromShop allShopProducts

                        --
                        -- -- |> Debug.log "externalProductIdsFromShop: "
                        deletedProductsExternalIds : EverySet ExternalProductId
                        deletedProductsExternalIds =
                            Logic.getDeletedProductsIds externalProductIdsFromFirebase externalProductIdsFromShop
                                |> Debug.log "deletedProductsExternalIds: "

                        deletedProductsInternalIds : List InternalProductId
                        deletedProductsInternalIds =
                            deletedProductsExternalIds
                                |> EverySet.map (\externalProductId -> Logic.findAsociatedInternalProductId externalProductId internalProducts)
                                |> EverySet.toList
                                |> Logic.removeNothings
                                |> Debug.log "deletedProducts Firebase Ids: "

                        createdProductsIds : EverySet ExternalProductId
                        createdProductsIds =
                            Logic.getCreatedProductsIds externalProductIdsFromFirebase externalProductIdsFromShop
                                |> Debug.log "createdProductsIds: "

                        createdProducts : List NormalizedProduct
                        createdProducts =
                            createdProductsIds
                                |> EverySet.map (\externalProductId -> EveryDict.get externalProductId relevantShopProducts)
                                |> EverySet.toList
                                |> Logic.removeNothings

                        updatedProducts : List ( InternalProductId, NormalizedProduct )
                        updatedProducts =
                            Logic.getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShop
                                |> EverySet.map
                                    (\externalProductId ->
                                        ( EveryDict.get externalProductId relevantShopProducts, Logic.findAsociatedInternalProductId externalProductId internalProducts )
                                            |> (\( maybe_NormalizedProduct, maybe_InternalProductId ) -> Maybe.map2 (,) maybe_InternalProductId maybe_NormalizedProduct)
                                    )
                                |> EverySet.toList
                                |> Logic.removeNothings
                                |> List.filter (Logic.ensureItRelyNeedsUpdating internalProducts oneExtProductToManyExtCats)
                                |> Debug.log "updatedProducts: "
                    in
                        model
                            => [-- Logic.saveToFirebase deletedProductsInternalIds createdProducts updatedProducts oneExtProductToManyExtCats
                               ]
                )
                model.settings
                model.internalCategories
                model.internalProducts
                model.rawShopifyProducts
                model.shopifyCollects
                |> Maybe.withDefault
                    (-- let
                     --     _ =
                     --         Debug.log "with default.. " model
                     --  in
                     model => []
                    )

        DecodingError error ->
            model
                => []
                |> Debug.log ("DecodingError errr: " ++ error)
    )
        |> (\( model, cmds ) ->
                -- let
                --     _ =
                --         Debug.log "new model: " model.internalCategories
                -- in
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
            case JD.decodeValue (JD.list internalProductDecoder) value of
                Ok internalProducts ->
                    ReceivedInternalProducts internalProducts

                Err error ->
                    DecodingError error
        )
    , Ports.received_ExternalProducts
        (\value ->
            case JD.decodeValue rawRawShopifyProductsDecoder value of
                Ok rawShopifyProducts ->
                    ReceivedRawProducts rawShopifyProducts

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
