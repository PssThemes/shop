const firebase = require("firebase");
const Shopify = require('shopify-api-node');

const config = {
  apiKey: "AIzaSyBHFgL85LAezq8GV-MIqDvBz53g4LSrk1I",
  authDomain: "shop-0000.firebaseapp.com",
  databaseURL: "https://shop-0000.firebaseio.com",
  projectId: "shop-0000",
  storageBucket: "shop-0000.appspot.com",
  messagingSenderId: "809051870205"
};

firebase.initializeApp(config);
const db = firebase.database();


function isValidShopName(shopName){
  return shopName == "shopify"
  || shopName == "woocomerce"
  || shopName == "prestashop"
}

exports.loadSettings = () => {
   return new Promise((resolve, reject) => {

     db.ref("settings").once("value").then(snap => {
       const settings = snap.val();
       if(settings){
         resolve(settings);
       }else{
         reject("some crappy reason, no settings: ", settings)
       }
     })
     .catch(err => reject(`loading settings from firebase failed, reason: `, err));

   });
}

exports.loadPairsOfCategories = (shopName) => {
  return new Promise((resolve, reject) => {

    if(!isValidShopName(shopName)){
      // NOTE: is important that the shopName to match what we have in firebase.
      reject("invalid shop name: ", shopName);
      return;
    }

    // first get the custom categories
    db.ref("categories").once("value")
    .then(snap => {
      // we got the custom categories
      const categories = snap.val();

      if(categories){
        const categoriesIds = Object.keys(categories);

        // given we have custom categories.. get the external categories asociated with the shopName.
        // im appling a map reduce here to ghater all of them in a list..
        // all external categories ids (which are basically the real shopify/magento/woocomerce categories/collections..)
        // here we got the external categoires.
        const externalCatIds =
          categoriesIds
            .map(catId => {
                // NOTE: one category object looks like this:

                // categoryPushKey: {
                //   linkedTO: {
                //     shopify : {
                //       categories : {
                //         externalCatId : {
                //             externalCatId : externalCatId,
                //             name : "External Cat Name"
                //           }
                //         },
                //       },
                //     },
                //     woocomerce: {},
                //     prestashop: {},
                //     name: "categoryName"
                // }

                const cats = ((categories[catId].linkedTo || {})[shopName] || {}).categories;
                if(cats){
                  return { catId: catId, externalCatsIds: Object.keys(cats) };
                }else{
                  return false;
                }
            })
            .reduce((acc, maybeCats) => {
              if(maybeCats){
                const pairs = maybeCats.externalCatsIds.map(extCatId => {
                  return { customCategoryId: maybeCats.catId, externalCategoryId: extCatId }
                });

                acc = acc.concat(pairs);
                return acc;
              }else{
                return acc;
              }
            }, []);

          if(externalCatIds){
            // TODO: add more checks here since who knows what crappy value we get back.
            resolve(externalCatIds);

          }else{
            reject(`externalCatIds are empty or something: `, externalCatIds);
          }

      }else{
        reject(`categories are empty or something: `, categories);
      }
    })

    // failed to load custom categories that we need to extract the external ones.
    .catch(error => {
      reject(`Failed to load custom categories.. error is:  `, error);
    })

  });
}

exports.loadCustomProductsFromFirebase = (shopName) => {

  // NOTE: custom products is returned as an object indexed by push keys.

  return new Promise((resolve, reject) => {

    // NOTE: this loads only the products asociated with a particular shop.
    const query = db.ref("products")
    .orderByChild("shopName")
    .equalTo(shopName)

    query.once("value").then(snap => {
      const customProducts = snap.val();
      if(customProducts){
        resolve(customProducts);
      }else{
        // new Error(`seems like custom products is actually empty: ${customProducts}`)
        resolve({});
      }
    })
    .catch(err => {
      reject(new Error(`failed to load custom products for shop: ${shopName}, with error: ${err}`));
    });

  });
}


exports.loadExternalProducts = (shopName, settings, categoryId) => {

    if(shopName == "shopify"){
      return loadExternalProductsFromShopifyByCategory(settings.shopify, categoryId);
    }

    if(shopName == "woocomerce"){
      // TODO: build the woocomerce function here
      // return Shared.loadExternalProductsFromW(settings.shopify);
      return Promise.resolve("not implemented")
    }

    if(shopName == "prestashop"){
      // TODO: build the prestashop function here
      // return Shared.loadExternalProductsFromShopifyByCategory(settings.shopify);
      return Promise.resolve("not implemented")
      // loadExternalProductsFromPrestashop(, categoryId);
    }
}


function loadExternalProductsFromPrestashop(){
  return new Promise((resolve, reject) => {

    resolve();

  });
}


exports.convertFromExternalProductToCustomProductData = (shopName, externalProduct) => {
  if(shopName == "shopify"){
    return convertShopifyProductToCustomProductData(externalProduct);
  }

  if(shopName == "woocomerce"){
    return convertWoocomerceProductToCustomProductData(externalProduct);
  }

  if(shopName == "prestashop"){
    return convertPrestashopProductToCustomProductData(externalProduct);
  }
}

function convertShopifyProductToCustomProductData(externalProduct){
  // NOTE: here we just get the data tyhat we are interesteed in
  // from the external product.
  // this is like an interface..
  // this fields below will be merged in firebase..
  // this is how we dont override the custom data that we have there during and update.
  // but if we create stuff.. of course we gonna use this to build the new product.
  // alsto the decription here i think is better if we put it in another place in the databasse..
  // not inside the products.. since is loaded only on the product page itself.
  if(externalProduct){

    return {
      externalProductId: externalProduct.id,
      mainProductImage:  (externalProduct.image || {}).src || "",
      media: externalProduct.images.map(img => {
        return img.src
      }),
      name: externalProduct.title,
      price: externalProduct.variants[0].price || 0,
      description: externalProduct.body_html
    }

  }
}

