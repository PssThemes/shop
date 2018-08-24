module Data exposing (..)

import Json.Decode as JD


-- import Dict exposing (Dict)

import EveryDict exposing (EveryDict)


-- import Set exposing (Set)

import Json.Decode.Pipeline as JDP
import Json.Encode as JE


-- import Rocket exposing ((=>))
-- import Set exposing (Set)

import EverySet exposing (EverySet)


-- #region Settings
-----------------------------------------------------------------
--  Settings
-----------------------------------------------------------------


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



-- #endregion Settings
--
-- #region Internal Categories
-----------------------------------------------------------------
-- Internal Categories
-----------------------------------------------------------------


type InternalCatId
    = InternalCatId String


type alias CategoryName =
    String


type alias InternalCategory =
    { selfId : InternalCatId
    , name : String
    , shopify : List ( ExternalCatId, CategoryName )
    , prestashop : List ( ExternalCatId, CategoryName )
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



-- #endregion Internal Categories
--
-- #region External Categories
-----------------------------------------------------------------
-- External Categories
-----------------------------------------------------------------


type ExternalCatId
    = ExternalCatId String


type alias RawShopifyCollect =
    { collection_id : Int
    , product_id : Int
    }


shopifyCollectsDecoder : JD.Decoder (List ( ExternalCatId, ExternalProductId ))
shopifyCollectsDecoder =
    (JD.map2 (\catId prodId -> ( ExternalCatId (toString catId), ExternalProductId (toString prodId) ))
        (JD.field "collection_id" JD.int)
        (JD.field "product_id" JD.int)
    )
        |> JD.list



-- #endregion External Categories
--
-- #region Shop name
-----------------------------------------------------------------
-- Shop name
-----------------------------------------------------------------


type ShopName
    = Shopify
    | Prestashop


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


shopNameEncoder : ShopName -> JE.Value
shopNameEncoder shopName =
    case shopName of
        Shopify ->
            "shopify" |> JE.string

        Prestashop ->
            "prestashop" |> JE.string



-- #endregion External Categories
--
-- #region Internal Products
-----------------------------------------------------------------
-- Internal Products
-----------------------------------------------------------------


type InternalProductId
    = InternalProductId String


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



-- #endregion Internal Products
--
-- #region External Product Id
-----------------------------------------------------------------
-- External Products
-----------------------------------------------------------------


type ExternalProductId
    = ExternalProductId String


type alias RawShopifyProduct =
    { id : Int
    , title : String
    , body_html : String
    , images : List { src : String }
    , image : Maybe { src : String }
    , variants : List { price : String }
    }


type alias RawPrestashopProduct =
    { id : Int
    , name : String
    , price : String
    , description : String
    , description_short : String
    , associations :
        { categories : List { id : String }
        , images : List { id : String }
        }
    }


type alias NormalizedProduct =
    { externalId : ExternalProductId
    , externalCatIds : EverySet ExternalCatId

    --
    , name : String
    , price : Float

    --
    , short_description : String
    , description : String

    --
    , mainImage : Maybe String
    , media : List String
    }


rawRawShopifyProductsDecoder : JD.Decoder (List RawShopifyProduct)
rawRawShopifyProductsDecoder =
    JD.list rawRawShopifyProductDecoder


rawRawShopifyProductDecoder : JD.Decoder RawShopifyProduct
rawRawShopifyProductDecoder =
    JDP.decode
        (\id title body_html images maybe_image variants ->
            { id = id
            , title = title
            , body_html = body_html
            , images = images
            , image = maybe_image
            , variants = variants
            }
        )
        |> JDP.required "id" (JD.int)
        |> JDP.required "title" (JD.string)
        |> JDP.required "body_html" (JD.string)
        |> JDP.required "images" (JD.list (JD.field "src" JD.string |> JD.map (\src -> { src = src })))
        |> JDP.optional "image" ((JD.field "src" JD.string |> JD.map (\src -> Just { src = src }))) Nothing
        |> JDP.required "variants" (JD.list (JD.field "price" JD.string |> JD.map (\price -> { price = price })))


rawPrestashopProductsDecoder : JD.Decoder (List RawPrestashopProduct)
rawPrestashopProductsDecoder =
    JD.list rawPrestashopProductDecoder


rawPrestashopProductDecoder : JD.Decoder RawPrestashopProduct
rawPrestashopProductDecoder =
    JDP.decode
        (\id name price description description_short categories images ->
            { id = id
            , name = name
            , price = price
            , description = description
            , description_short = description_short
            , associations =
                { categories = categories
                , images = images
                }
            }
        )
        |> JDP.required "id" (JD.int)
        |> JDP.required "name" (JD.string)
        |> JDP.required "price" (JD.string)
        |> JDP.required "description" (JD.string)
        |> JDP.required "description_short" (JD.string)
        |> JDP.requiredAt [ "associations", "categories" ] (JD.list (JD.field "id" JD.string |> JD.map (\id -> { id = id })))
        |> JDP.requiredAt [ "associations", "images" ] (JD.list (JD.field "id" JD.string |> JD.map (\id -> { id = id })))



-- #endregion External Product Id
--
-- #region Transformer constructs
-----------------------------------------------------------------
-- Transformer constructs
-----------------------------------------------------------------
--
--
-- EverySet InternalCatId


transformRawShopifyProduct : RawShopifyProduct -> List ExternalCatId -> NormalizedProduct
transformRawShopifyProduct rawProduct externalCats =
    let
        getShortDescription : String -> String
        getShortDescription description =
            String.left 300 description
    in
        { externalId = ExternalProductId (toString rawProduct.id)
        , externalCatIds = EverySet.fromList externalCats

        --
        , name = rawProduct.title
        , price =
            rawProduct.variants
                |> List.head
                |> Maybe.map (\obj -> obj |> .price >> String.toFloat)
                |> Maybe.map (Result.withDefault 0)
                |> Maybe.withDefault 0

        --
        , short_description = getShortDescription rawProduct.body_html
        , description = rawProduct.body_html

        --
        , mainImage = rawProduct.image |> Maybe.map (\obj -> .src obj)
        , media = List.map .src rawProduct.images
        }



-- rawProduct
-- type alias RawShopifyProduct =
--     { id : Int
--     , title : String
--     , body_html : String
--     , images : List { src : String }
--     , image : { src : String }
--     , variants : List { price : String }
--     }
--
--
--
-- { externalId : ExternalProductId
-- , internalCatIds : EverySet InternalCatId
--
-- --
-- , name : String
-- , price : Float
--
-- --
-- , short_description : String
-- , description : String
--
-- --
-- , mainImage : Maybe String
-- , media : List String
-- }
-- #endregion Transformer constructs
