export default function CartCtrl($scope, $timeout, AuthService, $firebaseObject, $firebaseArray, $state) {
  // if(!AuthService.isLoggedIn){
  //   console.log("AuthService.isLoggedIn", AuthService.isLoggedIn)
  //   $state.go("app.login");
  // }

  $scope.purchases = {};
  $scope.products = {};

  $scope.purchases = AuthService.cart;
  $scope.products = loadProducts($scope.purchases);

  AuthService.onProfileLoaded(() => {
    $scope.purchases = AuthService.cart;
    console.log("onProfileLoaded: ", $scope.purchases);
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

  $scope.sendOrder = () => {
    if(AuthService.cart){

      const ordersRef = firebase.database().ref().child("orders");
      const orderKey = ordersRef.push().key;

      const purchases = AuthService.cart.reduce((acc, purchase) => {
        const order = {
          howMany: purchase.howMany,
          mainProductImage: $scope.products[purchase.$id].mainProductImage || "no image",
          price: $scope.products[purchase.$id].price || "",
          productId: purchase.$id,
          productName: $scope.products[purchase.$id].productName || "",
        };

        acc[purchase.$id] = order;
        return acc;
      }, {});

      const order = {
        date: Date.now(),
        orderStatus: "RECEIVED",
        purchases: purchases || [],
        userProfileId: AuthService.user.uid
      };

      ordersRef.child(orderKey).set(order)
        .then(() => {
          AuthService.clearCart()
        })

    }
  }


  function loadProducts(purchases){
    if(purchases){

      const productIds = purchases.map(purchase => purchase.$id);

      return productIds.reduce((acc, productId) => {

        const productRef = firebase.database().ref().child("products").child(productId);
        acc[productId] = $firebaseObject(productRef);

        return acc;
      }, {});

    }
  }
}
