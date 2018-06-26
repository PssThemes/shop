export default function SingleProductCtrl($scope, $stateParams, $firebaseArray, $firebaseObject){

  const db = firebase.database();

  const productId = $stateParams.productId;

  const productRef = db.ref("products/" + productId);

  $scope.product = $firebaseObject(productRef);
  console.log($scope.product);
  $scope.longDescription = "The Apple Watch, with its inbuilt speaker and microphone, gives you the freedom to call your friends directly from your wrist. This splash-resistant smartwatch features an S1P dual-core processor for a fast and smooth performance. It has a digital crown, along with a heart rate sensor, gyroscope, ambient light sensor and an accelerometer. Its Rose Gold aluminium case and Midnight Blue strap further add to its appeal.";

  $scope.showReviews = true;

  $scope.toggleReviews = () => {
    $scope.showReviews = !$scope.showReviews;
  }

  $scope.adminImage = $firebaseObject(db.ref("adminImage"));

  $scope.clients = {
    "-LFvnFfrOYynaicGdxAH" : {
      profileImage : "https://randomuser.me/api/portraits/men/2.jpg"
    }
  }


  // Logged in client can reply to a review.
  $scope.reviewInFocus = null;

  $scope.toggleReply = reviewId => {
    if($scope.reviewInFocus == reviewId){
      $scope.reviewInFocus = null;
    }else{
      $scope.reviewInFocus = reviewId;
    }
  }

  $scope.thisReviewIsInReplyMode = reviewId => {
    return $scope.reviewInFocus == reviewId;
  }

  // TODO ensure that only the logged in user has the right to reply to it's own messages.
  
  $scope.reply = (reviewId, message) => {
    $scope.product.reviews[reviewId].replies.push({
      who: "client",
      text: message
    });

    $scope.product.$save();
  }

}
