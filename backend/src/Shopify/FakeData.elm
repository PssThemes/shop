module Shopify.FakeData exposing
    ( appendShopifyCollect
    , asociateInternalCategoryWithExternalCategory
    , createExternalCategoryId
    , createExternalCategoryName
    , createExternalProductId
    , createInternalCategory
    , createInternalCategoryId
    , createInternalCategoryName
    , createInternalProduct
    , createInternalProductId
    , createInternalProductName
    , createRawProduct
    , internalCategories
    , internalProducts
    , rawShopifyProducts
    , settings
    , shopifyCollects
    , shopifyEmptyModel
    , shopifyModel
    )

import EveryDict exposing (EveryDict)
import EverySet exposing (..)
import Rocket exposing ((=>))
import Shared.Data as Data exposing (..)
import Shared.Logic as Logic
import Shopify.Shopify as Shopify



-- #region Shopify Model
----------------------------------------------------------------------------------------------
-- Shopify Model
----------------------------------------------------------------------------------------------


shopifyModel : Shopify.Model
shopifyModel =
    { settings = Just settings
    , internalCategories = Just internalCategories
    , internalProducts = Just internalProducts
    , rawShopifyProducts = Just rawShopifyProducts
    , shopifyCollects = Just shopifyCollects
    , workIsDone = False
    }


shopifyEmptyModel : Shopify.Model
shopifyEmptyModel =
    { settings = Just settings
    , internalCategories = Nothing
    , internalProducts = Nothing
    , rawShopifyProducts = Nothing
    , shopifyCollects = Nothing
    , workIsDone = False
    }



-- #endregion Shopify Model
--
--
-- #region Shared Stuff
----------------------------------------------------------------------------------------------
-- Shared Stuff
----------------------------------------------------------------------------------------------
--
-- #region Internal Categories  Stuff
--
----------------------------------------------------------------------------------------------
-- -- Internal Categories  Stuff
----------------------------------------------------------------------------------------------


internalCategories : EveryDict InternalCatId InternalCategory
internalCategories =
    let
        intCatId_pushKey1 =
            createInternalCategoryId "categoryPushKey1"

        intCatId_pushKey2 =
            createInternalCategoryId "categoryPushKey2"
    in
    [ intCatId_pushKey2 => createInternalCategory intCatId_pushKey2
    , intCatId_pushKey2 => createInternalCategory intCatId_pushKey2
    ]
        |> EveryDict.fromList
        |> asociateInternalCategoryWithExternalCategory Shopify intCatId_pushKey1 (createExternalCategoryId 1111)
        |> asociateInternalCategoryWithExternalCategory Shopify intCatId_pushKey1 (createExternalCategoryId 2222)
        |> asociateInternalCategoryWithExternalCategory Shopify intCatId_pushKey2 (createExternalCategoryId 1111)


createInternalCategory : InternalCatId -> InternalCategory
createInternalCategory internalCatId =
    { selfId = internalCatId
    , name = createInternalCategoryName internalCatId
    , shopify = []
    , prestashop = []
    }


createInternalCategoryId : String -> InternalCatId
createInternalCategoryId pushKey =
    pushKey |> String.append "internalCatId|" |> InternalCatId


createInternalCategoryName : InternalCatId -> String
createInternalCategoryName ((InternalCatId id) as intId) =
    id |> toString |> String.append "Internal Category "


createExternalCategoryId : Int -> ExternalCatId
createExternalCategoryId id =
    id |> toString |> String.append "externalCatId|" |> ExternalCatId


createExternalCategoryName : ExternalCatId -> String
createExternalCategoryName ((ExternalCatId id) as intId) =
    id |> toString |> String.append "External Category "


asociateInternalCategoryWithExternalCategory : ShopName -> InternalCatId -> ExternalCatId -> EveryDict InternalCatId InternalCategory -> EveryDict InternalCatId InternalCategory
asociateInternalCategoryWithExternalCategory shopName internalCatId externalCatId dict =
    dict
        |> EveryDict.update internalCatId
            (Maybe.map
                (\cat ->
                    case shopName of
                        Shopify ->
                            { cat
                                | shopify =
                                    (externalCatId => createExternalCategoryName externalCatId)
                                        :: cat.shopify
                            }

                        Prestashop ->
                            { cat
                                | prestashop =
                                    (externalCatId => createExternalCategoryName externalCatId)
                                        :: cat.prestashop
                            }
                )
            )



-- #endregion Internal Categories  Stuff
--
-- #region Internal Products  Stuff


internalProducts : EveryDict InternalProductId InternalProduct
internalProducts =
    [ createInternalProductId "productPushKey1"
        => createInternalProduct Shopify (createInternalProductId "productPushKey1") (createExternalProductId 1)
    , createInternalProductId "productPushKey2"
        => createInternalProduct Shopify (createInternalProductId "productPushKey2") (createExternalProductId 2)
    , createInternalProductId "productPushKey3"
        => createInternalProduct Shopify (createInternalProductId "productPushKey3") (createExternalProductId 3)
    , createInternalProductId "productPushKey4"
        => createInternalProduct Shopify (createInternalProductId "productPushKey4") (createExternalProductId 4)
    ]
        |> EveryDict.fromList


