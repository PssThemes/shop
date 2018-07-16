const Shared = require("./shared.js");

// .then(settings => Shared.loadExternalProductsFromShopifyByCategory(settings.shopify))


const SHOPNAME = "shopify"

Promise.all([
Shared.loadSettings(),
Shared.loadExternalCategoriesIds(SHOPNAME),
Shared.loadCustomProductsFromFirebase(SHOPNAME)
])
.then(result => {

  const settings = result[0];
  const externalCatsIds = result[1];
  const customProducts = result[2];

  Shared.loadExternalProductsFromShopifyByCategory(settings.shopify)
})
.then(shopifyProducts => {
  console.log("shopifyProducts: ", shopifyProducts);
})
.catch(err => console.log("err: ", err));
