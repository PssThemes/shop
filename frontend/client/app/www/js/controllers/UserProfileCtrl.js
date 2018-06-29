export default function UserProfileCtrl($scope, $stateParams, $state, AuthService, $firebaseObject,$firebaseArray){
  console.log("AuthService.isLoggedIn", AuthService.isLoggedIn);

  $scope.user = null;
  $scope.userProfile = null;

  if (!AuthService.isLoggedIn){
    $state.go("app.login");
  }else{
    $scope.user = AuthService.user;

    // sync the user profile
    const userProfileRef = firebase.database().ref("users/" + $scope.user.uid);
    $scope.userProfile = $firebaseObject(userProfileRef);

  }


  $scope.logOut = () => {
    AuthService.logOut();
    $state.go("app.home");
  }
  // 
  // $scope.getEmail = () => {
  //   if($scope.userProfile && $scope.userProfile.email){
  //     return $scope.userProfile.email;
  //   }else{
  //     return "";
  //   }
  // }

  $scope.getPhone = () => {
    if($scope.userProfile){
      if($scope.userProfile.phone == ""){
        return "not configured";
      }else{
        return $scope.userProfile.phone;
      }
    }else{
      return "not configured";
    }
  }

  $scope.getAddress = () => {
    const userProfile = $scope.userProfile;

    if(userProfile && userProfile.address){
      const street = (userProfile.address.street != "") ? (userProfile.address.street +  ",") : "";
      const city = (userProfile.address.city != "") ? (userProfile.address.city +  ",") : "";
      const state = (userProfile.address.state != "") ? (userProfile.address.state +  ",") : "";

      const formatedAddress = `${street} ${city} ${state}`;
      if(formatedAddress.trim() == ""){
        return "address not configured.";
      }else{
        return formatedAddress;
      }

    }else{
      return "address not configured.";
    }
  }

}
