// Import stuff from the shared module.
// all different cloud functions use this module.
const Shared = require("./shared.js");
const SHOPNAME = "shopify"

Promise.all([
Shared.loadSettings(),
Shared.loadPairsOfCategories(SHOPNAME),
Shared.loadCustomProductsFromFirebase(SHOPNAME)
])
.then(result => {

  // the entire settings object that holds api keys secrets and other stuff to access all shops.
  const settings = result[0];

  // dictionary of { customCategoryId: String , externalCategoryId: String }
  const mappingsBetweenInternalAndExternalCategories = result[1];

  // in firebase products share a common interface, no matter form what shop they come from.
  // we call that interface and custom data asociated with it an intenral product.
  const internalProducts = result[2] || {};

  // for each intenral product, we keep its external id.
  // this is a list of all extenralProductId s.
  // we use it to detect what products have been deleted, removed or updated.
  const externalIdsOfInternalProducts = Object.keys(internalProducts).map(key =>  internalProducts[key].externalProductId);

  // load all externalProducts from shopify..
  const promisedExternalProducts = loadAllShopifyProducts(settings);
  promisedExternalProducts
    .then(externalProducts => {

    })
    .catch(error => {
      console.log(new Error(`loading initial stuff failed: ${error}`));
    });
  // extract all externalIdsOfExternalProducts.

  // based on the differences between this 2 list of ids.. detect which products have been deleted, removed or updated.

})
.catch(error => {
  console.log(new Error(`loading initial stuff failed: ${error}`));
});


function loadAllShopifyProducts(){
  return new Promise((resolve, reject) => {
    resolve("some crap");
  });
}
