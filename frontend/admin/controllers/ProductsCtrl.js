function ProductsCtrl($scope,BackendService) {
  $scope.name = "cucubabbus";
  $scope.allProducts = {};

  BackendService.getAllProducts()
    .then(products => {
      $scope.allProducts = products;
      console.log($scope.allProducts);
      $scope.$apply();
    })
    .catch(err => console.log("Failed to load products: ", err));


  $scope.calculateTotalRating = (productId) => {
    const rating = $scope.allProducts[productId].calculateTotalRating();
    console.log("rating ", rating);
    return rating;
  };
  $scope.getNrOfReviews = (productId) => {
    const num = $scope.allProducts[productId].getNrOfReviews();
    console.log("num ", num);
    return num;
  };
  $scope.toggleProductVisiblity = (productId) => {
    $scope.allProducts[productId].toggleProductVisiblity();
  };

}

export default ProductsCtrl;
