export default function RegisterCtrl($scope, $state, $stateParams, AuthService){

  // Go directly to user profile if the user is logged in..
  console.log("AuthService.isLoggedIn: ", AuthService.isLoggedIn);
  if(AuthService.isLoggedIn){
    $state.go("app.user-profile")
  }

  $scope.register = (name_, email_, password1_, password2_) => {

    const name = name_ || "";
    const email = email_ || "";
    const password1 = password1_ || "";
    const password2 = password2_ || "";

    // Reset all errors ..since we can have stuff around form the last time.
    $scope.nameError = "";
    $scope.emailError = "";
    $scope.passwordError = "";
    $scope.backendWarningMessage = "";
    $scope.backendErrorMessage = "";

    const { nameIsValid, nameError } = validateName(name);
    const { emailIsValid, emailError } = validateEmail(email);
    const { passwordIsValid, passwordError } = validatePassword(password1);


    const allValid =
      nameIsValid
      && emailIsValid
      && passwordIsValid
      && (password1 == password2);

    if(!nameIsValid){
      $scope.nameError = nameError;
    }

    if(!emailIsValid){
      $scope.emailError = emailError;
    }

    if(password1 != password2){
      $scope.passwordError = "passwords don't match";
    }

    if(!passwordIsValid){
      $scope.passwordError = passwordError;
    }


    // Everything checks out :D
    if(allValid){
      AuthService.register(name.trim(), email.trim().toLowerCase(), password1)
        .then( maybeWarningMessage => {
          if(maybeWarningMessage){

            $scope.apply(() => {
              $scope.backendWarningMessage = maybeWarningMessage;
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
            $scope.backendErrorMessage = errorMessage;
          });
        });
    }

    // END register function
  }


}

function validateName(name){
  if(name.trim() == ""){
    return { nameIsValid: false, nameError: "please include a name"};
  }else{
    return { nameIsValid: true, nameError: ""};
  }
}

function validateEmail(email){

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result =  re.test(String(email).toLowerCase());
  if(result){
    return { emailIsValid: true, emailError: ""};
  }else{
    return { emailIsValid: false, emailError: "bad email"};
  }
}

function validatePassword(password){
  // TODO: get a good grasp of what firebase allows as passwords.
  if(password.length < 6){
    return {
        passwordIsValid: false
        , passwordError: "password is too short. put at least 6 characters"
      };
  }else{
    return { passwordIsValid: true, passwordError: ""};
  }
}
