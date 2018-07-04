export default function CartCtrl($scope, $timeout, AuthService, $firebaseObject, $state) {
  if(!AuthService.isLoggedIn){
    console.log("AuthService.isLoggedIn", AuthService.isLoggedIn)
    $state.go("app.login");
  }

  $scope.purchases = {};
  $scope.products = {};

  function loadProducts(purchases){
      const productIds = purchases.map(purchase => purchase.$id);

      return productIds.reduce((acc, productId) => {

        const productRef = firebase.database().ref().child("products").child(productId);
        acc[productId] = $firebaseObject(productRef);

        return acc;
      }, {});
  }

  AuthService.onProfileLoaded(() => {
    $scope.purchases = AuthService.cart;
    console.log("onProfileLoaded: ",$scope.purchases  );
    $scope.products = loadProducts($scope.purchases);
    console.log("onProfileLoaded: ",$scope.products );
  });

  AuthService.onCartChanged(() => {
    console.log("onCartChanged: ");
    $scope.purchases = AuthService.cart;
    $scope.products = loadProducts($scope.purchases);
  });


  $scope.updateHowManyBy = (purchaseId, amount) => {
    AuthService.updateHowMany(purchaseId, amount);
  }


  $scope.removeFromCart = (purchaseId) => {
    AuthService.removeFromCart(purchaseId);
  }

  // $timeout(() => {
  //   AuthService.onCartLoaded
  //
  //   if(AuthService.cart){
  //
  //     AuthService.cart
  //       .$loaded()
  //       .then(purchases => {
  //
  //         $timeout(() => {
  //
  //           $scope.$apply(() => {
  //
  //             console.log("$scope.products: ", $scope.products);
  //           });
  //
  //         }, 10);
  //
  //       })
  //       .catch(err => console.log(err));
  //
  //   }

  // }, 2000);


}



//
// const products = $scope.purchases.reduce(purchase => {
//
//   loadProduct(purchase.productId);
//
// }, {});
// $scope.products = products;




      //
      // AuthService.cart.$watch(productId => {
      //
      //   // mapOver the list
      //   // extract the productId.
      //   // then for each product id build a firebase object reference.
      //   // trender the products in the view.
      //   // add counters for each purcahse.
      //
      //   const productIds = Object.keys(newCart);
      //
      //   productIds.map(key => {
      //     const productRef = firebase.database().ref("products").child(key);
      //     $scope.products[key] = $firebaseObject(productRef);
      //   });
      //
      //   console.log("$scope.products: ", $scope.products);
      //   console.log("productIds: ",  productIds);
      //
      // });




//
// const productIds = Object.keys(AuthService.cart);
// productIds.map(key => {
//   console.log("key: ", key);
//   const productRef = firebase.database().ref().child("products").child(key);
// });
