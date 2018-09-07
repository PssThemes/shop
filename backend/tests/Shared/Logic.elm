module Shared.Logic exposing (suite, test_DeleteFunctionality)

import Data exposing (..)
import EveryDict exposing (EveryDict)
import EverySet exposing (EverySet)
import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Logic
import Test exposing (..)


suite : Test
suite =
    describe "Logic Module"
        [ test_DeleteFunctionality
        ]


test_DeleteFunctionality : Test
test_DeleteFunctionality =
    [ test """should remove a product that is in firebase but not in shop.""" <|
        \_ ->
            let
                firebaseExternalProductsIds =
                    EverySet.fromList [ ExternalProductId "1" ]

                shopProductsIds =
                    EverySet.empty

                emptyedOrDeletedExternalCategories =
                    EverySet.empty

                allShopProducts =
                    EveryDict.empty
            in
            Logic.getIdsOfDeletedProducts firebaseExternalProductsIds shopProductsIds emptyedOrDeletedExternalCategories allShopProducts
                |> Expect.equal (EverySet.fromList [ ExternalProductId "1" ])
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
