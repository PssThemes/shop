export default function HomeCtrl($scope, $http) {

  $http.get("https://ccs.pssthemes.com/mobile/get_categories")
    .then(function(response) {
        $scope.categories = response.data;
    });

}
