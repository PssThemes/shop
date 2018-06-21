function SettingsCtrl($scope, BackendService) {

  $scope.settings = {};

  BackendService.getSettings()
    .then(settings => {
      console.log(settings);
      $scope.shopifyKey = settings.shopify.apiKey;
      $scope.shopifySecret = settings.shopify.apiSecret;
      $scope.magentoKey = settings.magento.apiKey;
      $scope.magentoSecret = settings.magento.apiSecret;
      $scope.woocomerceKey = settings.woocomerce.apiKey;
      $scope.woocomerceSecret = settings.woocomerce.apiSecret;
      $scope.settings = settings;
      syncronizeSyncRate($scope);

      $scope.$apply();
    })
    .catch(err => {
      console.log(new Error(`Could not load settings form the backend: ${err}`))
    });


  // NOTE: this duplication is supposed to be only tempporaty since once i setup each shop
  // properly they will be so different that this functionality makes sense to not be abstracted away.
  // i think duplication makes sense in this case - is what i'm saing.

  // Shared
  $scope.toggleSync = (shopName) => {

    $scope.settings.toggleSync(shopName);

    BackendService.updateSettings($scope.settings)
      .catch(err => {
        console.log("could not update the settings because: ", err );
      })
  };


  $scope.saveSyncRate = (shopName, syncRate) => {

    $scope.settings.setSyncRate(shopName, syncRate);

    syncronizeSyncRate($scope);

    // Save it in backend:
    BackendService.updateSettings($scope.settings)
      .catch(err => {
        console.log("could not update the settings because: ", err );
      })
  };


  // ---------------------------------------------------
  // Shopify
  // ---------------------------------------------------
  $scope.shopifyKey = "";
  $scope.shopifySecret = "";
  $scope.saveShopifySettings = () => {

    if($scope.settings.configureShopify($scope.shopifyKey, $scope.shopifySecret)){

      BackendService.updateSettings($scope.settings)
        .catch(err => {
          console.log("could not update the settings because: ", err );
        })
    }
  };


  // ---------------------------------------------------
  // Magento
  // ---------------------------------------------------
  $scope.magentoKey = "";
  $scope.magentoSecret = "";
  $scope.saveMagentoSettings = () => {
    if($scope.settings.configureMagento($scope.magentoKey, $scope.magentoSecret)){

      BackendService.updateSettings($scope.settings)
        .catch(err => {
          console.log("could not update the settings because: ", err );
        })
    }
  };

  // ---------------------------------------------------
  // Woocomerce
  // ---------------------------------------------------
  $scope.woocomerceKey = "";
  $scope.woocomerceSecret = "";
  $scope.saveWoocomerceSettings = () => {
    if($scope.settings.configureWoocomerce($scope.woocomerceKey, $scope.woocomerceSecret)){

      BackendService.updateSettings($scope.settings)
        .catch(err => {
          console.log("could not update the settings because: ", err );
        })
    }
  };


}

export default SettingsCtrl;

function syncronizeSyncRate($scope){
  $scope.shopifySyncRate = $scope.settings.shopify.syncRate;
  $scope.magentoSyncRate = $scope.settings.magento.syncRate;
  $scope.woocomerceSyncRate = $scope.settings.woocomerce.syncRate;
}
