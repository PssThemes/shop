function SettingsCtrl($scope) {
  $scope.settings = {}


  BackendService.onSettingsLoaded((settings) => {
    $scope.settings = settings;
    $scope.$apply();
  });


}

export default SettingsCtrl;
