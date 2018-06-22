export default function HomeCtrl($scope,$timeout, BackendService) {

  $scope.categories = {};

  BackendService.onCategoryAdded(cat => {
    $scope.categories[cat.id]= cat;
    $timeout(() => {$scope.$apply()}, 10)
  });
}
