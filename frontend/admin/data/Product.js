export default class Product {

  constructor(id, name, short_description, price, isHidden, reviews) {
    if (!id || id == "") {
      throw new Error("invalid Product id: ", id);
    }

    this.id = id;
    this.name = name || "no product name";
    this.short_description = short_description || "";
    this.price = price || 0;
    this.isHidden = isHidden || false;
    this.reviews = reviews || {};
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
}