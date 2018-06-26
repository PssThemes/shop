// -------------------------------------
// Angularjs configuration.
// -------------------------------------

// import Controllers
import MainCtrl from "./controllers/MainCtrl.js"
import CategoriesCtrl from "./controllers/CategoriesCtrl.js"
import ProductsCtrl from "./controllers/ProductsCtrl.js"
import ProductReviewsCtrl from "./controllers/ProductReviewsCtrl.js"
import OrdersCtrl from "./controllers/OrdersCtrl.js"
import OrderCtrl from "./controllers/OrderCtrl.js"
import UsersCtrl from "./controllers/UsersCtrl.js"
import SettingsCtrl from "./controllers/SettingsCtrl.js"

// import Serives
import BackendService from "./services/BackendService.js"
import ShopsService from "./services/ShopsService.js"

// import Directives
import onEnter from "./directives/onEnter.js"
import onEsc from "./directives/onEsc.js"
import purchase from "./directives/purchase/purchase.js"
import detailedPurchase from "./directives/detailed-purchase/detailed-purchase.js"

const admin = angular.module("admin", ["ngRoute"]);

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
    .when("/productReviews/:productId", {
      templateUrl: "templates/productReviews.htm",
      controller: "ProductReviewsCtrl"
    })
    .when("/orders", {
      templateUrl: "templates/orders.htm",
      controller: "OrdersCtrl"
    })
    .when("/order/:orderId", {
      templateUrl: "templates/order.htm",
      controller: "OrderCtrl"
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
admin.controller("ProductReviewsCtrl", ProductReviewsCtrl);
admin.controller("ProductsCtrl", ProductsCtrl);
admin.controller("OrdersCtrl", OrdersCtrl);
admin.controller("OrderCtrl", OrderCtrl);
admin.controller("UsersCtrl", UsersCtrl);
admin.controller("SettingsCtrl", SettingsCtrl);


// services
admin.service("BackendService", BackendService);
admin.service("ShopsService", ShopsService);

// directives
admin.directive("onEnter", onEnter);
admin.directive("onEsc", onEsc);
admin.directive("purchase", purchase);
admin.directive("detailedPurchase", detailedPurchase);
