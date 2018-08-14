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


normalizedProductsDecoder : JD.Decoder (EveryDict ExternalProductId NormalizedProduct)
normalizedProductsDecoder =
    JD.list normalizedProductDecoder
        |> JD.map
            (\list ->
                list
                    |> List.foldl (\normalizedProduct acc -> EveryDict.insert normalizedProduct.externalId normalizedProduct acc) EveryDict.empty
            )


normalizedProductDecoder : JD.Decoder NormalizedProduct
normalizedProductDecoder =
    JD.oneOf [ shopifyProductDecoder, prestashopProductDecoder ]


shopifyProductDecoder : JD.Decoder NormalizedProduct
shopifyProductDecoder =
    -- JD.fail "not implemented"
    JDP.decode
        (\id title maybe_mainImgSrc variants body_html images ->
            { externalId = ExternalProductId id
            , name = title
            , mainImage = maybe_mainImgSrc
            , price = variants |> List.head |> Maybe.withDefault 0
            , description = body_html
            , media = images
            }
        )
        |> JDP.required "id" (JD.string)
        |> JDP.required "title" JD.string
        |> JDP.optionalAt [ "image", "src" ] (JD.string |> JD.map Just) Nothing
        -- rawProduct.variants[0].price
        |> JDP.required "variants" (JD.list (JD.field "price" JD.float))
        |> JDP.required "body_html" JD.string
        |> JDP.required "images" (JD.list (JD.field "src" JD.string))



-- {
--   externalProductId: rawProduct.id + '',
--   name: rawProduct.title || "",
--   mainProductImage: (rawProduct.image || {}).src || "",
--   price: rawProduct.variants[0].price || 0,
--   description: rawProduct.body_html || "",
--   media: media,
-- };


prestashopProductDecoder : JD.Decoder NormalizedProduct
prestashopProductDecoder =
    JD.fail "not implemented"


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
    JDP.decode
        (\selfId shopName externalId name short_description price externalCatIds internalCatIds mainImage media isHidden howManyTimesWasOrdered ->
            { selfId = InternalProductId selfId
            , shopName = shopName
            , externalId = ExternalProductId externalId
            , name = name
            , short_description = short_description
            , price = price
            , externalCatIds = externalCatIds |> List.map ExternalCatId |> EverySet.fromList
            , internalCatIds = internalCatIds |> List.map InternalCatId |> EverySet.fromList
            , mainImage = mainImage
            , media = media
            , isHidden = isHidden
            , howManyTimesWasOrdered = howManyTimesWasOrdered
            }
        )
        |> JDP.required "selfId" (JD.string)
        |> JDP.required "shopName" shopNameDecoder
        |> JDP.required "externalId" (JD.string)
        |> JDP.required "name" JD.string
        |> JDP.required "short_description" JD.string
        |> JDP.required "price" JD.float
        |> JDP.required "externalCatIds" (JD.list JD.string)
        |> JDP.required "internalCatIds" (JD.list JD.string)
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


shopifyCollectsDecoder : JD.Decoder (List ( ExternalCatId, ExternalProductId ))
shopifyCollectsDecoder =
    (JD.map2 (\catId prodId -> ( ExternalCatId catId, ExternalProductId prodId ))
        (JD.field "category_id" JD.string)
        (JD.field "product_id" JD.string)
    )
        |> JD.list
