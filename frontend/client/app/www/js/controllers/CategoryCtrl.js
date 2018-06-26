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




  // if(categoryId){
  //   BackendService.getCategory(categoryId)
  //       .then(cat => {
  //         $scope.category = cat;
  //
  //         BackendService.getFirstXProductsOfACategory(cat.id, 20)
  //           .then(products => {
  //
  //             Object.keys(products).map(key => {
  //               $scope.category.addProductToCategory(products[key]);
  //             })
  //
  //             $timeout(() => { $scope.$apply() }, 10);
  //
  //           })
  //           .catch( err => {
  //             console.log(`Could not get products for the category with name: ${cat.name} and ${cat.id}`, err);
  //           });
  //
  //         $timeout(() => { $scope.$apply() }, 10);
  //
  //       })
  //       .catch(err => {
  //         console.log("could not load the category with id: ", categoryId, err);
  //       });
  //
  // }else{
  //
  //   console.log("Dev Error: i forgot to pass the categoryId parameter into the ui-router sref call.");
  //
  // }


}
//
// export default function categories($firebaseArray) {
//     // create a reference to the database location where we will store our data
//     var ref = window.firebase.database().ref("/messages");
//     // this uses AngularFire to create the synchronized array
//     return $firebaseArray(ref);
// }
