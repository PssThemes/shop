export default function CategoryCtrl($scope, $timeout, $stateParams, $firebaseArray, $firebaseObject ){

  // sync this category. sync name and stuff.
  const categoryId =  $stateParams.categoryId;
  const categoryRef = firebase.database().ref("categories/" + categoryId);

  $scope.category = $firebaseObject(categoryRef);


  // Load products for this category

  const first30Products = firebase
    .database()
    .ref("products")
    .orderByChild("categoryId")
    .equalTo(categoryId)
    .limitToFirst(30);

  $scope.productsForThisCategory = $firebaseArray(first30Products);

}
