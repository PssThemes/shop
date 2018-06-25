export default class Product {

  constructor (productData){

    if(!productData.id){
      throw new Error (`could not create new Product since it has no productId, id is: ${productData.id}`);
    }

    this.id = productData.id;
    this.name = productData.name || "no product name";
    this.short_description = productData.short_description || "";
    this.price = productData.price || 0;
    this.mainProductImage = productData.mainProductImage || "https://www.shelvingshopgroup.co.nz/wp-content/uploads/placeholder-image-1000x1000.png";
  }

}
