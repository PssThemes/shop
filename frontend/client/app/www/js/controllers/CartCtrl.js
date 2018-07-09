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
    $scope.products = loadProducts($scope.purchases);
  });


  AuthService.onCartChanged(() => {
    $scope.purchases = AuthService.cart;
    $scope.products = loadProducts($scope.purchases);
  });


  $scope.updateHowManyBy = (purchaseId, amount) => {
    AuthService.updateHowMany(purchaseId, amount);
  };


  $scope.removeFromCart = (purchaseId) => {
    AuthService.removeFromCart(purchaseId);
  };

  $scope.cartIsEmpty = () => {
    if($scope.purchases){
      return $scope.purchases.length > 0;
    }else{
      return false;
    }
  };

  $scope.sendOrder = () => {
    if(AuthService.cart){

      const ordersRef = firebase.database().ref().child("orders");
      const orderKey = ordersRef.push().key;

      const purchases = AuthService.cart.reduce((acc, purchase) => {

        const productId = purchase.productId;

        // for each ordered product.. increase the howManyTimesWasOrdered counter by the nr of ordered products..
        const howManyTimesRef = firebase.database().ref("products").child(productId).child("howManyTimesWasOrdered");
        const howManyTimesWasOrdered = $firebaseObject(howManyTimesRef);

        howManyTimesWasOrdered.$loaded(() => {
          howManyTimesWasOrdered.$value = (howManyTimesWasOrdered.$value || 0) + purchase.howMany;
          howManyTimesWasOrdered.$save();
        });


        // extract purchase data in a format that can be saved in firebase.. no $sign in the object keys.. since that gives a firebnase error.
        const purchaseData = {
          howMany: purchase.howMany,
          mainProductImage: $scope.products[purchase.$id].mainProductImage || "no image",
          price: $scope.products[purchase.$id].price || "",
          productId: productId,
          productName: $scope.products[purchase.$id].productName || "",
        };

        // append to the accumulated list of purchases.. is a record in fact, keyed by firenbase push keys.
        acc[productId] = purchaseData;
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
        });


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
