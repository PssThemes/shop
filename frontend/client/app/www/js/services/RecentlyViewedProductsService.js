export default class RecentlyViewedProductsService {

  constructor($firebaseObject){
    this.products = {};
    this.productIds = [];
    this.$firebaseObject = $firebaseObject;
  }
 
  addProduct(productId){
    console.log("productId: ", productId);
    if(this.productIds.indexOf(productId) == -1){

      this.productIds.push(productId);

      const productRef = firebase.database().ref("products").child(productId);
      this.products[productId] = this.$firebaseObject(productRef);
    }
  }


}
