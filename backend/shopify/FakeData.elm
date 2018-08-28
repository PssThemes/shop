module FakeData exposing (..)

import Data exposing (..)
import EveryDict exposing (EveryDict)
import Rocket exposing ((=>))
import EverySet exposing (..)
import Logic
import Shopify


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
                , ExternalCatId "externalCatId|3" => "extenral category 2"
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
           , externalId = ExternalProductId "3001"
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

    -- , InternalProductId "internalProductId|2"
    --     => { selfId = InternalProductId "internalProductId|2"
    --
    --        -- external identification.
    --        , shopName = Shopify
    --        , externalId = ExternalProductId "3002"
    --        , name = "Product 2"
    --        , short_description = "desciption for product 2"
    --        , price = 0
    --
    --        --
    --        , externalCatIds = EverySet.empty
    --        , internalCatIds = EverySet.empty
    --
    --        --
    --        , mainImage = Nothing
    --        , media = []
    --
    --        --
    --        , isHidden = False
    --        , howManyTimesWasOrdered = 0
    --        }
    -- , InternalProductId "internalProductId|3"
    --     => { selfId = InternalProductId "internalProductId|3"
    --
    --        -- external identification.
    --        , shopName = Shopify
    --        , externalId = ExternalProductId "3003"
    --        , name = "Product 3"
    --        , short_description = "desciption for product 3"
    --        , price = 0
    --
    --        --
    --        , externalCatIds = EverySet.empty
    --        , internalCatIds = EverySet.empty
    --
    --        --
    --        , mainImage = Nothing
    --        , media = []
    --
    --        --
    --        , isHidden = False
    --        , howManyTimesWasOrdered = 0
    --        }
    -- , InternalProductId "internalProductId|4"
    --     => { selfId = InternalProductId "internalProductId|4"
    --
    --        -- external identification.
    --        , shopName = Shopify
    --        , externalId = ExternalProductId "3004"
    --        , name = "Product 4"
    --        , short_description = "desciption for product 4"
    --        , price = 0
    --
    --        --
    --        , externalCatIds = EverySet.empty
    --        , internalCatIds = EverySet.empty
    --
    --        --
    --        , mainImage = Nothing
    --        , media = []
    --
    --        --
    --        , isHidden = False
    --        , howManyTimesWasOrdered = 0
    --        }
    ]
        |> EveryDict.fromList


rawShopifyProducts : List RawShopifyProduct
rawShopifyProducts =
    [ { id = 3001
      , title = "Product 1"
      , body_html = "description for 1"
      , images =
            [ { src = "url" }
            ]
      , image = Nothing
      , variants = []
      }
    , { id = 3002
      , title = "Product 2"
      , body_html = "description for 2"
      , images =
            [ { src = "url" }
            ]
      , image = Nothing
      , variants = []
      }
    , { id = 3003
      , title = "Product 3"
      , body_html = "description for 3"
      , images =
            [ { src = "url" }
            ]
      , image = Nothing
      , variants = []
      }
    , { id = 3004
      , title = "Product 4"
      , body_html = "description for 4"
      , images =
            [ { src = "url" }
            ]
      , image = Nothing
      , variants = []
      }
    ]


shopifyCollects : List ( ExternalCatId, ExternalProductId )
shopifyCollects =
    [ ExternalCatId "externalCatId|1" => ExternalProductId "3001"

    -- , ExternalCatId "externalCatId|1" => ExternalProductId "3002"
    -- , ExternalCatId "externalCatId|1" => ExternalProductId "3003"
    , ExternalCatId "externalCatId|2" => ExternalProductId "3004"
    , ExternalCatId "externalCatId|3" => ExternalProductId "3003"
    , ExternalCatId "externalCatId|4" => ExternalProductId "3004"
    ]


settings : Settings
settings =
    { shopify =
        { apiKey = "String"
        , apiSecret = "String"
        , shopName = "String"
        }
    , prestashop =
        { apiKey = "String"
        }
    }


shopifyModel : Shopify.Model
shopifyModel =
    { settings = Just settings
    , internalCategories = Just internalCategories
    , internalProducts = Just internalProducts
    , rawShopifyProducts = Just rawShopifyProducts
    , shopifyCollects = Just shopifyCollects
    }


externalCategoriesIdsFormFirebase : EverySet ExternalCatId
externalCategoriesIdsFormFirebase =
    Logic.getExternalCategoriesFromFirebase internalCategories Shopify



-- |> Debug.log "externalCategoriesIdsFormFirebase: "


( oneExtCatToManyExtProducts, oneExtProductToManyExtCats ) =
    Logic.extractCategoryProductAsociations shopifyCollects
( oneExtCatToManyIntCats, oneIntToManyExtCats ) =
    Logic.extractCateogoryToCategoryAssociations Shopify internalCategories


relevantProductsAlmost =
    rawShopifyProducts
        |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
        |> List.map (\p -> ( p.externalId, p ))
        |> EveryDict.fromList


relevantProducts =
    rawShopifyProducts
        |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
        |> List.map (\p -> ( p.externalId, p ))
        |> EveryDict.fromList
        |> Logic.getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase


relevantIds =
    Logic.getRelevantProductsIds oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase


allShopProducts : EveryDict ExternalProductId NormalizedProduct
allShopProducts =
    rawShopifyProducts
        |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
        |> List.map (\p -> ( p.externalId, p ))
        |> EveryDict.fromList


externalProductIdsFromFirebase : EverySet ExternalProductId
externalProductIdsFromFirebase =
    Logic.getExternalProductIdsFromFirebase internalProducts



--
-- -- |> Debug.log "externalProductIdsFromFirebase: "


externalProductIdsFromShop : EverySet ExternalProductId
externalProductIdsFromShop =
    -- TODO: think if this is supposed to be relevant producxts or just all Products..????
    Logic.getExternalProductsIdsFromShop allShopProducts


deletedProductsExternalIds : EverySet ExternalProductId
deletedProductsExternalIds =
    Logic.getDeletedProductsIds externalProductIdsFromFirebase externalProductIdsFromShop


deletedProductsInternalIds : List InternalProductId
deletedProductsInternalIds =
    deletedProductsExternalIds
        |> EverySet.map (\externalProductId -> Logic.findAsociatedInternalProductId externalProductId internalProducts)
        |> EverySet.toList
        |> Logic.removeNothings


createdProductsIds : EverySet ExternalProductId
createdProductsIds =
    Logic.getCreatedProductsIds externalProductIdsFromFirebase externalProductIdsFromShop


relevantShopProducts : EveryDict ExternalProductId NormalizedProduct
relevantShopProducts =
    allShopProducts
        |> Logic.getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase


updatedProductsUnfiltered : List ( InternalProductId, NormalizedProduct )
updatedProductsUnfiltered =
    Logic.getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShop
        |> EverySet.map
            (\externalProductId ->
                ( EveryDict.get externalProductId relevantShopProducts, Logic.findAsociatedInternalProductId externalProductId internalProducts )
                    |> (\( maybe_NormalizedProduct, maybe_InternalProductId ) -> Maybe.map2 (,) maybe_InternalProductId maybe_NormalizedProduct)
            )
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
