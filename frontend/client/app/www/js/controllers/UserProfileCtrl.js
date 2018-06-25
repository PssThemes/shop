export default function UserProfileCtrl($scope, $stateParams, $state, UserService){
  if (UserService.notLoggedIn()){
    $state.go("app.login");
  }else{

    // stuff user profile here....
    

  }
}
