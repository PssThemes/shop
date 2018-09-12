module Tests.Shared.Logic exposing (suite, test_DeleteFunctionality)

import EveryDict exposing (EveryDict)
import EverySet exposing (EverySet)
import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Shared.Data as Data exposing (..)
import Shared.Logic as Logic
import Shopify.FakeData as FakeData
import Shopify.Shopify as Shopify
import Test exposing (..)


suite : Test
suite =
    describe "Test Core functionality"
        [ test_DeleteFunctionality
        ]



-- type alias Model =
--     { settings : Maybe Settings
--     , internalCategories : Maybe (EveryDict InternalCatId InternalCategory)
--     , internalProducts : Maybe (EveryDict InternalProductId InternalProduct)
--     , rawShopifyProducts : Maybe (List RawShopifyProduct)
--     , shopifyCollects : Maybe (List ( ExternalCatId, ExternalProductId ))
--     , workIsDone : Bool
--     }


test_DeleteFunctionality : Test
test_DeleteFunctionality =
    [ test "just test" <|
        \_ ->
            Shopify.work FakeData.shopifyModel
                |> Expect.equal Nothing
    , test """should remove a product that is in firebase but not in shop.""" <|
        \_ ->
            -- testModel =
            --   { FakeData.shopifyModel
            --     | internalCategories =
            --         []
            --           |> ( Dict.formList >> Just )
            --   }
            1
                |> Expect.equal 1
    , skip <|
        describe """deleting an internal firebase category"""
            [ todo """ products asociated with the external categories -  that have been deleted
              because of this asociation.. should be deleted .. if they dont have other relevant external categories asociated with them.
            """
            ]
    , skip <|
        describe "deleting and entire shop category from inside the shop.."
            [ todo "if a product has only this external category id on it .. that product is deleted"
            , todo "if a product has the deleted category.. plus one or more other categories.. that product is not deleted."
            , todo "if a product has only 2 categories and both are deleted at the same time.. the products is deleted"
            ]
    , skip <|
        describe "disasociating a product form a shop category"
            [ todo "should be deleted, when the product has no other external categories asociated with it."
            , todo "should not be deleted, if the product has other external categories(asociations) on it."
            ]
    , skip <|
        let
            init =
                2
        in
        describe "emptying a shop category of all products"
            [ todo "all products which have only that category on them should be deleted."
            , todo "all products that have other categories on them outside of this one.. should be kept."
            ]
    ]
        |> describe "getIdsOfDeletedProducts"
