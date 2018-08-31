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
    , workIsDone : Bool
    }


init : ( Model, List (Cmd Msg) )
init =
    ( { settings = Nothing
      , internalCategories = Nothing
      , internalProducts = Nothing
      , rawShopifyProducts = Nothing
      , shopifyCollects = Nothing
      , workIsDone = False
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
    | Work String


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
                => [ selfCall (Work "ReceivedSettings") ]

        ReceivedInternalCategories intCats ->
            { model | internalCategories = Just intCats } => [ selfCall (Work "ReceivedInternalCategories") ]

        ReceivedInternalProducts internalProducts ->
            -- let
            --     -- _ =
            --     --     Debug.log "internalProducts: " internalProducts
            --     -- _ =
            --     --     Debug.log "" "----------------------------------------------"
            -- in
            { model
                | internalProducts =
                    internalProducts
                        |> List.map (\product -> ( product.selfId, product ))
                        |> EveryDict.fromList
                        |> Just
            }
                => [ selfCall (Work "ReceivedInternalProducts") ]

        ReceivedRawProducts rawShopifyProducts ->
            { model | rawShopifyProducts = Just rawShopifyProducts }
                => [ selfCall (Work "ReceivedRawProducts") ]

        ReceivedShopifyCollects collects ->
            { model | shopifyCollects = Just collects } => [ selfCall (Work "ReceivedShopifyCollects") ]

        Work fromWhere ->
            if model.workIsDone then
                model => []
            else
                Maybe.map5
                    (\settings internalCategories internalProducts rawShopifyProducts shopifyCollects ->
                        let
                            _ =
                                Debug.log "Work................................. fromWhere: " fromWhere

                            externalCategoriesIdsFormFirebase : EverySet ExternalCatId
                            externalCategoriesIdsFormFirebase =
                                Logic.getExternalCategoriesFromFirebase internalCategories Shopify

                            -- |> Debug.log "externalCategoriesIdsFormFirebase: "
                            externalCategoriesFromShop : EverySet ExternalCatId
                            externalCategoriesFromShop =
                                shopifyCollects |> List.map Tuple.first |> EverySet.fromList

                            emptyedOrDeletedExternalCategories : EverySet ExternalCatId
                            emptyedOrDeletedExternalCategories =
                                -- empty because the shop does not give emopty categories in collects.
                                EverySet.diff externalCategoriesIdsFormFirebase externalCategoriesFromShop

                            ( oneExtCatToManyExtProducts, oneExtProductToManyExtCats ) =
                                Logic.extractCategoryProductAsociations shopifyCollects

                            _ =
                                Debug.log "oneExtProductToManyExtCats: " oneExtProductToManyExtCats

                            ( oneExtCatToManyIntCats, oneIntToManyExtCats ) =
                                Logic.extractCateogoryToCategoryAssociations Shopify internalCategories

                            allShopProducts : EveryDict ExternalProductId NormalizedProduct
                            allShopProducts =
                                rawShopifyProducts
                                    |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
                                    |> List.map (\p -> ( p.externalId, p ))
                                    |> EveryDict.fromList
                                    |> (\allProd -> log2 "allShopProducts: " (EveryDict.keys allProd |> (\x -> ( List.length x, x ))) allProd)

                            -- _ =
                            --     Debug.log "oneExtCatToManyExtProducts: " oneExtCatToManyExtProducts
                            relevantShopProducts : EveryDict ExternalProductId NormalizedProduct
                            relevantShopProducts =
                                allShopProducts
                                    |> Logic.getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase
                                    |> (\allProd -> log2 "relevantShopProducts: " (EveryDict.keys allProd |> (\x -> ( List.length x, x ))) allProd)

                            -- |> Debug.log "relevantShopProducts: "
                            externalProductIdsFromFirebase : EverySet ExternalProductId
                            externalProductIdsFromFirebase =
                                Logic.getExternalProductIdsFromFirebase internalProducts

                            --
                            -- -- |> Debug.log "externalProductIdsFromFirebase: "
                            externalProductIdsFromShop : EverySet ExternalProductId
                            externalProductIdsFromShop =
                                -- TODO: think if this is supposed to be relevant producxts or just all Products..????
                                Logic.getExternalProductsIdsFromShop allShopProducts

                            -- -- |> Debug.log "externalProductIdsFromShop: "
                            deletedProductsExternalIds : EverySet ExternalProductId
                            deletedProductsExternalIds =
                                Logic.getDeletedProductsIds
                                    externalProductIdsFromFirebase
                                    externalProductIdsFromShop
                                    emptyedOrDeletedExternalCategories
                                    allShopProducts
                                    |> Debug.log "deletedProductsExternalIds: "

                            deletedProductsInternalIds : List InternalProductId
                            deletedProductsInternalIds =
                                deletedProductsExternalIds
                                    |> EverySet.map (\externalProductId -> Logic.findAsociatedInternalProductId externalProductId internalProducts)
                                    |> EverySet.toList
                                    |> Logic.removeNothings
                                    |> Debug.log "deletedProductsInternalIds: "

                            -- |> Debug.log "deletedProducts Firebase Ids: "
                            createdProductsIds : EverySet ExternalProductId
                            createdProductsIds =
                                Logic.getCreatedProductsIds externalProductIdsFromFirebase externalProductIdsFromShop

                            -- |> Debug.log "createdProductsIds: "
                            createdProducts : List NormalizedProduct
                            createdProducts =
                                createdProductsIds
                                    |> EverySet.map (\externalProductId -> EveryDict.get externalProductId relevantShopProducts)
                                    |> EverySet.toList
                                    |> Logic.removeNothings

                            -- |> Debug.log "createdProducts: "
                            updatedProducts : List ( InternalProductId, NormalizedProduct )
                            updatedProducts =
                                Logic.getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShop
                                    -- |> Debug.log "updatedProducts IDs: "
                                    |> EverySet.map
                                        (\externalProductId ->
                                            ( EveryDict.get externalProductId relevantShopProducts, Logic.findAsociatedInternalProductId externalProductId internalProducts )
                                                |> (\( maybe_NormalizedProduct, maybe_InternalProductId ) -> Maybe.map2 (,) maybe_InternalProductId maybe_NormalizedProduct)
                                        )
                                    |> EverySet.toList
                                    |> Logic.removeNothings
                                    |> List.filter (Logic.ensureItRelyNeedsUpdating internalProducts oneExtProductToManyExtCats)
                        in
                            -- saveToFirebase shopName deleted created updated oneExtProductToManyExtCats oneExternalCatIdToManyInternalCatIds
                            { model | workIsDone = True }
                                => [ Logic.saveToFirebase
                                        Shopify
                                        deletedProductsInternalIds
                                        createdProducts
                                        updatedProducts
                                        oneExtProductToManyExtCats
                                        oneExtCatToManyIntCats
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


log2 : String -> a -> b -> b
log2 text a b =
    let
        _ =
            Debug.log text a
    in
        b


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
