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



async function loadSettings(){
  let snap;
  try{
    snap = await db.ref("settings").once("value");
  }catch(err){
    console.log(new Error(`clould not load firebase settings for reason: ${err}`));
  }
  return snap.val();
}



async function getInternalCategories(){
  let snap;
  try{
    snap = await db.ref("categories").once("value");
  }catch(err){
    console.log(new Error(`clould not load firebase categories for reason: ${err}`));
  }
  return snap.val();
}



async function getRelevantExternalCategoriesIds(shopName){
  if(!shopName){
    return new Error(`no shop name was provides: ${shopName}`);
  }
  // Note relevant means.. every external category that we asociated with at least 1 custom category that the admin created.
  // the shops can have many other external categories.. but is not worth accounting for them if no asociation has been made.
  // since relevant means.. categories that have been asociated.

  // simplified, this means all externalCatId that exist in firebase.

  const firebaseCategories = await getInternalCategories();
  const externalCatsIds = Object.keys(firebaseCategories).reduce((acc, pushKey) => {

    const externalCats = (((firebaseCategories[pushKey] || {}).linkedTo || {})[shopName] || {}).categories;

    if(externalCats){
      acc = acc.concat(Object.keys(externalCats));
      return acc;
    }else{
      return acc;
    }

  }, []);

  // deduplicate entries by making it set.. then convert back to an array again.
  const deduped = Array.from(new Set(externalCatsIds));
  return deduped;
}

async function loadInternalProducts(shopName){
  const query = db.ref("products")
    .orderByChild("shopName")
    .equalTo(shopName);

  let snap
  try{
    snap = await query.once("value");
  }catch(err){
    return new Error(`could not load products for shop: ${shopName} because of reason: ${err}`);
  }

  return snap.val() || {};
}

async function removeFirebaseProduct(productId){
  let result;
  if(productId){
    result = await db.ref("products").child(productId).set(null);
  }
  return result;
}


async function createFirebaseProduct(shopName, productData, externalCatsIds, internalCatsIds){
  const key = db.ref().child("products").push().key;
  const productRef = db.ref().child("products").child(key);

  const internalCategoriesIdsAsObj = internalCatsIds.reduce((acc, id) => {
    acc[id] = id + "";
    return acc;
  }, {});

  const externalCategoriesIdsAsObj = externalCatsIds.reduce((acc, id) => {
    acc[id] = id + "";
    return acc;
  }, {});

  // console.log("productData: ", productData);
  const externalProductId = productData.externalProductId;

  const product = {
    selfId: key,
    internalCategoriesIds: internalCategoriesIdsAsObj,
    externalCategoriesIds: externalCategoriesIdsAsObj,
    externalProductId: externalProductId,
    isHidden: false,
    mainProductImage:  productData.mainProductImage,
    media: productData.media,
    name: productData.name,
    price: productData.price,
    short_description: productData.description.substring(0,200),
    shopName: shopName,
    howManyTimesWasOrdered : 0,
  };

  // TODO: create the long description too .
  // console.log("product: ", product);
  productRef.set(product);

}

function getInternalProductIdFor(externalProductId, internalProducts){

  const internalProductIds = Object.keys(internalProducts).filter(internalProductId => {
    const product = internalProducts[internalProductId];
    const result =  product.externalProductId + "" == externalProductId + "";
    return result;
  });

  externalProductId = internalProductIds[0];
  console.log("externalProductId: ", externalProductId);

  if(externalProductId){
    return externalProductId;
  } else {
    return false;
  }

}



