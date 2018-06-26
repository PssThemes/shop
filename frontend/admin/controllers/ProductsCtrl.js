function ProductsCtrl($scope,$timeout, BackendService) {

  $scope.allProducts = {};

  BackendService.onProductAdded( product => {
    $scope.allProducts[product.id] = product;

    console.log("product ", product.isHidden);


    $timeout(()=>{
      $scope.$apply();
    }, 10)
  });

  BackendService.onProductUpdate( product => {
    $scope.allProducts[product.id] = product;
    // Timeout is neded here since this callbacks are sincronous
    // or there is some otheer reasons.. i don't get yet.
    // it doesn't work without it.
    // and i know that not all callbacks are async.
    // which means without this $timeout..
    // this call might be blocking the tread.
    // and this is why angular complains with $scope inprogress error.
    $timeout(()=>{
      $scope.$apply();
    }, 10)
  });

  $scope.calculateTotalRating = (productId) => {
    return $scope.allProducts[productId].calculateTotalRating();
  };

  $scope.getNrOfReviews = (productId) => {
    return $scope.allProducts[productId].getNrOfReviews();
  };

  $scope.toggleProductVisiblity = (productId) => {

    console.log("toggleProductVisiblity ", $scope.allProducts[productId].isHidden);
    $scope.allProducts[productId].toggleProductVisiblity();
    console.log("toggleProductVisiblity ", $scope.allProducts[productId].isHidden);

    BackendService.updateProduct($scope.allProducts[productId])
      .catch(err => console.log("failed to update the product: ", err));
  };

}

export default ProductsCtrl;
