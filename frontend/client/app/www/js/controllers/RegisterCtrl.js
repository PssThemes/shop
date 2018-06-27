export default function RegisterCtrl($scope, $state, $stateParams, AuthService){
  console.log("AuthService.isLoggedIn: ", AuthService.isLoggedIn);
  if(AuthService.isLoggedIn){

    $state.go("app.user-profile")
  }

  $scope.register = (name, email, password1, password2) => {

    console.log("register: ", name, email, password1, password2);
    // TODO: verify that values are valid.

    AuthService.register(name, email, password1)
      .then( maybeWarningMessage =>{
        if(maybeWarningMessage){

          $scope.apply(() => {
            $scope.warningMessage = maybeWarningMessage;
          });

          $timeout(() => {
            $state.go("app.user-profile");
          }, 3000);

        }else{
          $state.go("app.user-profile");
        }

      })
      .catch(errorMessage => {
        $scope.$apply(() => {
          $scope.errorMessage = errorMessage;
        });
      })
  }


}
