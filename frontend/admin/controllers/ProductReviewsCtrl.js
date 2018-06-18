export default function ProductReviewsCtrl($scope, $timeout, $routeParams, BackendService){

  const productId = $routeParams.productId;
  $scope.product = null;

  $scope.clients = {};

  $scope.getClientName = (clientId) =>{
    if($scope.clients && $scope.clients[clientId]){
      return  $scope.clients[clientId].name
    }
  }

  $scope.createAdminReply = (reviewId) => {

    const review = $scope.product.reviews[reviewId];
    const value =  review.replyBox.trim();

    if(value != ""){
      review.clearReplyBox();
      BackendService.createAdminReplyForReview($scope.product.id, reviewId, value)
        .catch(err => {
          console.log(new Error("could not create the admin reply"))
        });
    }
  }

  BackendService.getProduct(productId)
    .then(product => {
      $scope.product = product;

      $timeout(() => {
        $scope.$apply();
      },10);

      $timeout(() => {
        updateClients();
      },15);

    })
    .catch(err => {
      // NOTE: this might catch dev mistakes in the above then clause.
      //  like $scope.apply() instead of $scope.$apply()
      console.log(new Error("could not get the product with id: "), productId);
    });


  BackendService.onSpecificProductUpdate(productId, newProduct => {
    $scope.product = newProduct;

    $timeout(() => {
      $scope.$apply();
    }, 10);

    $timeout(() => {
      updateClients();
    }, 15);

  });


  function updateClients(){
    if($scope.product){

      const clientsIds = $scope.product.getClientsIds();
      // NOTE: here we filter out the clients we already have.
      clientsIds
        .filter( clientId => $scope.clients[clientId] ? false : true )

        // NOTE: for the clients we don't have yet .. ask the backend for their info.
        .map(clientId => {
          BackendService.getUserProfile(clientId)
            .then(client => {
              $scope.clients[clientId] = client;
              $scope.$apply();
            })
            .catch(err => {
              console.log("could not get client with id: ", clientId);
            });
          return null;
        });
    }
  }


}
