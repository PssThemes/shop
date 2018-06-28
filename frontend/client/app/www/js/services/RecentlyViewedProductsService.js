export default class RecentlyViewedProductsService {
  constructor(){
    this.products = [];
  }

  addProduct(product){
    this.products.push(product);
  }

  getLastProducts(){
    return this.products;
  }

}
