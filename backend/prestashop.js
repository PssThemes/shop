// Import stuff from the shared module.
// all different cloud functions use this module.
const Shared = require("./shared.js");
const SHOPNAME = "prestashop";
const utils = require("./utils.js");

prestashop().then();

async function prestashop(){

  const settings = await Shared.loadSettings();
  const intenralCategories = await Shared.getInternalCategories(SHOPNAME);

  // all categoryIds that exist in firebase..
  const relevantExternalCatsIds = await Shared.getRelevantExternalCategoriesIds(SHOPNAME);
  // // prepare external products and asociated pieces we need for them.
  const allExternalProducts = await loadAllPrestashopProducts();

  const group = await groupExternalCategoriesAndExternalProducts(allExternalProducts);
  const externalProductsGroupedByCategory = group.externalProductsGroupedByCategory;
  const externalCategoriesGroupedByProduct = group.externalCategoriesGroupedByProduct;



  const relevantProductIdsSet = Shared.getRelevantProductIds(relevantExternalCatsIds, externalProductsGroupedByCategory);

  const relevantProducts = Object.keys(allExternalProducts).reduce((acc, key) => {

    const product = allExternalProducts[key];
    const productId = product.externalProductId;

    if(relevantProductIdsSet.has(productId)){
      acc[productId] = product;
      return acc;
    } else {
      return acc;
    }

  }, {});

  console.log("relevantProducts: ", relevantProducts);

}


async function groupExternalCategoriesAndExternalProducts(externalProducts) {
  // we get the external categories first.
  // const allCollects = await loadAllShopifyCollects();

  console.log(externalProducts);
  return Promise.resolve( { externalProductsGroupedByCategory : {}, externalCategoriesGroupedByProduct : {} });
  // const group = allCollects.reduce((acc, collect) => {
  //
  //   const productId = collect.product_id;
  //   const categoryId = collect.collection_id;
  //
  //   if(acc.externalProductsGroupedByCategory[categoryId]){
  //     acc.externalProductsGroupedByCategory[categoryId].push(productId);
  //   }else {
  //     acc.externalProductsGroupedByCategory[categoryId] = [];
  //     acc.externalProductsGroupedByCategory[categoryId].push(productId);
  //   }
  //
  //   if(acc.externalCategoriesGroupedByProduct[productId]){
  //     acc.externalCategoriesGroupedByProduct[productId].push(categoryId);
  //   }else {
  //     acc.externalCategoriesGroupedByProduct[productId] = [];
  //     acc.externalCategoriesGroupedByProduct[productId].push(categoryId);
  //   }
  //
  //   return acc;
  // }, { externalProductsGroupedByCategory : {}, externalCategoriesGroupedByProduct : {} });
  //
  // return group;
}

async function loadAllPrestashopProducts(){
  return {};
}
