
loadSettings: Settings
loadExternalCategoriesIds: ShopName -> List (CustomCategoryId, ExternalCategoryId)

  // for each external category:
  // notice because we load all products at once.. we dont need that reference dict anymore.
  loadCustomProductsFromFirebase: ShopName -> List CustomProduct //(:firebaseProducts)


  loadExternalProducts: ShopName -> List ExternalProduct
    loadProductsFromShopify: ExternalCategoryId ->  List ExternalProduct
    loadProductsFromWoocomerce: ExternalCategoryId -> List ExternalProduct
    loadProductsFromPrestaShop: ExternalCategoryId -> List ExternalProduct

    // for each product:
    convertFromExternalProductToCustomProduct: ExtenralProduct -> CustomProduct
    // using:
      convertShopifyProductToCustomProductData: ExtenralProduct -> CustomProductData
      convertWoocomerceProductToCustomProductData: ExtenralProduct -> CustomProductData
      convertPrestashopProductToCustomProductData: ExtenralProduct -> CustomProductData

      // check if this custom product is already in the (:firebaseProducts) and decide what action to take based on that.
      // action can be: create, update, delete or do nothing.
      // this hole code here is about doing nothing since we want to stop usless writes to the database.

      // notice because we load all products at once.. we dont need that reference dict anymore.
      // here we just check if this productId from shopify.. is present already inside our products.
      // we do this by filtering the products taken form firebase.. in memory .. and we look for the product which
      // has the externalId field equal with CustomProductData externalId field.
      detectWhatActionNeedsToBeTaken: CustomProductData -> List CustomProduct -> ActionToBeTaken.

        where: ActionToBeTaken : { actionName: String } | { actionName: String, productId: FirebasePushKey }

        // if is not a create or delete.. then it must be an update action.
        // but before update.. check if the product is changed.. we dont want to do usless writes.
        // if we should update.. the actionName is update.
        // if not the actionName is do-nothing.
        shouldUpdate: CustomProductData -> CustomProduct -> Bool

      takeTheAction: ActionToBeTaken -> Void

        // based on the action:
        // internally this will merge certain fields with what we already have.
        updateProduct: CustomProductData -> Void

        deleteProduct: FirebasePushKey -> Void

        // this will generate a default product..
        // and then save it into the database.
        createProduct: CustomProductData -> Void
          createDefaultProduct: CustomProductData -> CustomCategoryId -> CustomProduct
