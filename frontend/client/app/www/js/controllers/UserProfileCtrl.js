export default function UserProfileCtrl($scope, $stateParams, $state, AuthService){
  console.log("AuthService.isLoggedIn", AuthService.isLoggedIn);
  if (!AuthService.isLoggedIn){
    $state.go("app.login");
  }else{

    // stuff user profile here....

  }
}
