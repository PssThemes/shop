import { validateEmail } from "./../utils/Validation.js";

export default function SettingsCtrl($scope, $stateParams,$state,AuthService){
  if (!AuthService.isLoggedIn){
    $state.go("app.login");
    return;
  }

  $scope.profile = {
    name: "",
    email: "",
    phone: "",
    profileImage: "",

    address : {
      primaryAddress : "",
      extraAddress: "",

      postalCode: "",

      city: "",
      state: "",
      country: "",
    }
  };
  function constructProfile (){
    $scope.profile = {
      name: AuthService.userProfile.name || "",
      email: AuthService.userProfile.email || "",
      phone: AuthService.userProfile.phone || "",
      profileImage: AuthService.userProfile.profileImage || "",

      address : {
        primaryAddress : AuthService.userProfile.address.primaryAddress || "",
        extraAddress: AuthService.userProfile.address.extraAddress || "",

        postalCode: AuthService.userProfile.address.postalCode || "",

        city: AuthService.userProfile.address.city || "",
        state: AuthService.userProfile.address.state || "",
        country: AuthService.userProfile.address.country || "",
      }
    };
  }

  AuthService.userProfile.$loaded(() => {
    constructProfile(AuthService.userProfile);
  });

  AuthService.userProfile.$watch(() => {
    constructProfile(AuthService.userProfile);
  });

  $scope.saveSettings = (profile) => {
    // Because of ionic scoping crap.. i'm gonna save in firebase.. and i expect
    // it to get updated backwards.. this is why i have the watch listener there.


    const { emailIsValid, emailError } = validateEmail(profile.email);

    const allAreValid = emailIsValid;

    if(allAreValid){
      const userProfileRef = firebase.database().ref("users").child(AuthService.user.uid);
      userProfileRef.update(profile);
    }else{
      $scope.emailError = emailError;
    }

  }


}
