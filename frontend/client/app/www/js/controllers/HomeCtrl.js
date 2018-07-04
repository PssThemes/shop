export default function HomeCtrl($scope,$timeout,$rootScope, $firebaseArray) {
  const categoriesRef = firebase.database().ref("categories");
  $scope.categories = $firebaseArray(categoriesRef);
}
