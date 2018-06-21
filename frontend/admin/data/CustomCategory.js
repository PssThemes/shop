// const shopifyCats = (( { shopify: { categories: { name:"da" } } } || {}).shopify || {}).categories;


// console.log("shopifyCats", shopifyCats);

export default class CustomCategory {
  // constructor(id, name, products, linkedTo) {
  constructor(catData) {
    if (catData.id) {
      this.id = catData.id;
    } else {
      throw new Error("When creating a customCategory, you provided a invalid id: " +  catData.id);
    }

    // Note: this is a way of accessing nested null/undefined props on an object
    // firebase has this way of deleting deeply nested structs if they contain no data.

    const shopifyCats = ((((catData || {}).linkedTo || {}).shopify || {}).categories);
    const magentoCats = ((((catData || {}).linkedTo || {}).magento || {}).categories);
    const woocommerceCats = ((((catData || {}).linkedTo || {}).woocommerce || {}).categories);


    const linkedTo = {
      shopify: {
        categories: shopifyCats || {}
      },
      magento: {
        categories: magentoCats || {}
      },
      woocommerce: {
        categories: woocommerceCats || {}
      }
    };

    this.name = catData.name || "no name :| ";
    this.products = catData.products || [];
    this.linkedTo = linkedTo;
  }

  updateName(newName) {
    // TODO: ensure is not empty..
    this.name = newName;
  }

  getData() {
    return {
      name: this.name,
      products: this.products,
      linkedTo: this.linkedTo
    }
  }

  addLinkToExternalCategory(shopName, externalCat) {
    // i expect the externalCat to be an object of typpe
    // { externalCatId: String
    // , name: String
    // }

    // // console.log(shopName, externalCat, this.linkedTo[shopName]);
    this.linkedTo[shopName].categories[externalCat.externalCatId] = externalCat;
  }

  removeLinkToExternalCategory(shopName, externalCat) {
    delete this.linkedTo[shopName].categories[externalCat.externalCatId];
  }

  categoryHasAlreadyBeenLinked(shopName, externalCat) {
    const itExists = this.linkedTo[shopName].categories[externalCat.externalCatId];

    if (itExists) {
      // This external category already added to the linking list.
      return true;
    } else {
      // was not aded.
      return false;
    }
  }
}
