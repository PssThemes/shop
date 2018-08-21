module FakeData exposing (..)

import Data exposing (..)
import EveryDict exposing (EveryDict)
import Rocket exposing ((=>))
import EverySet exposing (..)
import Logic


internalCategories : EveryDict InternalCatId InternalCategory
internalCategories =
    [ InternalCatId "internalCatId|1111"
        => { selfId = InternalCatId "internalCatId|1111"
           , name = "category 1"
           , shopify =
                [ ExternalCatId "externalCatId|1" => "extenral category 1"
                ]
           , prestashop =
                [-- ExternalCatId "externalCatId|bbbb" => "extenral category bbbb"
                ]
           }
    , InternalCatId "internalCatId|2222"
        => { selfId = InternalCatId "internalCatId|2222"
           , name = "category 2"
           , shopify =
                [ ExternalCatId "externalCatId|1" => "extenral category 1"
                , ExternalCatId "externalCatId|2" => "extenral category 2"
                ]
           , prestashop = []
           }
    ]
        |> EveryDict.fromList


internalProducts : EveryDict InternalProductId InternalProduct
internalProducts =
    [ InternalProductId "internalProductId|1"
        => { selfId = InternalProductId "internalProductId|1"

           -- external identification.
           , shopName = Shopify
           , externalId = ExternalProductId "externalProductId|1"
           , name = "Product 1"
           , short_description = "desciption for product 1"
           , price = 0

           --
           , externalCatIds = EverySet.empty
           , internalCatIds = EverySet.empty

           --
           , mainImage = Nothing
           , media = []

           --
           , isHidden = True
           , howManyTimesWasOrdered = 2
           }
    , InternalProductId "internalProductId|2"
        => { selfId = InternalProductId "internalProductId|2"

           -- external identification.
           , shopName = Shopify
           , externalId = ExternalProductId "externalProductId|2"
           , name = "Product 2"
           , short_description = "desciption for product 2"
           , price = 0

           --
           , externalCatIds = EverySet.empty
           , internalCatIds = EverySet.empty

           --
           , mainImage = Nothing
           , media = []

           --
           , isHidden = False
           , howManyTimesWasOrdered = 0
           }
    , InternalProductId "internalProductId|3"
        => { selfId = InternalProductId "internalProductId|3"

           -- external identification.
           , shopName = Shopify
           , externalId = ExternalProductId "externalProductId|3"
           , name = "Product 3"
           , short_description = "desciption for product 3"
           , price = 0

           --
           , externalCatIds = EverySet.empty
           , internalCatIds = EverySet.empty

           --
           , mainImage = Nothing
           , media = []

           --
           , isHidden = False
           , howManyTimesWasOrdered = 0
           }
    , InternalProductId "internalProductId|4"
        => { selfId = InternalProductId "internalProductId|4"

           -- external identification.
           , shopName = Shopify
           , externalId = ExternalProductId "externalProductId|4"
           , name = "Product 4"
           , short_description = "desciption for product 4"
           , price = 0

           --
           , externalCatIds = EverySet.empty
           , internalCatIds = EverySet.empty

           --
           , mainImage = Nothing
           , media = []

           --
           , isHidden = False
           , howManyTimesWasOrdered = 0
           }
    ]
        |> EveryDict.fromList


externalProducts : EveryDict ExternalProductId NormalizedProduct
externalProducts =
    [ ExternalProductId "externalProductId|1"
        => { externalId = ExternalProductId "externalProductId|1"
           , name = "external poduct 1"
           , mainImage = Nothing
           , price = 0
           , description = ""
           , media = []
           }

    -- , ExternalProductId "externalProductId|2"
    --     => { externalId = ExternalProductId "externalProductId|2"
    --        , name = "external poduct 2"
    --        , mainImage = Nothing
    --        , price = 0
    --        , description = ""
    --        , media = []
    --        }
    , ExternalProductId "externalProductId|3"
        => { externalId = ExternalProductId "externalProductId|3"
           , name = "external poduct 3"
           , mainImage = Nothing
           , price = 0
           , description = ""
           , media = []
           }

    -- , ExternalProductId "externalProductId|4"
    --     => { externalId = ExternalProductId "externalProductId|4"
    --        , name = "external poduct 4"
    --        , mainImage = Nothing
    --        , price = 0
    --        , description = ""
    --        , media = []
    --        }
    ]
        |> EveryDict.fromList


shopifyCollects : List ( ExternalCatId, ExternalProductId )
shopifyCollects =
    [ ExternalCatId "externalCatId|1" => ExternalProductId "externalProductId|1"

    -- , ExternalCatId "externalCatId|1" => ExternalProductId "externalProductId|2"
    -- , ExternalCatId "externalCatId|1" => ExternalProductId "externalProductId|3"
    , ExternalCatId "externalCatId|2" => ExternalProductId "externalProductId|4"
    , ExternalCatId "externalCatId|3" => ExternalProductId "externalProductId|3"
    , ExternalCatId "externalCatId|4" => ExternalProductId "externalProductId|4"
    ]


stuff =
    let
        externalProductIdsFromFirebase : EverySet ExternalProductId
        externalProductIdsFromFirebase =
            Logic.getExternalProductIdsFromFirebase internalProducts

        externalProductIdsFromShopify : EverySet ExternalProductId
        externalProductIdsFromShopify =
            Logic.getExternalProductsIdsFromShopify externalProducts
    in
        Logic.getDeletedProductsIds externalProductIdsFromFirebase externalProductIdsFromShopify



-- oneExtCatToManyExtProducts
-- externalCategoriesIdsFromFirebase
-- externalProducts
-- |> Debug.log "stuff: "
