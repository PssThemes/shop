export default function HomeCtrl($scope,$timeout,$rootScope, $firebaseArray, $firebaseObject) {
  const categoriesRef = firebase.database().ref("categories");
  $scope.categories = $firebaseArray(categoriesRef);

  const top20ProductsQuery =
    firebase.database()
      .ref("products")
      .orderByChild("howManyOrders")
      // .startAt(1)
      .limitToFirst(20);

  $scope.topProducts = $firebaseArray(top20ProductsQuery);
  const bannerRef = firebase.database().ref("banner");

  $scope.banner = $firebaseObject(bannerRef);

}
