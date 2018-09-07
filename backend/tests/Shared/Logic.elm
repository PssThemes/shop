module Shared.Logic exposing (suite, test_getDeletedProductsIds)

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
        [ test_getDeletedProductsIds
        ]


test_getDeletedProductsIds : Test
test_getDeletedProductsIds =
    [ test """should remove a product that is in firebase but not in shop. 
      Meaning this firebase product will be returned by its external id""" <|
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
            Logic.getDeletedProductsIds firebaseExternalProductsIds shopProductsIds emptyedOrDeletedExternalCategories allShopProducts
                |> Expect.equal (EverySet.fromList [ ExternalProductId "1" ])
    , skip <| describe "deleting an internal firebase category" []
    , skip <| describe "deleting and entire shop category" []
    , skip <| describe "disasociating a product form a shop category" []
    , skip <|
        let
            init =
                2
        in
        describe "emptying a shop category of all products" []
    ]
        |> describe "getDeletedProductsIds"