createInternalProduct : ShopName -> InternalProductId -> ExternalProductId -> InternalProduct
createInternalProduct shopName internalProductId externalProductId =
    { selfId = internalProductId
    , shopName = shopName
    , externalId = externalProductId
    , name = createInternalProductName internalProductId
    , short_description = "short description"
    , price = 0
    , externalCatIds = EverySet.empty
    , internalCatIds = EverySet.empty
    , mainImage = Nothing
    , media = []
    , isHidden = True
    , howManyTimesWasOrdered = 0
    }


createInternalProductId : String -> InternalProductId
createInternalProductId id =
    id |> String.append "internalProductId|" |> InternalProductId


createExternalProductId : Int -> ExternalProductId
createExternalProductId id =
    id |> toString |> String.append "externalProductId|" |> ExternalProductId


createInternalProductName : InternalProductId -> String
createInternalProductName (InternalProductId id) =
    id |> toString |> String.append "Product "



-- #endregion Internal Products  Stuff
--
-- #region Raw Products


rawShopifyProducts : List RawShopifyProduct
rawShopifyProducts =
    [ createRawProduct 3001
    , createRawProduct 3002
    , createRawProduct 3003
    , createRawProduct 3004
    ]


createRawProduct : Int -> RawShopifyProduct
createRawProduct int =
    { id = int
    , title = int |> toString |> String.append "Product "
    , body_html = "description for " ++ toString int
    , images =
        [ { src = "url" }
        ]
    , image = Nothing
    , variants = []
    }



-- #endregion Raw Products
--


shopifyCollects : List ( ExternalCatId, ExternalProductId )
shopifyCollects =
    []
        |> appendShopifyCollect (createExternalCategoryId 1) (createExternalProductId 1)


appendShopifyCollect : ExternalCatId -> ExternalProductId -> List ( ExternalCatId, ExternalProductId ) -> List ( ExternalCatId, ExternalProductId )
appendShopifyCollect externalCatId externalProductId list =
    ( externalCatId, externalProductId ) :: list


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



-- #endregion Shared Stuff
--
--
-- #region Transformers of data
----------------------------------------------------------------------------------------------
-- Transformers of data
----------------------------------------------------------------------------------------------
-- type alias Model =
--     { settings : Maybe Settings
--     , internalCategories : Maybe (EveryDict InternalCatId InternalCategory)
--     , internalProducts : Maybe (EveryDict InternalProductId InternalProduct)
--     , rawShopifyProducts : Maybe (List RawShopifyProduct)
--     , shopifyCollects : Maybe (List ( ExternalCatId, ExternalProductId ))
--     , workIsDone : Bool
--     }


createNewProductInShopify : Int -> ExternalCatId -> Shopify.Model -> Shopify.Model
createNewProductInShopify id externalCatId shopifyModel =
    { shopifyModel
        | rawShopifyProducts =
            shopifyModel.rawShopifyProducts
                |> appendOrCreateMaybeList (createRawProduct id)
        , shopifyCollects =
            shopifyModel.shopifyCollects
                |> appendOrCreateMaybeList
                    ( externalCatId
                    , createExternalProductId id
                    )
    }



-- type alias InternalCategory =
--     { selfId : InternalCatId
--     , name : String
--     , shopify : List ( ExternalCatId, CategoryName )
--     , prestashop : List ( ExternalCatId, CategoryName )
--     }


createShopifyAsociationEvenWhenCategoryDoesNotExist : InternalCatId -> ExternalCatId -> Shopify.Model -> Shopify.Model
createShopifyAsociationEvenWhenCategoryDoesNotExist internalCatId externalCatId shopifyModel =
    let
        createAsociation : InternalCategory -> InternalCategory
        createAsociation category =
            { category
                | shopify =
                    ( externalCatId, createExternalCategoryName externalCatId ) :: category.shopify
            }
    in
    { shopifyModel
        | internalCategories =
            case shopifyModel.internalCategories of
                Nothing ->
                    -- create the category and insert the asociation.
                    [ internalCatId
                        => (createInternalCategory internalCatId
                                |> createAsociation
                           )
                    ]
                        |> (EveryDict.fromList >> Just)

                Just internalCategories ->
                    (case EveryDict.get internalCatId internalCategories of
                        Nothing ->
                            -- create new category and insert the asociation.
                            createInternalCategory internalCatId
                                |> createAsociation

                        Just category ->
                            -- update and existing category by inserting the asociation.
                            category
                                |> createAsociation
                    )
                        |> (\newInternalCategory ->
                                internalCategories
                                    |> updateExistingOrInsertNew internalCatId (\oldInternalCategory -> newInternalCategory) newInternalCategory
                                    |> Just
                           )
    }


updateExistingOrInsertNew : k -> (v -> v) -> v -> EveryDict k v -> EveryDict k v
updateExistingOrInsertNew k f v dict =
    case EveryDict.get k dict of
        Nothing ->
            EveryDict.insert k v dict

        Just v ->
            EveryDict.insert k (f v) dict


appendOrCreateMaybeList : a -> Maybe (List a) -> Maybe (List a)
appendOrCreateMaybeList a maybe =
    case maybe of
        Just list ->
            Just (list ++ [ a ])

        Nothing ->
            Just [ a ]



-- #endregion Transformers of data
