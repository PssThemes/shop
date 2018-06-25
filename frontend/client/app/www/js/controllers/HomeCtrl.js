export default function HomeCtrl($scope,$timeout,$rootScope, DataService) {

  $scope.categories = {};

  $rootScope.$on("categories_changed", () => {
    $scope.categories = DataService.categories;
  });

}
