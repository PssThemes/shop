export default function LoginCtrl($scope,$state, $stateParams, AuthService){

  if(AuthService.isLoggedIn){
    $state.go("app.user-profile")
  }

  $scope.emailError = "";
  $scope.passwordError = "";

  $scope.login = (email, password) => {

    console.log(email, password);

    if(!validEmail(email)){
      $scope.emailError = "bad email"
    }

    if(!validPassword(password)){
      $scope.passwordError = "bad password"
    }


    AuthService.login(email, password)
      .then(() => {
        $state.go("app.user-profile");
      })
      .catch(errorMessage => {
        $scope.$apply(() => {
          $scope.firebaseError = errorMessage;
        });
      });

    $scope.emailError = "";
    $scope.passwordError = "";
    $scope.firebaseError = "";

  };

}


function validEmail(){
  return true;
}

function validPassword(){
  return true;
}
