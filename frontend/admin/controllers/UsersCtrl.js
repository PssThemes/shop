import UserProfile from "./../data/UserProfile.js"

function UsersCtrl($scope,$timeout, BackendService) {


  $scope.users = {};

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

  // we use child_added event to load the list of users..
  BackendService.onUserProfileRemoved(uid => {
    delete $scope.users[uid];
    $timeout(() => {
      $scope.$apply();
    }, 10);
  });

}

export default UsersCtrl;
