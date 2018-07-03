export default function CartCtrl($scope, $timeout, AuthService, $state) {

  $scope.cart = AuthService.cart;

  $scope.products = {};

  if(AuthService.cart){

    AuthService.cart.$watch(newCart => {

      // mapOver the list
      // extract the productId.
      // then for each product id build a firebase object reference.
      // trender the products in the view.
      // add counters for each purcahse.

      const productIds = Object.keys(newCart);

      productIds.map(key => {
        const productRef = firebase.database().ref("products").child(key);
        $scope.products[key] = $firebaseObject(productRef);
      });

      console.log("productIds: ",  productIds);

    });

  }


}
