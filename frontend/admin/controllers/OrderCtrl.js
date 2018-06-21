import {RECEIVED, PROCESSED, DELIVERED, Order} from "./../data/Order.js"
import UserProfile from "./../data/UserProfile.js"


export default function OrderCtrl($scope, $timeout, $routeParams, BackendService){

  const orderId = $routeParams.orderId;
  //
  // const fakeOrder = new Order({
  //   id: orderId,
  //   date: "17 may 2019",
  //   orderStatus: RECEIVED,
  //   userProfileId: "user profile id.",
  //   purchases: [{
  //     productId : "productId1",
  //     productName : "Monitor",
  //     productImage : null,
  //     price : 200,
  //     howMany : 1,
  //     attributes : []
  //   },
  //   {
  //     productId : "productId2",
  //     productName : "Tastatura",
  //     productImage : null,
  //     price : 50,
  //     howMany : 3,
  //     attributes : []
  //   },
  //   {
  //     productId : "productId3",
  //     productName : "Mouse",
  //     productImage : null,
  //     price : 50,
  //     howMany : 1,
  //     attributes : []
  //   },
    // {
    //   productId : "this.productId",
    //   productName : "this.productName",
    //   productImage : "this.productImage",
    //   price : "this.price",
    //   howMany : "this.howMany",
    //   attributes : []
    // }
    // ],
  // });

  // const fakeUserAddress = {
  //   street: "5 May",
  //   more: "Aleea infundata",
  //   city: "Timisoara",
  //   county: "Timis",
  //   postalCode: "732888",
  // };
  //
  // const fakeUserProfile = new UserProfile({
  //   uid : "user profile id",
  //   name :  null,
  //   email :  "joncastron@gmail.com",
  //   address :  fakeUserAddress,
  //   phone : "07928034923",
  //   isBlocked : false,
  // });

   // = fakeOrder;
  // fakeUserProfile;

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
    // console.log("switchOrderStatus.. ");
    $scope.order.switchOrderStatus();
    // // TODO: Update firebase..
  };

}
