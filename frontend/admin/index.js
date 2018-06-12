const admin = angular.module("admin", ["ngRoute"]);

admin.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "templates/main.htm",
      controller: "mainCtrl"
    })
    .when("/categories", {
      templateUrl: "templates/categories.htm",
      controller: "categoriesCtrl"
    })
    .when("/products", {
      templateUrl: "templates/products.htm",
      controller: "productsCtrl"
    })
    .when("/orders", {
      templateUrl: "templates/orders.htm",
      controller: "settingsCtrl"
    })
    .when("/users", {
      templateUrl: "templates/users.htm",
      controller: "usersCtrl"
    })
    .when("/settings", {
      templateUrl: "templates/settings.htm",
      controller: "settingsCtrl"
    })
    .otherwise({
      template: "<h1> otherwise route was hit. this route does not exist.. add it to your config. </h1>"
    });
});

admin.controller("testCtrl", function($scope) {
  $scope.name = "yes";
});