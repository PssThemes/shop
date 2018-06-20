import UserProfile from "./../data/UserProfile.js"

function UsersCtrl($scope,$timeout, BackendService) {

  const fakeUserAddress = {
    street: "5 May",
    more: "Aleea infundata",
    city: "Timisoara",
    county: "Timis",
    postalCode: "732888",
  };

  const fakeUserProfile = new UserProfile({
    uid : "user profile id",
    name :  null,
    email :  "joncastron@gmail.com",
    address :  fakeUserAddress,
    phone : "07928034923",
    isBlocked : false,
  });

  $scope.users = {
    "user profile id" : fakeUserProfile
  }

  $scope.toggleBlockState = (userId) => {
    $scope.users[userId].toggleBlockUser();

    BackendService.updateUserProfile($scope.users[userId])
      .catch(err => {
        console.log("could not update user profile for reason: ", err);
      });
  }


  BackendService.onUserProfileChanged(newProfile => {
    $scope.users[newProfile.uid] = newProfile;
    $timeout(() => {
      $scope.$apply();
    }, 10);
  });


  // we use child_added event to load the list of users..
  BackendService.onUserProfileAdded(newProfile => {
    $scope.users[newProfile.uid] = newProfile;
    $timeout(() => {
      $scope.$apply();
    }, 10);
  });

}

export default UsersCtrl;
