export default function ProductReviewsCtrl($scope, $routeParams, BackendService){
  $scope.fakeId = 2;
  $scope.id = $routeParams.productId;

  const productId = $routeParams.productId;
  $scope.product = null;

  BackendService.getProduct(productId)
    .then(product => {
      console.log("why?")
      $scope.product = product;
      $scope.$apply(product)
    })
    .catch(err => {
      // NOTE: this might catch dev mistakes in the above then clause.
      //  like $scope.apply() instead of $scope.$apply()
      console.log(new Error("could not get tthe product with id: "), productId);
    });

}
