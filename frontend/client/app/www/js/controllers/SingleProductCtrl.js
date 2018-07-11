export default function SingleProductCtrl(
  $scope
  , $stateParams
  , $firebaseArray
  , $firebaseObject
  , AuthService
  , RecentlyViewedProductsService
){
  const db = firebase.database();
  const productId = $stateParams.productId;

  $scope.clients = {};
  $scope.clientId = null;
  AuthService.onAuthStateChanged(user => {
    $scope.$apply(() => {
      if(user){
        $scope.clientId = user.uid;
      }
    });
  });


  $scope.isFavorite = AuthService.isFavorite;
  $scope.toggleFavorite = AuthService.toggleFavorite;


  // Load the recently viewd products form a service where we store them.
  $scope.recentlyViewedProducts = RecentlyViewedProductsService.products;
  $scope.recentlyViewedProductsIds = RecentlyViewedProductsService.productIds;

  $scope.getRecentProductIds = () => {

    const productIds = $scope.recentlyViewedProductsIds;

    if($scope.product){

      const productId = $scope.product.$id;
      const ids = productIds.filter(x => x != productId);
      return ids.reverse();

    }else{
      return productIds.reverse();
    }
  }

  // PRODUCT
  $scope.product = $firebaseObject(db.ref("products/" + productId));

  RecentlyViewedProductsService.addProduct($scope.product.$id);

  // PRODUCT REVIEWS
  $scope.reviews = $firebaseArray(db.ref("products/" + productId + "/reviews"));
  $scope.reviews.$watch(() => {

      console.log("watch.. ");

      const clientsIds = $scope.reviews
        .map(review => review.clientId);

      console.log("clientsIds: ", clientsIds);

      clientsIds.map(clientId => {
          console.log("hey: ", clientId);
          const userRef = firebase.database().ref("users").child(clientId);
          $scope.clients[clientId] = $firebaseObject(userRef);
        });

      console.log("$scope.clients: ", $scope.clients);

  });

  $scope.getClientProfileImage = (clientId) => {
    const img = ($scope.clients[clientId] || {}).profileImage;
    const defaultImage =  "img/avatar.jpg";
    const result = (img == "" || img == undefined ) ?  defaultImage : img;
    console.log(" getClientProfileImage: ", result);
    return result;
  };

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

  $scope.getProfileImage = (reviewClientId) => {

    const defaultImage = "img/avatar.jpg"
    const image = clients[review.clientId].profileImage;
    const result = image ? image : defaultImage;

    console.log("result ", result);

    return result;
  }

  $scope.adminImage = $firebaseObject(db.ref("adminImage"));



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

  $scope.productIsAlreadyInCart = AuthService.productIsAlreadyInCart;
  $scope.toggleAddToCart = AuthService.toggleAddToCart;

}
