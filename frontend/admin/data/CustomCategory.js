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
    this.linkedTo = linkedTo || {
      shopify: {
        categories: {}
      },
      magento: {
        categories: {}
      },
      woocommerce: {
        categories: {}
      }
    };
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

  addLinkToExternalCategory(shopName, externalCat) {
    // i expect the externalCat to be an object of typpe
    // { id: String
    // , name: String
    // }

    // // console.log(shopName, externalCat, this.linkedTo[shopName]);
    this.linkedTo[shopName].categories[externalCat.id] = externalCat;
  }

  removeLinkToExternalCategory(shopName, externalCat) {
    delete this.linkedTo[shopName].categories[externalCat.id];
  }

  categoryHasAlreadyBeenLinked(shopName, externalCat) {
    const itExists = this.linkedTo[shopName].categories[externalCat.id];
    if (itExists) {
      // This external category already added to the linking list.
      return true;
    } else {
      // was not aded.
      return false;
    }
  }
}