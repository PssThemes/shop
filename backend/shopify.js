// Import stuff from the shared module.
// all different cloud functions use this module.
const Shared = require("./shared.js");
const SHOPNAME = "shopify"
const uitls = require("./utils.js");


shopify().then();
async function shopify(){

  // settings object contains apiKey and secrets for accesing the shops.
  const settings = await Shared.loadSettings();
  const relevantExternalCatsIds = await Shared.getRelevantExternalCategoriesIds(SHOPNAME);

  // // prepare external products and asociated pieces we need for them.
  const group = await groupExternalCategoriesAndExternalProducts();
  const externalProductsGroupedByCategory = group.externalProductsGroupedByCategory;
  const externalCategoriesGroupedByProduct = group.externalCategoriesGroupedByProduct;

  const allExternalProducts = await loadAllShopifyProducts();

  const relevantProductIdsSet = getRelevantProductIds(relevantExternalCatsIds, externalProductsGroupedByCategory);

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


  // Deleted products.
  // removed products are the ones we have in firebase .. but we dont have in shop.
  // from a cs perspective this is a disgioint between 2 sets... FirebaseSet - ShopSet
  const deletedSet = uitls.setDifference(externalProductsIdsFromFirebaseSet, externalProductsIdsFromShopSet);

  // Created Products products.
  // created products are the ones we have in shop .. but we dont have them in firebase yet .
  // meaning is a disgioint between ShopSet - FirebaseSet;
  const createdSet = uitls.setDifference(externalProductsIdsFromShopSet, externalProductsIdsFromFirebaseSet);

  const createdOrDeletedSet = utils.setUnion(removedProductsSet, createdProductsSet);

  const updatedProductsSet = uitls.setDifference(externalProductsIdsFromShopSet, createdOrDeletedSet);

  console.log("deletedSet: ", deletedSet );
  console.log("createdSet: ", createdSet );
  console.log("createdOrDeletedSet: ", createdOrDeletedSet );
  console.log("updatedProductsSet: ", updatedProductsSet );

}

function getRelevantProductIds(relevantExternalCatsIds, externalProductsGroupedByCategory){

  const relevantProductIds = relevantExternalCatsIds.reduce((accSet, catId) => {
    const productsIds = externalProductsGroupedByCategory[catId];

    if(productsIds){
      productsIds.map(id => accSet.add(id));
      return accSet;
    }else{
      return accSet;
    }
    // we use a set because it removes duplicates by default.
    // we can have the guarantee that the product ids are not duplicated.
  }, new Set([]));

  return relevantProductIds;
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
    shopName: "shop-dop.myshopify.com",
    apiKey: "5a0e2ee78ef4cf8195d8b09ab4008b09",
    password: "1d5b877b681052373a8b375c0ff6ccc2",
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
        externalProductId: rawProduct.id,
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
