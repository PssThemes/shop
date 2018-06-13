export default class CustomCategory {
  constructor(id, name, products) {
    this.id = id;
    this.name = name;
    this.products = products;
    this.editMode = false;
    this.editName = "";
    this.linkedTo = [];
  }

  getId() {
    return this.id;
  }

  updateName(name) {
    this.name = name;
  }

  startEditName() {
    this.editMode = true;
  }

  stopEditName() {
    this.editMode = false;
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