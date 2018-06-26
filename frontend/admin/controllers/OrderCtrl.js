import {RECEIVED, PROCESSED, DELIVERED, Order} from "./../data/Order.js"
import UserProfile from "./../data/UserProfile.js"


export default function OrderCtrl($scope, $timeout, $routeParams, BackendService){

  const orderId = $routeParams.orderId;

  BackendService.getOrder(orderId)
    .then(order => {
      $scope.order =  order;
      $timeout(() => {
        $scope.$apply();
      },10);


      // Load user the user profile that is attached to this order.
      BackendService.getUserProfile(order.userProfileId)
        .then(userProfile => {
          $scope.userProfile = userProfile;
          $timeout(() => {
            $scope.$apply();
          },10);
          console.log("userProfile: ", userProfile);


          // get real time updates while the user profile changes..
          BackendService.onSpecificUserProfileChanged($scope.userProfile.uid, newProfile => {
              $scope.userProfile = newProfile;
              $timeout(() => {
                $scope.$apply();
              },10);
            });

        })
        .catch(err => {
          console.log(`could not get order with id: ${orderId}`, err)
        });

    })
    .catch(err => {
      console.log(`could not get order with id: ${orderId}`, err)
    })

  BackendService.onSpecificOrderChanged(orderId, newOrder => {
    $scope.order =  newOrder;
    $timeout(() => {
      $scope.$apply();
    },10);
  })



  $scope.calculateTotalPrice = () => {
    return $scope.order.getTotalPrice();
  };

  $scope.getActionName = () => {
    return $scope.order.getActionName();
  };

  $scope.switchOrderStatus = () => {

    $scope.order.switchOrderStatus();

    BackendService.updateOrder($scope.order)
      .catch(err => {
        console.log("could not update order: ", err);
      });
  };

}
