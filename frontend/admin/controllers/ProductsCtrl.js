function ProductsCtrl($scope, BackendService) {
  // ---------------------
  // DEV STUFF
  // ---------------------
  // BackendService.create3FakeProducts()

  $scope.allProducts = {};

  BackendService.onProductAdded((productId, product) => {
    $scope.allProducts[productId] = product;
    $scope.$apply();
  });

  $scope.calculateTotalRating = (productId) => {
    return $scope.allProducts[productId].calculateTotalRating();
  };

  $scope.getNrOfReviews = (productId) => {
    return $scope.allProducts[productId].getNrOfReviews();
  };

  $scope.toggleProductVisiblity = (productId) => {
    $scope.allProducts[productId].toggleProductVisiblity();
    // TODO: update in firebase.
    BackendService.updateProduct(productId, $scope.allProducts[productId].getData())
      .catch(err => console.log("failed to update the product: ", err));
  };

}

export default ProductsCtrl;