function convertWoocomerceProductToCustomProductData(){

}

function convertPrestashopProductToCustomProductData(){

}


exports.detectWhatActionNeedsToBeTaken = (
  customProductData,
  maybe_corespondingCustomProduct,
  removedExternalProducsIds,
  createdExternalProductsIds
) => {

  if(!customProductData){
    console.log(new Error(`customProductData is falsy:  ${customProductData}`));
    return;
  }

  if(!removedExternalProducsIds){
    console.log(new Error(`removedExternalProducsIds is falsy: ${removedExternalProducsIds}`));
    return;
  }

  if(!createdExternalProductsIds){
    console.log(new Error(`createdExternalProductsIds is falsy: ${createdExternalProductsIds}`, ));
    return;
  }

  const externalProductIdInShop = customProductData.externalProductId;
  //
  // console.log("createdExternalProductsIds: ", createdExternalProductsIds);
  // console.log("externalProductIdInShop: ", externalProductIdInShop );
  //
  if(removedExternalProducsIds.includes(externalProductIdInShop)){
    // product has been removed
    if(maybe_corespondingCustomProduct){
      // TODO: make sure you adde the id property on each product using the push method upfront.
      return { actionName: "delete", selfId: maybe_corespondingCustomProduct.selfId }
    }else{
      // this is supposed to be an imposible state ?!!
      return { actionName: "do-nothing" }
    }
  }else if(createdExternalProductsIds.includes(externalProductIdInShop)){
    // product has been created.
    return { actionName: "create" }
  }else{

    // product is updated.
    // but first we need to detect if the uppdate needs to happen.
    const productChanged = compareProducts(customProductData, maybe_corespondingCustomProduct);
    if(productChanged){
      // update
      return { actionName: "update" }
    }
    else{
      // do nothing.
      return { actionName: "do-nothing" }
    }
  }
};


exports.requiresUpdating = (customProductDataFromShop, customProductFromFirebase ) => {
  return true;
}

exports.createProduct = (customProductData, customCategoryId, shopName) => {
  const key = db.ref().child("products").push().key;
  const productRef = db.ref().child("products").child(key);

  const product = {
    selfId: key,
    categorId: customCategoryId,
    externalProductId : customProductData.externalProductId,
    isHidden: false,
    mainProductImage:  customProductData.mainProductImage,
    // media: customProductData.media,
    name: customProductData.name,
    price: customProductData.price,
    short_description: customProductData.description.substring(0,200),
    shopName: shopName,
    howManyTimesWasOrdered : 0,
  }

  // TODO: create the long description too .
  productRef.set(product);
}

exports.deleteProduct = (productId) => {
  db.ref("products").child(productId).set(null);

  // TODO: delete the product description too.
}

exports.updateProduct = (productId, customProductData) => {
  console.log("customProductData.name: ", productId, customProductData.name);
  const fieldsToUpdate = {
    name: customProductData.name,
    short_description : customProductData.short_description || "",
    mainProductImage: customProductData.mainProductImage,
    media: customProductData.media || [],
    price: customProductData.price,
  }

  // TODO: update the long description too if something changed.

  db.ref("products").child(productId).update(fieldsToUpdate);
}
// return {
//   externalProductId: externalProduct.id,
//   mainProductImage:  (externalProduct.image || {}).src || "",
//   media: externalProduct.images.map(img => {
//     return img.src
//   }),
//   name: externalProduct.title,
//   price: externalProduct.variants[0].price || 0,
//   description: externalProduct.body_html
// }


// exports.detectWhatActionNeedsToBeTaken = (customProductData, customProducts) => {
//   if(!customProductData){
//     console.log("customProductData is not the right value: ", customProductData );
//     return;
//   }
//
//   if(!customProducts){
//     console.log("customProducts is falsy instead of beeing an empty or filled array. : ", customProducts );
//     return;
//   }
//
//   // first detect if we have a product with this externalProductId inside out custom products.
//   const externalProductIdInFirebase = customProducts[key].externalProductId;
//   const externalProductIdInShopify = customProductData.externalProductId;
//
//   function detectIfAlreadyExistsInFirebase(){
//     Object.keys(customProducts).reduce((acc, key) => {
//       if(acc == true){
//         // this product was already detected as existing by a previous pass
//         // ove the array ..  move on do nothing.
//         return true;
//       }else if(externalProductIdInFirebase == externalProductIdInShopify){
//         // this is the first pass we find that this product already exists in firebase.
//         return true;
//       }else{
//         // product was not found before.. and not in this pass..
//         // move further by saying the product does not exist i9n firebase. (false)
//         return false;
//       }
//     }, false);
//   }
//
//   const alreadyExists = detectIfAlreadyExistsInFirebase();
//
//   if(!alreadyExists){
//     // means needs to be created.
//   }
//
//   if(alreadyExists){
//     // maybe needs to be updated.
//   }
//
//   // cant detect who was deleted here..
//   // so in order to detect what action needs to be taken.. i need 3 things.
//   // 1. list of extenral ids present in firebase.
//   // 2. list of list of external ids coming form the shop.
//   // // in case of update..
//   // 3. the shop product..
//   // 4. the coresponding firebase custom product..
//   // this is used to detect if needs to be updated.
//
//
//   // so we can create a list of productsIds that need to be removed.
//   // another list of product ids that need to be created.
//   // if not create or remove.. then means update.
//   // here, in this step, we decide if the product needs to be updated or not
//
// };








// --
