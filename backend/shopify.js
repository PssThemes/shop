// Import stuff from the shared module.
// all different cloud functions use this module.
const Shared = require("./shared.js");
const SHOPNAME = "shopify";
const utils = require("./utils.js");


shopify().then();
async function shopify(){

  // settings object contains apiKey and secrets for accesing the shops.
  const settings = await Shared.loadSettings();
  const intenralCategories = await Shared.getInternalCategories(SHOPNAME);

  const relevantExternalCatsIds = await Shared.getRelevantExternalCategoriesIds(SHOPNAME);

  // // prepare external products and asociated pieces we need for them.
  const group = await groupExternalCategoriesAndExternalProducts();
  const externalProductsGroupedByCategory = group.externalProductsGroupedByCategory;
  const externalCategoriesGroupedByProduct = group.externalCategoriesGroupedByProduct;

  const allExternalProducts = await loadAllShopifyProducts();

  // console.log("allExternalProducts: ", allExternalProducts);

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


  // get internal products and asociated functionality.
  const internalProducts = await Shared.loadInternalProducts(SHOPNAME);

  // Compare between firebase and shop.
  // 2 lists of externalproductsids.
  const externalProductsIdsFromFirebaseSet = new Set(Object.keys(internalProducts).map(key => internalProducts[key].externalProductId));
  const externalProductsIdsFromShopSet = relevantProductIdsSet;

  // console.log("externalProductsIdsFromFirebaseSet: ", externalProductsIdsFromFirebaseSet);
  // console.log("externalProductsIdsFromShopSet: ", externalProductsIdsFromShopSet);

  // Deleted products.
  // removed products are the ones we have in firebase .. but we dont have in shop.
  // from a cs perspective this is a disgioint between 2 sets... FirebaseSet - ShopSet
  const deletedSet = utils.setDifference(externalProductsIdsFromFirebaseSet, externalProductsIdsFromShopSet);

  // Created Products products.
  // created products are the ones we have in shop .. but we dont have them in firebase yet .
  // meaning is a disgioint between ShopSet - FirebaseSet;
  const createdSet = utils.setDifference(externalProductsIdsFromShopSet, externalProductsIdsFromFirebaseSet);

  const createdOrDeletedSet = utils.setUnion(deletedSet, createdSet);

  const updatedProductsSet = utils.setDifference(externalProductsIdsFromShopSet, createdOrDeletedSet);

  // console.log("deletedSet: ", deletedSet );
  // console.log("createdSet: ", createdSet );
  // console.log("createdOrDeletedSet: ", createdOrDeletedSet );
  // console.log("updatedProductsSet: ", updatedProductsSet );


  // remove deleted products..
  Array.from(deletedSet).map(externalProductId => {

    // console.log("internalProducts: ", internalProducts);
    const internalProductId = Shared.getInternalProductIdFor(externalProductId, internalProducts);

    if(internalProductId){
      Shared.removeFirebaseProduct(internalProductId);
    }
  });


  // create products.. externalProductId
  Array.from(createdSet).map(id => {
    const productData = allExternalProducts.filter(product => product.externalProductId == id)[0];

    const externalCatIds = externalCategoriesGroupedByProduct[id];
    const internalCategoriesIds = Shared.extractAsociatedInternalCategories(SHOPNAME, externalCatIds, intenralCategories);

    Shared.createFirebaseProduct(SHOPNAME, productData, externalCatIds, internalCategoriesIds);

  });


  // update products..
  Array.from(updatedProductsSet).map(extenralProductId => {

    const newProductData = allExternalProducts.filter(product => product.externalProductId == extenralProductId)[0];
    const externalCatIds = externalCategoriesGroupedByProduct[extenralProductId];
    const internalCategoriesIds = Shared.extractAsociatedInternalCategories(SHOPNAME, externalCatIds, intenralCategories);

    const internalProductId = getAsociatedProductId(extenralProductId, internalProducts);

    if(internalProductId){
      const existingProduct = internalProducts[internalProductId];
      Shared.updateFirebaseProduct(newProductData, externalCatIds, internalCategoriesIds, existingProduct);
    }

  });





}

function getAsociatedProductId(extenralId, internalProducts){
  // given an external product id.. it finds inside the internalProducts object.. the
  // the specific internalProductId asociated with this externalProductId.
  const productId = Object.keys(internalProducts).filter(key => {
    return internalProducts[key].externalProductId == extenralId
  })[0];

  if(productId){
    return productId;
  }else{
    return false;
  }

}





async function groupExternalCategoriesAndExternalProducts() {
  const allCollects = await loadAllShopifyCollects();
  const group = allCollects.reduce((acc, collect) => {

    const productId = collect.product_id;
    const categoryId = collect.collection_id;

    if(acc.externalProductsGroupedByCategory[categoryId]){
      acc.externalProductsGroupedByCategory[categoryId].push(productId);
    }else {
      acc.externalProductsGroupedByCategory[categoryId] = [];
      acc.externalProductsGroupedByCategory[categoryId].push(productId);
    }

    if(acc.externalCategoriesGroupedByProduct[productId]){
      acc.externalCategoriesGroupedByProduct[productId].push(categoryId);
    }else {
      acc.externalCategoriesGroupedByProduct[productId] = [];
      acc.externalCategoriesGroupedByProduct[productId].push(categoryId);
    }

    return acc;
  }, { externalProductsGroupedByCategory : {}, externalCategoriesGroupedByProduct : {} });

  return group;
}

async function loadAllShopifyCollects(){
  const shopify = makeShopifyInstance();
  const collects = await shopify.collect.list();
  return collects;
}


