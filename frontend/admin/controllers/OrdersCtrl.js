import {RECEIVED, PROCESSED, DELIVERED, Order} from "./../data/Order.js"

function OrdersCtrl($scope) {
  $scope.name = "cucubabbus";

  const fakeOrder = new Order({
    id: "orderIdHere",
    date: "17 may 2019",
    orderStatus: RECEIVED,
    userProfileId: "user profile id.",
    purchases: [{
      productId : "productId1",
      productName : "Monitor",
      productImage : null,
      price : 200,
      howMany : 3,
      attributes : []
    },
    {
      productId : "productId2",
      productName : "Tastatura",
      productImage : null,
      price : 50,
      howMany : 3,
      attributes : []
    },
    {
      productId : "productId3",
      productName : "Mouse",
      productImage : null,
      price : 50,
      howMany : 3,
      attributes : []
    },
    // {
    //   productId : "this.productId",
    //   productName : "this.productName",
    //   productImage : "this.productImage",
    //   price : "this.price",
    //   howMany : "this.howMany",
    //   attributes : []
    // }
    ],
  });

  $scope.orders = {
    "orderIdHere": fakeOrder
  };

  $scope.calculateTotalPrice = orderId => {
    return $scope.orders[orderId].getTotalPrice();
  };

  $scope.getActionName = orderId => {
    return $scope.orders[orderId].getActionName();
  };

  $scope.switchOrderStatus = orderId => {
    $scope.orders[orderId].switchOrderStatus();
  };

}

// this.id = orderData.id;
// this.date = orderData.date;
// this.purchases = purchases;
// this.orderStatus = orderData.orderStatus || RECEIVED;
// this.userProfileId = orderData.userProfileId;


export default OrdersCtrl;
