module Data exposing (..)

import Json.Decode as JD


type ExternalProductId
    = ExternalProductId String


type alias InternalProduct =
    { externalProductId : ExternalProductId
    , name : String
    , mainProductImage : Maybe String
    , price : Float
    , media : List String
    }


type alias NormalizedProduct =
    {}



-- const normalizedProductData = {
--   externalProductId: rawProduct.id + '',
--   name: rawProduct.title || "",
--   mainProductImage: (rawProduct.image || {}).src || "",
--   price: rawProduct.variants[0].price || 0,
--   description: rawProduct.body_html || "",
--   media: media,
-- };
