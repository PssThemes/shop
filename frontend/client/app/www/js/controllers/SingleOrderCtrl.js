export default function SingleOrderCtrl($scope, $stateParams, $firebaseObject){

  const orderRef = firebase.database().ref("orders").child($stateParams.orderId);

  $scope.order = $firebaseObject(orderRef);
  $scope.orderedProducts = {}

  $scope.order.$loaded(() => {

    const productsIds = Object.keys($scope.order.purchases);

    productsIds.map(productId => {
      const productRef = firebase.database().ref("products").child(productId);
      $scope.orderedProducts[productId] = $firebaseObject(productRef);
      return;
    });

  });

  $scope.calculateTotal = () => {
    if($scope.order.purchases){
      // reduce over all purchases, using the keys.
      return Object.keys($scope.order.purchases).reduce((acc, key) => {
        // get the purchase by key.
        const purchase = $scope.order.purchases[key];
        const howMany = purchase.howMany;
        let price = 0;

        const productId = purchase.productId;

        if($scope.orderedProducts[productId]){
          price = $scope.orderedProducts[productId].price;
        }

        acc = acc + (howMany * price);
        return acc;
        
      }, 0);
    }else{
      return 0;
    }
  }
}
