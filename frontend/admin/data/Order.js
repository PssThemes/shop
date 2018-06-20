export const RECEIVED = "RECEIVED";
export const PROCESSED = "PROCESSED";
export const DELIVERED = "DELIVERED";

export class Order {

  constructor(orderData){

    if(!orderData.id){
      throw new Error(`Error when creating an Order obj. OrderId was not provided, it is:  ${orderData.id}`);
    }

    if(!orderData.userProfileId){
      throw new Error(`Error when creating an Order obj. order UserProfileId was not provided, it is:  ${orderData.userProfileId}`);
    }

    if(!orderData.date){
      throw new Error(`Error when creating an Order obj. Order date was not provided, it is:  ${orderData.date}`);
    }

    let purchases = [];

    if(orderData.purchases && Array.isArray(orderData.purchases)){
      purchases = orderData.purchases.map(puchaseData => {
        return new Purchase(puchaseData);
      });
    }

    this.id = orderData.id;
    this.date = orderData.date;
    this.purchases = purchases;
    this.orderStatus = orderData.orderStatus || RECEIVED;
    this.userProfileId = orderData.userProfileId;
  }

  getData() {
    return {
      date: this.date,
      purchases: this.purchases.map(purchase => {
        return purchase.getData();
      }),
      orderStatus: this.orderStatus,
      userProfileId: this.userProfileId
    }
  }

  switchOrderStatus(){
    if(this.orderStatus == DELIVERED){
      this.orderStatus = RECEIVED;
    }

    else if(this.orderStatus == PROCESSED){
      this.orderStatus = DELIVERED;
    }

    else if(this.orderStatus == RECEIVED){
      this.orderStatus = PROCESSED;
    }

  }

  getTotalPrice(){
    return this.purchases.reduce((acc, purchase) => {
      return acc + (purchase.price * purchase.howMany);
    }, 0);
  }

  getActionName(){
    if(this.orderStatus == RECEIVED){
      return "this order has been processed"
    }

    if(this.orderStatus == PROCESSED){
      return "this order has been delivered"
    }

    if(this.orderStatus == DELIVERED){
      return "restart"
    }
  }
}

export class Purchase {

  constructor(purchaseData){

    if(purchaseData.attributes && !Array.isArray(purchaseData.attributes)){
      throw new Error("Purchase attributes must be an array.");
    }

    if(!purchaseData.productId || !isString(purchaseData.productId)){
      throw new Error(`every purchase requires a product id, which is a string. The productId is: ${purchaseData.productId}`);
    }

    this.productId = purchaseData.productId;
    this.productName = purchaseData.productName || "no product name";

    // adding a default dummy image here to not distory the layout if the image is not present.
    this.productImage = purchaseData.productImage || "http://www.whitevilla.co.uk/img/missing_product.png";

    this.price = purchaseData.price || 0;
    this.howMany = purchaseData.howMany || 0;
    this.attributes = purchaseData.attributes || [];
  }

  getData(){
    return {
      productId : this.productId,
      productName : this.productName,
      productImage : this.productImage,
      price : this.price,
      howMany : this.howMany,
      attributes : this.attributes
    }
  }


}

function isString (obj) {
  return (Object.prototype.toString.call(obj) === '[object String]');
}

// #### Order
// ```
// { id : String
// , date: Date
// , purchases : List Purchase
// , orderStatus : OrderStatus
// , userProfileId : UID
// }
// ```
//
// #### OrderStatus
// ```
// OrderStatus = Received | Processed | Delivered
// ```
//
// #### Purchase
// ```
// { productId: ProductId
// , productName : String
// , productImage: String
// , howMany: Int
// , attributes : List String?? this will be problematic.
// }
// ```