function makeShopifyInstance(){
  const Shopify = require('shopify-api-node');
  const shopify = new Shopify({
    shopName: "aion-shop.myshopify.com",
    apiKey: "646fbee50103355217533c95aad3520d",
    password: "0f4b837596ecfa3b700ef1fd975efec0",
  });
  return shopify;
}


async function loadAllShopifyProducts(){
  const shopify = makeShopifyInstance();

  let allProducts;

  try {
    allProducts = await shopify.product.list();
  }catch(err){
    console.log("Error when loading shopify products:")
    console.log(err);
  }

  if(allProducts){
    return allProducts.map(rawProduct => {

      const media = rawProduct.images.map(img => {
        return img.src;
      });

      const normalizedProductData = {
        externalProductId: rawProduct.id + '',
        name: rawProduct.title || "",
        mainProductImage: (rawProduct.image || {}).src || "",
        price: rawProduct.variants[0].price || 0,
        description: rawProduct.body_html || "",
        media: media,
      };

      return normalizedProductData;
    });
  }

  return;
}

// return {
//         mainProductImage:  (product.image || {}).src || "",
//         media: product.images.map(img => {
//           return img.src
//         }),
//         name: product.title,
//         price: product.variants[0].price || 0,
//         description: product.body_html
//       }

  // the entire settings object that holds api keys secrets and other stuff to access all shops.


  // type:  List { customCategoryId: String , externalCategoryId: String }


  // in firebase products share a common interface, no matter form what shop they come from.
  // we call that interface and custom data asociated with it an intenral product.
  // const internalProducts = result[2] || {};

  // load all externalProducts from shopify..



  // // type: Dict IntenralCatId (List ExternalCatId)
  // const dictOfOneIntenralToManyExternalCategoriesIds = pairsOfIntenralAndExternalCateories.reduce(( acc, pair ) => {
  //
  //   // initally the accumulator is empty.
  //   // first time we create the key value pair.. the key will not exist. this is why we set [] on the key..
  //   // because after doing that, we receive a .push() function on that array.
  //   // we use this array to push the externalCategoryId into it.
  //   // second and next times.. we just push the id into that array as expected.
  //   if(acc[pair.internalCategoryId]){
  //     acc[pair.internalCategoryId].push(pair.externalCategoryId);
  //   }else{
  //     acc[pair.internalCategoryId] = [];
  //     acc[pair.internalCategoryId].push(pair.externalCategoryId);
  //   }
  //
  //   return acc;
  //
  // }, {});
  //
  //
  // // type: Dict ExternalCatId (List IntenralCatId)
  // const dictOfOneExternalToManyIntenralCategoriesIds = pairsOfIntenralAndExternalCateories.reduce(( acc, pair ) => {
  //   if(acc[pair.externalCategoryId]){
  //     acc[pair.externalCategoryId].push(pair.internalCategoryId);
  //   }else {
  //     acc[pair.externalCategoryId] = [];
  //     acc[pair.externalCategoryId].push(pair.internalCategoryId);
  //   }
  //
  //   return acc;
  //
  // }, {});


  // for each intenral product, we keep its external id.
  // this is a list of all extenralProductId s.
  // we use it to detect what products have been deleted, removed or updated.
//   const externalIdsOfInternalProducts = Object.keys(internalProducts).map(key =>  internalProducts[key].externalProductId);
//
//
//   // deciding if a product is relevan.. using the categories is done like this.
//   // if the product has at least 1 external category.. which is linked to a custom category.
//   // so instead of relevant products we actually have relevant external categoryes.
//
//   const relevantExternalCategoriesIds =
//   const allAxternalCategoriesIdsForProduct =  await getAllExternalCategoriesIndexedByProductId();
//   const
//
//   // relevant is about taking into consideration that not all products form the shop are included in our system.
//   // we exclude them based on their asociated external categories..
//   // by checking if at least 1 internal category is linked to any of this product external categories.
//   const relevantExternalProducts = allExternalProducts.filter(externalProduct );
//   const normalizedExternalProducts = relevantExternalProducts.map(normalizeShopifyProduct);
//   const idsOfExternalProducts = normalizedExternalProducts.map(p => p.externalId);
//
//   promisedExternalProducts
//     .then( => {
//
//       // collections ids.
//       // externalCategoriesIdsIndexedByExternalProductId =
//
//
//
//
//
//
//     })
//     .catch(error => {
//       console.log(new Error(`loading initial stuff failed: ${error}`));
//     });
//   // extract all externalIdsOfExternalProducts.
//
//   // based on the differences between this 2 list of ids.. detect which products have been deleted, removed or updated.
//
// })
// .catch(error => {
//   console.log(new Error(`loading initial stuff failed: ${error}`));
// });


// async function getAllExternalCategoriesIndexedByProductId(){
//
//     // TODO: implement error handling with catch try..
//
//     const allCollects = await shopify.collect.list();
//     const externalCollectionsIds = allCollects.reduce((acc, collect) => {
//       // check if this product id already exists as a key.
//       // if it does, then just push the
//       if(acc[collect.product_id]){
//         acc[collect.product_id].push(collect.collection_id);
//       }else{
//         acc[collect.product_id] = [];
//         acc[collect.product_id].push(collect.collection_id);
//       }
//
//       return acc;
//     }, {});
//
//     return externalCollectionsIds;
//
// }




// function normalizeShopifyProduct(rawProduct){
//   return "normalized product."
// }
//
// async function getShopifyCollectionsForSpecificProduct(productId){
//   // get all collects for this product usingL:
//   // Retrieve only collects for a certain product
//   // GET /admin/collects.json?product_id=632910392 .
//   // then..
//   // extract by transformation all the categories ids.
//   // dedupe the categories ids list just in case.
//   return [];
// }
