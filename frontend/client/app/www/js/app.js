
// Importing controllers..
import AppCtrl from "./controllers/AppCtrl.js"
import HomeCtrl from "./controllers/HomeCtrl.js"
import SingleProductCtrl from "./controllers/SingleProductCtrl.js"
import UserProfileCtrl from "./controllers/UserProfileCtrl.js"
import CategoryCtrl from "./controllers/CategoryCtrl.js"
import LoginCtrl from "./controllers/LoginCtrl.js"
import RegisterCtrl from "./controllers/RegisterCtrl.js"
import FavoritesCtrl from "./controllers/FavoritesCtrl.js"
import OrdersCtrl from "./controllers/OrdersCtrl.js"
import MessagesCtrl from "./controllers/MessagesCtrl.js"
import SettingsCtrl from "./controllers/SettingsCtrl.js"
import SingleOrderCtrl from "./controllers/SingleOrderCtrl.js"



// // Importing directives
import scrollWatch from "./directives/scrollWatch.js"



// // Importing services
// import BackendService from "./services/BackendService.js"
// import UserService from "./services/UserService.js"
// import DataService from "./services/DataService.js"
import AuthService from "./services/AuthService.js"




const app = angular.module('app', ["ionic", "firebase"]);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })


    // ---------------------------
    // Home
    // ---------------------------

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    // ---------------------------
    // user stuff
    // ---------------------------

    .state('app.user-profile', {
      url: '/user-profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/user-profile.html',
          controller: 'UserProfileCtrl'
        }
      }
    })

    .state('app.favorites', {
      url: '/favorites',
      views: {
        'menuContent': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })



    // ---------------------------
    // Category and products
    // ---------------------------

    .state('app.category', {
      url: '/category/:categoryId',
      views: {
        'menuContent': {
          templateUrl: 'templates/category.html',
          controller: 'CategoryCtrl'
        }
      }
    })

    .state('app.single-product', {
      url: '/single-product/:productId',
      views: {
        'menuContent': {
          templateUrl: 'templates/single-product.html',
          controller: 'SingleProductCtrl'
        }
      }
    })


    // ---------------------------
    // Auth
    // ---------------------------
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl'
        }
      }
    })


    // ---------------------------
    // Orders and cart
    // ---------------------------

    .state('app.orders', {
      url: '/orders',
      views: {
        'menuContent': {
          templateUrl: 'templates/orders.html',
          controller: 'OrdersCtrl'
        }
      }
    })

    .state('app.single-order', {
      url: '/single-order',
      views: {
        'menuContent': {
          templateUrl: 'templates/single-order.html',
          controller: 'SingleOrderCtrl'
        }
      }
    })

    // this is the category.
    // .state('app.products', {
    //   url: '/products',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/products.html',
    //       controller: 'ProductsCtrl'
    //     }
    //   }
    // })

    // We discussed about not having this anymore.
    // .state('app.messages', {
    //   url: '/messages',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/messages.html',
    //       controller: 'MessagesCtrl'
    //     }
    //   }
    // })





  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});



// Binding controllers..
app.controller("AppCtrl", AppCtrl);
app.controller("HomeCtrl", HomeCtrl);
app.controller("SingleProductCtrl", SingleProductCtrl);
app.controller("UserProfileCtrl", UserProfileCtrl);
app.controller("CategoryCtrl", CategoryCtrl);
app.controller("LoginCtrl", LoginCtrl);
app.controller("RegisterCtrl", RegisterCtrl);
app.controller("FavoritesCtrl", FavoritesCtrl);
app.controller("OrdersCtrl", OrdersCtrl);
app.controller("MessagesCtrl", MessagesCtrl);
app.controller("SettingsCtrl", SettingsCtrl);
app.controller("SingleOrderCtrl", SingleOrderCtrl);



// Binding directives..
app.directive("scrollWatch", scrollWatch);

// factories
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

// Binding services..
// app.service("BackendService", BackendService);
// app.service("UserService", UserService);
// app.service("DataService", DataService);
app.service("AuthService", AuthService)
