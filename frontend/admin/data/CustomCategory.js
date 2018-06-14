export default class CustomCategory {
  constructor(id, name, products, linkedTo) {
    if (id) {
      this.id = id;
    } else {
      console.log(new Error("When creating a customCategory, you provided a invalid id: "), id);
      this.id = "-1";
    }
    this.name = name || "no name?";
    this.products = products || [];
    this.linkedTo = linkedTo || [];
  }

  updateName(newName) {
    this.name = newName;
  }


  getData() {
    return {
      id: this.id,
      name: this.name,
      products: this.products,
      linkedTo: this.linkedTo
    }
  }

  linkExternalCategory(extenralCat) {
    // i expect the extenralCat to be an object of typpe
    // { id: String
    // , name: String
    // , origin: String
    // }
    this.linkedTo.push(externalCat);
  }
}