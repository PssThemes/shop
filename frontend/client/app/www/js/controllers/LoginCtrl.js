export default function LoginCtrl($scope,$state, $stateParams, AuthService){

  if(AuthService.isLoggedIn){
    $state.go("app.user-profile")
  }

  $scope.login = (email_, password_) => {

    const email = email_ || "";
    const password = password_ || "";

    $scope.emailError = "";
    $scope.passwordError = "";
    $scope.firebaseError = "";

    const { emailIsValid, emailError } = validateEmail(email);
    const { passwordIsValid, passwordError } = validatePassword(password);

    const allValid =
      emailIsValid
      && passwordIsValid;

    if(!emailIsValid){
      $scope.emailError = emailError;
    }

    if(!passwordIsValid){
      $scope.passwordError = passwordError;
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

  };

}

function validateEmail(email){
  if(email == ""){
    return { emailIsValid: false, emailError: "hey:) email is empty!!"};
  }else{
    return { emailIsValid: true, emailError: ""};
  }
}


function validatePassword(password){
  if(password == ""){
    return { passwordIsValid: false, passwordError: "hey you forgot the password."};
  }else{
    return { passwordIsValid: true, passwordError: ""};
  }
}
