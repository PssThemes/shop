export default function FavoritesCtrl($scope, $stateParams,$state, AuthService){
  if (!AuthService.isLoggedIn){
    $state.go("app.login");
  }else{

    // stuff user profile here....

  }
}
