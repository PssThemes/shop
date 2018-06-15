export default class Product {

  constructor(id, mainImageUrl, name, short_description, price, isHidden, reviews) {
    if (!id || id == "") {
      throw new Error("invalid Product id: ", id);
    }

    this.id = id;
    this.mainImageUrl = mainImageUrl || "no image";
    this.name = name || "no product name";
    this.short_description = short_description || "";
    this.price = price || 0;
    this.isHidden = isHidden || false;
    this.reviews = reviews || {};
    // TODO: add prodcut category..
  }

  getData() {
    return {
      name: this.name,
      short_description: this.short_description,
      price: this.price,
      isHidden: this.isHidden,
      reviews: this.reviews
    }
  }

  calculateTotalRating(){
    const reviews = this.reviews;
    return Object.keys(reviews).reduce((acc, key) => {
      const review = reviews[key].value;
      acc = acc + review.value;
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
}
