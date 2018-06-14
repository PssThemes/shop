function ProductsCtrl($scope) {
  $scope.name = "cucubabbus";
  $scope.allProducts = {};

  BackendService.getAllProducts()
    .then(products => {
      $scope.allProducts = products;
      $scope.$apply();
    })
    .catch(err => console.log("Failed to load products: ", err));
}

export default ProductsCtrl;