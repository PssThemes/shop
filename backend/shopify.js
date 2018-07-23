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
  const pairsOfIntenralAndExternalCateories =  result[1];
  const dictOfOneIntenralToManyExternalCategoriesIds = pairsOfIntenralAndExternalCateories.reduce((acc, pair) => {
    // if this is the first element.. then create a internalCategoryId key and assign [] such that we can have a .push() function.
    // if is not .. then use the existing value of the key..
    // push the extenralCategoryId into the
    // use the previous value.. or use an empty array such that we can have a .push() function on it
    // in case this is the first element
    acc[pair.internalCategoryId] = acc[pair.internalCategoryId]  || [];
    acc[pair.internalCategoryId].push(pair.externalCategoryId);
    return acc;

  }, {})
  const dictOfOneExternalToManyIntenralCategoriesIds = pairsOfIntenralAndExternalCateories.reduce(( acc, pair ) => {
    return acc[]
  })
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
    .then(allExternalProducts => {

      // relevant is about taking into consideration that not all products form the shop are included in our system.
      // we exclude them based on their asociated external categories..
      // by checking if at least 1 internal category is linked to any of this product external categories.

      const relevantExternalProducts = allExternalProducts.filter();
      const normalizedExternalProducts = relevantExternalProducts.map(normalizeShopifyProduct);
      const idsOfExternalProducts = normalizedExternalProducts.map(p => p.externalId);



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

function normalizeShopifyProduct(rawProduct){
  return "normalized product."
}
