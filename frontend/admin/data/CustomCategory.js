export default class CustomCategory {
  constructor(id, name, products) {
    this.id = id;
    this.name = name || "no name?";
    this.products = products || [];
    this.linkedTo = [];
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