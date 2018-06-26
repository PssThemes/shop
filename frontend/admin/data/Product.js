import Review from "./Review.js"

export default class Product {

  constructor(productData) {
    console.log("productData:  ", productData);
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

    const isHidden = (productData.isHidden.toString() == "true");

    this.id = productData.id;
    this.mainProductImage = productData.mainProductImage || "https://www.shelvingshopgroup.co.nz/wp-content/uploads/placeholder-image-1000x1000.png";
    this.name = productData.name || "no product name";
    this.short_description = productData.short_description || "";
    this.price = productData.price || 0;
    this.isHidden = isHidden;
    this.reviews = reviews;
    this.categoryId = productData.categoryId;
    this.media = productData.media || [];

    // TODO: add a way to access the long product description
    // this.long_descriptionId = url...;
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
      reviews: reviewsData,
      categoryId: this.categoryId,
      mainProductImage: this.mainProductImage,
      media: this.media,
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