async function updateFirebaseProduct(newProductData, externalCategoriesIds, internalCategoriesIds, existingProduct){
  const short_description = newProductData.description.substring(0,200);

  // console.log("internalCategoriesIds: ", internalCategoriesIds)
  // console.log("existingProduct.internalCategoriesIds: ", existingProduct.internalCategoriesIds)
  function requiresUpdating(){
    // console.log("newProductData.media: ", Array.from(newProductData.media).length);

    const newMedia = newProductData.media || [];
    const existingMedia = existingProduct.media || [];

    externalCategoriesIds = externalCategoriesIds.map(id => id + "");

    const areTheSame =
      arraysEqual(internalCategoriesIds,(Object.keys(existingProduct.internalCategoriesIds) || []))
      && arraysEqual(externalCategoriesIds, (Object.keys(existingProduct.externalCategoriesIds) || []))
      && newProductData.name == existingProduct.name
      && arraysEqual(newMedia, existingMedia)
      && newProductData.price == existingProduct.price
      && short_description == existingProduct.short_description;
    // console.log("areTheSame: ", areTheSame);
    return areTheSame ? false : true;

  }

  // console.log("requiresUpdating: ", requiresUpdating());

  const internalCategoriesIdsAsObj = internalCategoriesIds.reduce((acc, id) => {
    acc[id] = id + "";
    return acc;
  }, {});

  const externalCategoriesIdsAsObj = externalCategoriesIds.reduce((acc, id) => {
    acc[id] = id + "";
    return acc;
  }, {});

  const doesRequireUpdating = requiresUpdating();

  if(doesRequireUpdating){
    // console.log("it does requre updating.. ");

    const newData = {
      internalCategoriesIds: internalCategoriesIdsAsObj || {},
      externalCategoriesIds: externalCategoriesIdsAsObj || {},
      mainProductImage: newProductData.mainProductImage || "",
      name: newProductData.name || "",
      media: newProductData.media || [],
      price: newProductData.price || 0.0,
      short_description: short_description,
      // short_description: newProductData.short_description || ""
    };

    db.ref("products").child(existingProduct.selfId).update(newData);
  }

}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

// const product = {
//   selfId: key,
//   internalCategoriesIds: internalCategoriesIdsAsObj,
//   externalCategoriesIds: externalCategoriesIdsAsObj,
//   externalProductId: externalProductId,
//   isHidden: false,
//   mainProductImage:  productData.mainProductImage,
//   media: productData.media,
//   name: productData.name,
//   price: productData.price,
//   short_description: productData.description.substring(0,200),
//   shopName: shopName,
//   howManyTimesWasOrdered : 0,
// };

function extractAsociatedInternalCategories(shopName, externalCategoriesIds, internalCategories){

  const internalCategoriesIdsSet = externalCategoriesIds.reduce((acc, externalCatId) => {

    const internalCatIds = extractIntenralCategoriesFor(shopName, externalCatId, internalCategories);

    internalCatIds.map(id => acc.add(id));

    return acc;
  }, new Set([]));

  return Array.from(internalCategoriesIdsSet);
}


function extractIntenralCategoriesFor(shopName, externalCatId, internalCategories){
  // NOTE: using object keys here pretty much gives us the ids directly

  // this converts externalCatId to a string..
  externalCatId = externalCatId + ''

  return Object.keys(internalCategories).filter(internalCatId => {
    const cat = internalCategories[internalCatId];
    const externalCats =  (((cat || {}).linkedTo || {})[shopName] || {}).categories;

    if(externalCats){

      const externalCatsIds = Object.keys(externalCats);
      const asociationExists = externalCatsIds.includes(externalCatId);
      return asociationExists;

    }else{

      return false;

    }

  });

}

function getRelevantProductIds(relevantExternalCatsIds, externalProductsGroupedByCategory){

  const relevantProductIds = relevantExternalCatsIds.reduce((accSet, catId) => {
    const productsIds = externalProductsGroupedByCategory[catId];

    if(productsIds){
      productsIds.map(id => accSet.add(id + ""));
      return accSet;
    }else{
      return accSet;
    }
    // we use a set because it removes duplicates by default.
    // we can have the guarantee that the product ids are not duplicated.
  }, new Set([]));

  return relevantProductIds;
}


module.exports.loadSettings = loadSettings;
module.exports.getRelevantExternalCategoriesIds = getRelevantExternalCategoriesIds;

module.exports.loadInternalProducts = loadInternalProducts;
module.exports.getInternalCategories = getInternalCategories;

module.exports.extractAsociatedInternalCategories = extractAsociatedInternalCategories;
module.exports.getInternalProductIdFor = getInternalProductIdFor;

module.exports.removeFirebaseProduct = removeFirebaseProduct;
module.exports.createFirebaseProduct = createFirebaseProduct;
module.exports.updateFirebaseProduct = updateFirebaseProduct;



module.exports.getRelevantProductIds = getRelevantProductIds;
