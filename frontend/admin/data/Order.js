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

    const purchases = [];

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
      date: this.date;
      purchases: this.purchases.map(purchase => {
        return purchase.getData();
      }),
      orderStatus: this.orderStatus,
      userProfileId: this.userProfileId
    }
  }

  switchOrderStatus(){
    if(this.orderStatus == RECEIVED){
      this.orderStatus == PROCESSED;
    }

    if(this.orderStatus == PROCESSED){
      this.orderStatus == DELIVERED;
    }

    if(this.orderStatus == DELIVERED){
      this.orderStatus == RECEIVED;
    }
  }

}

export class Purchase (){
  constructor(purchaseData){

    if(purchaseData.attributes && !Array.isArray(purchaseData.attributes)){
      throw new Error ("Purchase attributes must be an array.");
    }

    this.productId = purchaseData.productId;
    this.productName = purchaseData.productName;

    // adding a default dummy image here to not distory the layout if the image is not present.
    this.productImage = purchaseData.productImage || "http://www.whitevilla.co.uk/img/missing_product.png";
    this.howMany = purchaseData.howMany;
    this.attributes = purchaseData.attributes || [];
  }
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
