export default function HomeCtrl($scope,$timeout,$rootScope, $firebaseArray) {
  console.log("HomeCtrl");
  const categoriesRef = firebase.database().ref("categories");
  $scope.categories = $firebaseArray(categoriesRef);
}
