import Review from "./Review.js"

export default class Product {

  constructor(productData) {
    if(!productData){
      throw new Error("invalid value for Product constructor: ", productData );
    }

    if (!productData.id || productData.id == "") {
      throw new Error("invalid Product id: ", productData.id);
    }

    let reviews = {};

    if(productData.reviews){
      reviews = Object.keys(productData.reviews).reduce((acc, key) => {
        const reviewData = productData.reviews[key];
        reviewData.id = key;

        acc[key] = new Review(reviewData);
        return acc;
      }, {});
    }
    const isHidden = (productData.isHidden == "true");

    this.id = productData.id;
    this.mainImageUrl = productData.mainImageUrl || "/assets/imgs/no-product.png";
    this.name = productData.name || "no product name";
    this.short_description = productData.short_description || "";
    this.price = productData.price || 0;
    this.isHidden = isHidden;
    this.reviews = reviews;
    // this.long_descriptionId = url...;

    // TODO: add prodcut category..
  }

  getData() {

    const reviewsData =
      Object.keys(this.reviews).map(key => {
        return this.reviews[key].getData();
      });

    return {
      name: this.name,
      short_description: this.short_description,
      price: this.price,
      isHidden: this.isHidden,
      reviews: reviewsData
    }
  }

  calculateTotalRating(){
    const reviews = this.reviews;
    return Object.keys(reviews).reduce((acc, key) => {
      acc = acc + reviews[key].value;
      return acc;
    }, 0);
  }

  getNrOfReviews(){
    const reviews = this.reviews;
    return Object.keys(reviews).reduce((acc, key) => {
      acc = acc + 1;
      return acc;
    }, 0);
  }

  toggleProductVisiblity(){
    this.isHidden =  ! this.isHidden;
  }

  getClientsIds(){
    return Object.keys(this.reviews).map(key => {
      return this.reviews[key].clientId;
    });
  }
}
