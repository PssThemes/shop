console.log("index.js was loaded..");

// import * as firebase from '../assets/firebase.js'
// import 'assets/firebase-firestore.js'

// Firebase configuration.



// Angularjs configuration.


// import Controllers
import MainCtrl from "./controllers/MainCtrl.js"
import CategoriesCtrl from "./controllers/CategoriesCtrl.js"
import ProductsCtrl from "./controllers/ProductsCtrl.js"
import OrdersCtrl from "./controllers/OrdersCtrl.js"
import UsersCtrl from "./controllers/UsersCtrl.js"
import SettingsCtrl from "./controllers/SettingsCtrl.js"

// import Serives
// import CategoriesService from "./services/CategoriesService.js"
import BackendService from "./services/BackendService.js"
import ShopsService from "./services/ShopsService.js"

const admin = angular.module("admin", ["ngRoute"]);
console.log("admin", admin);
admin.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "templates/main.htm",
      controller: "MainCtrl"
    })
    .when("/categories", {
      templateUrl: "templates/categories.htm",
      controller: "CategoriesCtrl"
    })
    .when("/products", {
      templateUrl: "templates/products.htm",
      controller: "ProductsCtrl"
    })
    .when("/orders", {
      templateUrl: "templates/orders.htm",
      controller: "OrdersCtrl"
    })
    .when("/users", {
      templateUrl: "templates/users.htm",
      controller: "UsersCtrl"
    })
    .when("/settings", {
      templateUrl: "templates/settings.htm",
      controller: "SettingsCtrl"
    })
    .otherwise({
      template: "<h1> otherwise route was hit. this route does not exist.. add it to your config. </h1>"
    });
});

// controllers.
admin.controller("MainCtrl", MainCtrl);
admin.controller("CategoriesCtrl", CategoriesCtrl);
admin.controller("ProductsCtrl", ProductsCtrl);
admin.controller("OrdersCtrl", OrdersCtrl);
admin.controller("UsersCtrl", UsersCtrl);
admin.controller("SettingsCtrl", SettingsCtrl);


// services
// admin.service("CategoriesService", CategoriesService);
admin.service("BackendService", BackendService);
admin.service("ShopsService", ShopsService);