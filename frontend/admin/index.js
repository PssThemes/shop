const admin = angular.module("admin", ["ngRoute"]);

admin.config(function($routeProvider){
  $routeProvider
    .when("/",{
      templateUrl: "templates/main.htm",
      controller: "testCtrl"
    })
    .when("/settings",{
      templateUrl: "templates/settings.htm"
    })
    .when("/categories",{
      templateUrl: "templates/categories.htm"
    })
    .otherwise({
      template: "<h1> da </h1>"
    });
});

admin.controller("testCtrl", function($scope){
  $scope.name = "yes"; 
});
