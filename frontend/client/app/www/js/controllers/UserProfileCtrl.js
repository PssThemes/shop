export default function UserProfileCtrl($scope, $stateParams, $state, AuthService, $firebaseObject,$firebaseArray){
  // console.log("AuthService.isLoggedIn", AuthService.isLoggedIn);

  $scope.user = null;
  $scope.userProfile = null;

  $scope.getProfileImage = () => {
    const defaultAnonimImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNAM5sWNKuLSkHmpKMpSIgKB9xQvCM_Ndl6hdp2y6gmK2PvvHs";
    if($scope.userProfile){
      const image = ($scope.userProfile.profileImage == "") ? defaultAnonimImage : $scope.userProfile.profileImage;
      return image;
    }else{
      return defaultAnonimImage;
    }
  }

  if (!AuthService.isLoggedIn){
    $state.go("app.login");
  }else{
    $scope.user = AuthService.user;
    $scope.userProfile = AuthService.userProfile;
  }


  $scope.logOut = () => {
    AuthService.logOut();
    $state.go("app.home");
  }

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
      const primaryAddress = (userProfile.address.primaryAddress != "") ? (userProfile.address.primaryAddress +  ",") : "";
      const city = (userProfile.address.city != "") ? (userProfile.address.city +  ",") : "";
      const state = (userProfile.address.state != "") ? (userProfile.address.state +  ",") : "";

      const formatedAddress = `${primaryAddress} ${city} ${state}`;
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
