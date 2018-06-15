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

  // BackendService.getAllProducts()
  //   .then(products => {
  //     $scope.allProducts = products;
  //     console.log($scope.allProducts);
  //     $scope.$apply();
  //   })
  //   .catch(err => console.log("Failed to load products: ", err));


  $scope.calculateTotalRating = (productId) => {
    return $scope.allProducts[productId].calculateTotalRating();
  };

  $scope.getNrOfReviews = (productId) => {
    return $scope.allProducts[productId].getNrOfReviews();
  };

  $scope.toggleProductVisiblity = (productId) => {
    $scope.allProducts[productId].toggleProductVisiblity();
    // TODO: update in firebase.
    BackendService.updateProduct(productId,$scope.allProducts[productId].getData())
      .catch(err => console.log("failed to update the product: ", err));
  };

}

export default ProductsCtrl;
