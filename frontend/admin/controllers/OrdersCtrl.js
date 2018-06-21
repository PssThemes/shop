import {RECEIVED, PROCESSED, DELIVERED, Order} from "./../data/Order.js"

function OrdersCtrl($scope, $timeout, BackendService) {

  $scope.orders = {};

  BackendService.onOrderAdded((order) => {
    $scope.orders[order.id] = order;
    $timeout(() => {
      $scope.$apply();
    },10);
  });

  BackendService.onOrderChanged((order) => {
    $scope.orders[order.id] = order;
    $timeout(() => {
      $scope.$apply();
    },10);
  });

  $scope.calculateTotalPrice = orderId => {
    return $scope.orders[orderId].getTotalPrice();
  };

  $scope.getActionName = orderId => {
    return $scope.orders[orderId].getActionName();
  };

  $scope.switchOrderStatus = orderId => {
    $scope.orders[orderId].switchOrderStatus();
    BackendService.updateOrder($scope.orders[orderId])
      .catch(err => {
        console.log("could not update order: ", err);
      });
  };


}

export default OrdersCtrl;
