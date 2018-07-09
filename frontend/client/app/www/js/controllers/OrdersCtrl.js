export default function OrdersCtrl($scope, $state, $timeout, $stateParams,AuthService, $firebaseArray){
  if (!AuthService.isLoggedIn){
    $state.go("app.login");
    return;
  }

  const ordersForThisUserRef = firebase.database()
    .ref("orders")
    .orderByChild("userProfileId")
    .equalTo(AuthService.user.uid);

  $scope.orders = $firebaseArray(ordersForThisUserRef);

  $timeout(() => {
    console.log("$scope.orders: ", $scope.orders);
  }, 2000);

  $scope.noOrders = () => {
    return $scope.orders.length <= 0;
  };


}
