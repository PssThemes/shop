export default function FavoritesCtrl($scope,$timeout, $stateParams,$state, AuthService, $firebaseObject){
  if (!AuthService.isLoggedIn){
    $state.go("app.login");
  }else{
    const favoritesRef = firebase.database().ref("users").child(AuthService.user.uid).child("favorites");
    // Get the user id.
    // get the favorite products list.

    $scope.favoriteProducts = {};

    favoritesRef.on("value", snap => {
      const favs = snap.val();

      if(favs){
        console.log("favs: ", favs);
        $scope.favoriteProducts = Object.keys(favs).reduce((acc, productId) => {

          const productRef = firebase.database().ref("products").child(productId);
          // TODO: implement a diffing mechanism here such that we don't override an already
          // existing reference.
          // since is real time.. there is no point in doing it.
          // still is just references to things.. so i don't think will be a hudge
          // performance problem.. also favoriting items is quite rare.

          acc[productId] = $firebaseObject(productRef);
          return acc;

        }, {});

        $timeout(() => {
          $scope.$apply();
        }, 100)

      }

    });

    $scope.removeFromFavorites = (productId) => {
      console.log("removeFromFavorites: ");
      // NOTE: without this the last product does not get deleted since the firebase event does not fire for non existent collections.
      delete $scope.favoriteProducts[productId];
      favoritesRef.child(productId).set(null);
    }

  }


}
