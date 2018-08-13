module Data exposing (..)

-- import Json.Decode as JD

import Set exposing (Set)


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



-- type ShopifyProduct =
--   ShopifyProduct {
--     name: String
--
-- }


type alias InternalProduct =
    { selfId : InternalProductId

    -- external identification.
    , shopName : ShopName
    , externalId : ExternalProductId
    , name : String
    , short_description : String
    , price : Float

    --
    , externalCatIds : Set ExternalCatId
    , internalCatIds : Set InternalCatId

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



-- const normalizedProductData = {
--   externalProductId: rawProduct.id + '',
--   name: rawProduct.title || "",
--   mainProductImage: (rawProduct.image || {}).src || "",
--   price: rawProduct.variants[0].price || 0,
--   description: rawProduct.body_html || "",
--   media: media,
-- };
