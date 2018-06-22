const appControllers = angular.module('app.controllers', ['ngAnimate'])

appControllers.directive('scrollWatch', function() {
  return {
      restrict: 'A',
      link: function(scope, elem, attr) {
          var start = 0;
          var limit = 50;
          scope.$root.scrollTop = false;
          elem.bind('scroll', function(e) {
            console.log(e);
            if(e.detail.scrollTop - start > limit || start - e.detail.scrollTop > limit ) {
              scope.$apply(function() {
                scope.$root.scrollTop = true;
              });
            } else {
              scope.$apply(function() {
                scope.$root.scrollTop = false;
              });
            }
          });
      }
  }
})

appControllers.controller('AppCtrl', function($scope) {

  $scope.menu = [
    { title: 'Home', icon: 'home', type: 'primary', state: "app.home" },
    // TODO: fix the about page.
    { title: 'About', icon: 'users', type: 'secondary', state: "app.home"},
    // TODO: fix the contact page.
    { title: 'Contact', icon: 'envelope', type: 'secondary', state: "app.home" },
    // TODO: fix the terms page.
    { title: 'Terms', icon: 'pushpin', type: 'secondary', state: "app.home" },
    // TODO: fix the account page.
    { title: 'Account', icon: 'user', type: 'primary', state: "app.login" },

    { title: 'Favs', icon: 'heart', type: 'secondary', state: "app.favorites" },

    // NOTE: we said we remove msgs functionality.. we keep only product review msgs.
    // { title: 'Messages', icon: 'bubble', type: 'secondary', state: "app.home" },

    { title: 'Settings', icon: 'cog', type: 'secondary', state: "app.settings" },
  ];

})

appControllers.controller('HomeCtrl', function($scope, $http) {

  $http.get("https://ccs.pssthemes.com/mobile/get_categories")
    .then(function(response) {
        $scope.categories = response.data;
    });

})

appControllers.controller('SingleProductCtrl', function($scope, $stateParams) {
})

appControllers.controller('UserProfileCtrl', function($scope, $stateParams) {
})

appControllers.controller('CategoryCtrl', function($scope, $stateParams) {
})

appControllers.controller('LoginCtrl', function($scope, $stateParams, $state) {
  $state.go("app.single-product")
})

appControllers.controller('RegisterCtrl', function($scope, $stateParams) {
})

appControllers.controller('ProductsCtrl', function($scope, $stateParams) {
})

appControllers.controller('FavoritesCtrl', function($scope, $stateParams) {
})

appControllers.controller('OrdersCtrl', function($scope, $stateParams) {
})

appControllers.controller('MessagesCtrl', function($scope, $stateParams) {
})

appControllers.controller('SettingsCtrl', function($scope, $stateParams) {
})

appControllers.controller('SingleOrderCtrl', function($scope, $stateParams) {
})
