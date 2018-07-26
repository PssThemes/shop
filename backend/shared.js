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

async function createFirebaseProduct(){

}

async function updateFirebaseProduct(){

}

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



module.exports.loadSettings = loadSettings;
module.exports.getRelevantExternalCategoriesIds = getRelevantExternalCategoriesIds;

module.exports.loadInternalProducts = loadInternalProducts;
module.exports.getInternalCategories = getInternalCategories;

module.exports.extractAsociatedInternalCategories = extractAsociatedInternalCategories;

module.exports.removeFirebaseProduct = removeFirebaseProduct;
module.exports.createFirebaseProduct = createFirebaseProduct;
module.exports.updateFirebaseProduct = updateFirebaseProduct;
