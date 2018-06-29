export default class RecentlyViewedProductsService {
  constructor(){
    this.products = {};
  }

  addProduct(product){
    this.products[product.$id] = product;
  }

  getLastProducts(){
    return this.products;
  }

}
