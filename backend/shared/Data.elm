module Data exposing (..)

import Json.Decode as JD


-- import Dict exposing (Dict)

import EveryDict exposing (EveryDict)


-- import Set exposing (Set)

import Json.Decode.Pipeline as JDP


-- import Set exposing (Set)

import EverySet exposing (EverySet)


type ExternalProductId
    = ExternalProductId String


type ExternalCatId
    = ExternalCatId String


type InternalCatId
    = InternalCatId String


type InternalProductId
    = InternalProductId String


type ShopName
    = Shopify
    | Prestashop


type alias CategoryName =
    String


type alias InternalProduct =
    { selfId : InternalProductId

    -- external identification.
    , shopName : ShopName
    , externalId : ExternalProductId
    , name : String
    , short_description : String
    , price : Float

    --
    , externalCatIds : EverySet ExternalCatId
    , internalCatIds : EverySet InternalCatId

    --
    , mainImage : Maybe String
    , media : List String

    --
    , isHidden : Bool
    , howManyTimesWasOrdered : Int
    }


type alias InternalCategory =
    { selfId : InternalCatId
    , name : String
    , shopify : List ( ExternalCatId, CategoryName )
    , prestashop : List ( ExternalCatId, CategoryName )
    }


type alias Settings =
    { shopify :
        { apiKey : String
        , apiSecret : String
        , shopName : String
        }
    , prestashop :
        { apiKey : String
        }
    }


type alias NormalizedProduct =
    { externalId : ExternalProductId
    , name : String
    , mainImage : Maybe String
    , price : Float
    , description : String
    , media : List String
    }


internalCategoriesDecoder : JD.Decoder (EveryDict InternalCatId InternalCategory)
internalCategoriesDecoder =
    JD.list internalCategoryDecoder
        |> JD.map
            (\list ->
                List.foldl (\cat acc -> EveryDict.insert cat.selfId cat acc) EveryDict.empty list
            )


internalCategoryDecoder : JD.Decoder InternalCategory
internalCategoryDecoder =
    JD.map4
        (\selfId name maybe_shopify maybe_prestashop ->
            { selfId = InternalCatId selfId
            , name = name
            , shopify = Maybe.withDefault [] maybe_shopify
            , prestashop = Maybe.withDefault [] maybe_prestashop
            }
        )
        (JD.field "selfId" JD.string)
        (JD.field "name" JD.string)
        (JD.field "shopify" (JD.maybe (JD.list asociationDecoder)))
        (JD.field "prestashop" (JD.maybe (JD.list asociationDecoder)))


asociationDecoder : JD.Decoder ( ExternalCatId, CategoryName )
asociationDecoder =
    JD.map2 (\selfId name -> ( ExternalCatId selfId, name ))
        (JD.field "selfId" JD.string)
        (JD.field "name" JD.string)


internalProductsDecoder : JD.Decoder (EveryDict InternalProductId InternalProduct)
internalProductsDecoder =
    JD.list internalProductDecoder
        |> JD.map
            (\list ->
                list
                    |> List.foldl (\product acc -> EveryDict.insert product.selfId product acc) EveryDict.empty
            )


internalProductDecoder : JD.Decoder InternalProduct
internalProductDecoder =
    -- field selfId : InternalProductId
    --
    -- -- external identification.
    -- , shopName : ShopName
    -- , externalId : ExternalProductId
    -- , name : String
    -- , short_description : String
    -- , price : Float
    --
    -- --
    -- , externalCatIds : Set ExternalCatId
    -- , internalCatIds : Set InternalCatId
    --
    -- --
    -- , mainImage : Maybe String
    -- , media : List String
    --
    -- --
    -- , isHidden : Bool
    -- , howManyTimesWasOrdered : Int
    -- }
    JDP.decode
        (\selfId shopName externalId name short_description price externalCatIds internalCatIds mainImage media isHidden howManyTimesWasOrdered ->
            { selfId = selfId
            , shopName = shopName
            , externalId = externalId
            , name = name
            , short_description = short_description
            , price = price
            , externalCatIds = externalCatIds
            , internalCatIds = internalCatIds
            , mainImage = mainImage
            , media = media
            , isHidden = isHidden
            , howManyTimesWasOrdered = howManyTimesWasOrdered
            }
        )
        |> JDP.required "selfId" (JD.string |> JD.map InternalProductId)
        |> JDP.required "shopName" shopNameDecoder
        |> JDP.required "externalId" (JD.string |> JD.map ExternalProductId)
        |> JDP.required "name" JD.string
        |> JDP.required "short_description" JD.string
        |> JDP.required "price" JD.float
        |> JDP.required "externalCatIds" (JD.list JD.string |> JD.map (\list -> list |> List.map ExternalCatId |> EverySet.fromList))
        |> JDP.required "internalCatIds" (JD.list JD.string |> JD.map (\list -> list |> List.map InternalCatId |> EverySet.fromList))
        |> JDP.optional "mainImage" (JD.string |> JD.map (\x -> Just x)) Nothing
        |> JDP.required "media" (JD.list JD.string)
        |> JDP.required "isHidden" JD.bool
        |> JDP.required "howManyTimesWasOrdered" JD.int


shopNameDecoder : JD.Decoder ShopName
shopNameDecoder =
    JD.string
        |> JD.andThen
            (\string ->
                case string of
                    "Shopify" ->
                        JD.succeed Shopify

                    "Prestashop" ->
                        JD.succeed Prestashop

                    shopName ->
                        JD.fail ("invalid shop name :  " ++ shopName)
            )
