export default function SingleProductCtrl(
  $scope
  , $stateParams
  , $firebaseArray
  , $firebaseObject
  , AuthService
  , RecentlyViewedProductsService
){
  console.log("SingleProductCtrl reinitialized..")
  const db = firebase.database();
  const productId = $stateParams.productId;


  $scope.clientId = null;
  AuthService.onAuthStateChanged(user => {
    $scope.$apply(() => {
      if(user){
        $scope.clientId = user.uid;
      }
    });
  });

  // Load the recently viewd products form a service where we store them.
  $scope.recentlyViewedProducts = RecentlyViewedProductsService.getLastProducts();


  // PRODUCT
  $scope.product = $firebaseObject(db.ref("products/" + productId));

  RecentlyViewedProductsService.addProduct($scope.product);

  // PRODUCT REVIEWS
  $scope.reviews = $firebaseArray(db.ref("products/" + productId + "/reviews"));


  $scope.saveReview = (message, nrOfStars) => {
    if($scope.clientId){

      const review = {
        clientId : $scope.clientId,
        date: Date.now(),
        message: message,
        replies: [],
        value : nrOfStars
      };

      $scope.reviews.$add(review);
    }
  }

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


  // The logged in client can reply to a review.
  $scope.reviewInFocus = null;

  $scope.toggleReply = reviewId => {
    if($scope.reviewInFocus == reviewId){
      $scope.reviewInFocus = null;
    }else{
      $scope.reviewInFocus = reviewId;
    }
  }


  $scope.userCanReply = (reviewId) => {
    // ensures that only the logged in user has the right to reply to it's own messages.
    const creatorOfThisReview = $scope.reviews.$getRecord(reviewId).clientId;
    const currentAuthenticatedUser = $scope.clientId;
    if(!currentAuthenticatedUser){
      return false;
    }

    return currentAuthenticatedUser == creatorOfThisReview;
  }

  $scope.sendReply = (reviewId, message) => {
    console.log("hmm: ", reviewId, message);
    if($scope.clientId){

      const productId = $scope.product.$id;

      const reply = {
        who: "client",
        text: message
      };

      // comnstruct a reference to the replies of this product.
      const repliesRef = db.ref(`products/${productId}/reviews/${reviewId}/replies`);

      // comnstruct a reference to the replies of this product.
      const newReplyKey = repliesRef.push().key;
      repliesRef.child(newReplyKey).set(reply);

    }

  }

  $scope.replyIsActiveAndUserCanComment = (reviewId) => {

    const thisReviewIsInReplyMode = $scope.reviewInFocus == reviewId;
    const userCanReply = $scope.userCanReply(reviewId);

    return thisReviewIsInReplyMode && userCanReply;

  }

}
