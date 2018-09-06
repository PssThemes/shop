module Eval exposing (..)

import Shopify exposing (..)
import Logic exposing (..)
import Data exposing (..)
import FakeData exposing (..)


stuff : Int
stuff =
    1
--
--
-- externalCategoriesIdsFormFirebase : EverySet ExternalCatId
-- externalCategoriesIdsFormFirebase =
--     Logic.getExternalCategoriesFromFirebase internalCategories Shopify
--
--
--
-- -- |> Debug.log "externalCategoriesIdsFormFirebase: "
--
--
-- ( oneExtCatToManyExtProducts, oneExtProductToManyExtCats ) =
--     Logic.extractCategoryProductAsociations shopifyCollects
-- ( oneExtCatToManyIntCats, oneIntToManyExtCats ) =
--     Logic.extractCateogoryToCategoryAssociations Shopify internalCategories
--
--
-- relevantProductsAlmost =
--     rawShopifyProducts
--         |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
--         |> List.map (\p -> ( p.externalId, p ))
--         |> EveryDict.fromList
--
--
-- relevantProducts =
--     rawShopifyProducts
--         |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
--         |> List.map (\p -> ( p.externalId, p ))
--         |> EveryDict.fromList
--         |> Logic.getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase
--
--
-- relevantIds =
--     Logic.getRelevantProductsIds oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase
--
--
-- allShopProducts : EveryDict ExternalProductId NormalizedProduct
-- allShopProducts =
--     rawShopifyProducts
--         |> List.map (\rawProduct -> Data.transformRawShopifyProduct rawProduct externalCategoriesIdsFormFirebase)
--         |> List.map (\p -> ( p.externalId, p ))
--         |> EveryDict.fromList
--
--
-- externalProductIdsFromFirebase : EverySet ExternalProductId
-- externalProductIdsFromFirebase =
--     Logic.getExternalProductIdsFromFirebase internalProducts
--
--
--
-- --
-- -- -- |> Debug.log "externalProductIdsFromFirebase: "
--
--
-- externalProductIdsFromShop : EverySet ExternalProductId
-- externalProductIdsFromShop =
--     -- TODO: think if this is supposed to be relevant producxts or just all Products..????
--     Logic.getExternalProductsIdsFromShop allShopProducts
--
--
-- deletedProductsExternalIds : EverySet ExternalProductId
-- deletedProductsExternalIds =
--     Logic.getDeletedProductsIds externalProductIdsFromFirebase externalProductIdsFromShop
--
--
-- deletedProductsInternalIds : List InternalProductId
-- deletedProductsInternalIds =
--     deletedProductsExternalIds
--         |> EverySet.map (\externalProductId -> Logic.findAsociatedInternalProductId externalProductId internalProducts)
--         |> EverySet.toList
--         |> Logic.removeNothings
--
--
-- createdProductsIds : EverySet ExternalProductId
-- createdProductsIds =
--     Logic.getCreatedProductsIds externalProductIdsFromFirebase externalProductIdsFromShop
--
--
-- relevantShopProducts : EveryDict ExternalProductId NormalizedProduct
-- relevantShopProducts =
--     allShopProducts
--         |> Logic.getRelevantProducts oneExtCatToManyExtProducts externalCategoriesIdsFormFirebase
--
--
-- updatedProductsUnfiltered : List ( InternalProductId, NormalizedProduct )
-- updatedProductsUnfiltered =
--     Logic.getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShop
--         |> EverySet.map
--             (\externalProductId ->
--                 ( EveryDict.get externalProductId relevantShopProducts, Logic.findAsociatedInternalProductId externalProductId internalProducts )
--                     |> (\( maybe_NormalizedProduct, maybe_InternalProductId ) -> Maybe.map2 (,) maybe_InternalProductId maybe_NormalizedProduct)
--             )
--         |> EverySet.toList
--         |> Logic.removeNothings
--
--
-- updatedProducts : List ( InternalProductId, NormalizedProduct )
-- updatedProducts =
--     Logic.getPosiblyUpdatedProductsIds createdProductsIds deletedProductsExternalIds externalProductIdsFromShop
--         |> EverySet.map
--             (\externalProductId ->
--                 ( EveryDict.get externalProductId relevantShopProducts, Logic.findAsociatedInternalProductId externalProductId internalProducts )
--                     |> (\( maybe_NormalizedProduct, maybe_InternalProductId ) -> Maybe.map2 (,) maybe_InternalProductId maybe_NormalizedProduct)
--             )
--         |> EverySet.toList
--         |> Logic.removeNothings
--         |> List.filter (Logic.ensureItRelyNeedsUpdating internalProducts oneExtProductToManyExtCats)
--


--
-- FakeData.deletedProductsInternalIds
-- FakeData.createdProducts
-- FakeData.updatedProducts
