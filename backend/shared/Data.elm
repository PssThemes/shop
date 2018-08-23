module Data exposing (..)

import Json.Decode as JD


-- import Dict exposing (Dict)

import EveryDict exposing (EveryDict)


-- import Set exposing (Set)

import Json.Decode.Pipeline as JDP
import Json.Encode as JE
import Rocket exposing ((=>))


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
    , short_description : String
    , description : String
    , media : List String

    -- , internalCatIds : EverySet InternalCatId
    }


shopEncoder : ShopName -> JE.Value
shopEncoder shopName =
    case shopName of
        Shopify ->
            "shopify" |> JE.string

        Prestashop ->
            "prestashop" |> JE.string


newlyCreatedProductEncoder : ShopName -> NormalizedProduct -> JE.Value
newlyCreatedProductEncoder shopName normalizedProduct =
    [ "shopName" => (shopName |> shopEncoder)
    , "externalId" => (normalizedProduct.externalId |> (\(ExternalProductId id) -> id) |> JE.string)
    , "name" => (normalizedProduct.name |> JE.string)
    , "short_description" => (normalizedProduct.short_description |> JE.string)
    , "price" => (normalizedProduct.price |> JE.float)
    , "externalCatIds" => ([] |> JE.list)
    , "internalCatIds" => ([] |> JE.list)

    -- TODO: check what is better.. a null for main image or an empty string? since null in firbase means the filed does not exist.
    , "mainImage" => (normalizedProduct.mainImage |> Maybe.map JE.string |> Maybe.withDefault JE.null)
    , "media" => (normalizedProduct.media |> List.map JE.string |> JE.list)
    , "isHidden" => (False |> JE.bool)
    , "howManyTimesWasOrdered" => (0 |> JE.int)
    ]
        |> JE.object


updatableProductDataEncoder : NormalizedProduct -> EverySet ExternalCatId -> JE.Value
updatableProductDataEncoder normalizedProduct externalCatIds =
    [ "externalId"
        => (normalizedProduct.externalId
                |> (\(ExternalProductId externalId) ->
                        JE.string externalId
                   )
           )
    , "name" => JE.string normalizedProduct.name
    , normalizedProduct.mainImage
        |> Maybe.map JE.string
        |> Maybe.withDefault JE.null
        |> (,) "mainImage"
    , "price" => (JE.float normalizedProduct.price)
    , "description" => (JE.string normalizedProduct.description)
    , "media"
        => (normalizedProduct.media
                |> List.map JE.string
                |> JE.list
           )
    , "externalCatIds"
        => (externalCatIds
                |> EverySet.map (\(ExternalCatId id) -> JE.string id)
                |> EverySet.toList
                |> JE.list
           )
    ]
        |> JE.object


normalizedProductsDecoder : JD.Decoder (EveryDict ExternalProductId NormalizedProduct)
normalizedProductsDecoder =
    JD.list normalizedProductDecoder
        |> JD.map
            (\list ->
                list
                    |> List.foldl
                        (\normalizedProduct acc ->
                            EveryDict.insert normalizedProduct.externalId normalizedProduct acc
                        )
                        EveryDict.empty
            )


normalizedProductDecoder : JD.Decoder NormalizedProduct
normalizedProductDecoder =
    JD.oneOf [ shopifyProductDecoder, prestashopProductDecoder ]


shopifyProductDecoder : JD.Decoder NormalizedProduct
shopifyProductDecoder =
    let
        getShopifyShortDescription : String -> String
        getShopifyShortDescription longDescription =
            -- TODO: create a proper function for  getting the short description out of the long descripotion
            -- since shopify does not have the notion of short_description by default.
            String.left 300 longDescription
    in
        JDP.decode
            (\id title maybe_mainImgSrc variants body_html images ->
                { externalId = ExternalProductId (toString id)
                , name = title
                , mainImage = maybe_mainImgSrc
                , price =
                    variants
                        |> List.head
                        |> Maybe.map
                            (\string ->
                                string
                                    |> String.toFloat
                                    |> Result.withDefault 0
                            )
                        |> Maybe.withDefault 0
                , short_description = getShopifyShortDescription body_html
                , description = body_html
                , media = []
                }
            )
            |> JDP.required "id" JD.int
            |> JDP.required "title" JD.string
            |> JDP.optionalAt [ "image", "src" ] (JD.string |> JD.map Just) Nothing
            |> JDP.required "variants" (JD.list (JD.field "price" JD.string))
            |> JDP.required "body_html" JD.string
            |> JDP.required "images" (JD.list (JD.field "src" JD.string))



-- |> JDP.required


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
            , price = price |> String.toFloat |> Result.withDefault 0
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
        |> JDP.required "price" JD.string
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
                    "shopify" ->
                        JD.succeed Shopify

                    "prestashop" ->
                        JD.succeed Prestashop

                    shopName ->
                        JD.fail ("invalid shop name :  " ++ shopName)
            )


shopifyCollectsDecoder : JD.Decoder (List ( ExternalCatId, ExternalProductId ))
shopifyCollectsDecoder =
    (JD.map2 (\catId prodId -> ( ExternalCatId (toString catId), ExternalProductId (toString prodId) ))
        (JD.field "collection_id" JD.int)
        (JD.field "product_id" JD.int)
    )
        |> JD.list


settingsDecoder : JD.Decoder Settings
settingsDecoder =
    (JD.map2
        (\shopify prestashop ->
            { shopify = shopify
            , prestashop = prestashop
            }
        )
        (JD.field "shopify"
            (JD.map3
                (\apiKey apiSecret shopName ->
                    { apiKey = apiKey
                    , apiSecret = apiSecret
                    , shopName = shopName
                    }
                )
                (JD.field "apiKey" JD.string)
                (JD.field "apiSecret" JD.string)
                (JD.field "shopName" JD.string)
            )
        )
        (JD.field "prestashop"
            (JD.map
                (\apiKey ->
                    { apiKey = apiKey
                    }
                )
                (JD.field "apiKey" JD.string)
            )
        )
    )
