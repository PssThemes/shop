export default function SettingsCtrl($scope, $stateParams,$state,AuthService){
  if (!AuthService.isLoggedIn){
    $state.go("app.login");
  }else{

    // stuff user profile here....

  }
}
