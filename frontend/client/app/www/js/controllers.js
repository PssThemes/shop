angular.module('starter.controllers', ['ngAnimate'])

.directive('scrollWatch', function() {
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

.controller('AppCtrl', function($scope) {

  $scope.menu = [
    { title: 'Home', icon: 'home', type: 'primary' },
    { title: 'About', icon: 'users', type: 'secondary' },
    { title: 'Contact', icon: 'envelope', type: 'secondary' },
    { title: 'Terms', icon: 'pushpin', type: 'secondary' },
    { title: 'Account', icon: 'user', type: 'primary' },
    { title: 'Favs', icon: 'heart', type: 'secondary' },
    { title: 'Messages', icon: 'bubble', type: 'secondary' },
    { title: 'Settings', icon: 'cog', type: 'secondary' },
  ];

})

.controller('HomeCtrl', function($scope, $http) {

  $http.get("https://ccs.pssthemes.com/mobile/get_categories")
    .then(function(response) {
        $scope.categories = response.data;
    });

})

.controller('SingleProductCtrl', function($scope, $stateParams) {
})

.controller('UserProfileCtrl', function($scope, $stateParams) {
})

.controller('CategoryCtrl', function($scope, $stateParams) {
})

.controller('LoginCtrl', function($scope, $stateParams) {
})

.controller('RegisterCtrl', function($scope, $stateParams) {
})

.controller('ProductsCtrl', function($scope, $stateParams) {
})

.controller('FavoritesCtrl', function($scope, $stateParams) {
})

.controller('OrdersCtrl', function($scope, $stateParams) {
})

.controller('MessagesCtrl', function($scope, $stateParams) {
})

.controller('SettingsCtrl', function($scope, $stateParams) {
})

.controller('SingleOrderCtrl', function($scope, $stateParams) {
})
