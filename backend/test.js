const Shared = require("./shared.js");

///////////////////////////////////////////////
// Shared.loadPairsOfCategories("shopify")
// // .then(x => console.log(x))
// .catch(err => console.log("err: ", err));
///////////////////////////////////////////////

const SHOPNAME = "shopify"
Promise.all([
Shared.loadSettings(),
Shared.loadPairsOfCategories(SHOPNAME),
Shared.loadCustomProductsFromFirebase(SHOPNAME)
])
.then(result => {

  const settings = result[0];
  const pairsOfCategories = result[1];
  const customProducts = result[2] || {};
  console.log("customProducts: ", customProducts);
  const externalProductsIdsFromFirebase = Object.keys(customProducts).map(key =>  customProducts[key].externalProductId);

  pairsOfCategories.map(bothCats => {
    const externalCategoryId = bothCats.externalCategoryId;
    const customCategoryId = bothCats.customCategoryId;
    const promisedProducts = Shared.loadExternalProducts(SHOPNAME, settings, externalCategoryId)

    promisedProducts
      .then(externalProducts => {

        const externalProductsIdsFromShop = externalProducts.map(p => p.id);

        const removedExternalProducsIds = getRemovedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop);
        console.log("removedExternalProducsIds: ", removedExternalProducsIds );

        const createdExternalProductsIds = getCreatedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop);
        console.log("createdExternalProductsIds: ", createdExternalProductsIds );

        externalProducts.map(externalProduct => {
          const customProductData = Shared.convertFromExternalProductToCustomProductData(SHOPNAME, externalProduct);

          const maybe_corespondingCustomProduct = Object.keys(customProducts).reduce((acc, key) => {
            const externalProductIdInFirebase = customProducts[key].externalProductId;
            if(acc){
              // product was already found in a previous pass.
              return acc;
            }else if(externalProductIdInFirebase == customProductData.externalProductId){
              // product is found now, for the first time
              return customProducts[key];
            }else{
              // product was not found yet.
              return false;
            }
          }, false);

          const actionToBeTaken = Shared.detectWhatActionNeedsToBeTaken(
                      customProductData,
                      maybe_corespondingCustomProduct,
                      removedExternalProducsIds,
                      createdExternalProductsIds,
                    );

          console.log("actionToBeTaken: ", actionToBeTaken);
          if(actionToBeTaken.actionName == "create"){
            Shared.createProduct(customProductData, customCategoryId, SHOPNAME);
          }

          if(actionToBeTaken.actionName == "delete"){

          }

          if(actionToBeTaken.actionName == "update"){

          }

          if(actionToBeTaken.actionName == "do-nothing"){

          }

          // return void, this function is sideeefectrulf we are not intresteed in any data transformation here.
          // the sidefect is writing the right products in firebase
          return;
        })
      })
      .catch(err => console.log("error: ", err));
  })
})
.catch(err => console.log("error: ", err));

function getRemovedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop){
  // it means if a product in firebase but not in shop.. then that means is has been deleted.
  // if we map over firebnase .. and ask if the [p[roduct exists in shop.. if it doesnt..
  // then we add it to a special list.. the list of removed items.
  return externalProductsIdsFromFirebase.reduce((acc, firebaseId) => {
    if(firebaseId in externalProductsIdsFromShop){
      // has not been removed.
      return acc;
    }else{
      acc.push(firebaseId);
      return acc;
    }
  }, [])
}

function getCreatedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop){
  // if means that if an id is inside the shop .. .but not in firebase.. then this product has been created now.
  // is a new product.
  return externalProductsIdsFromShop.reduce((acc, shopProductId) => {
    if(shopProductId in externalProductsIdsFromFirebase){
      // has not been removed.
      return acc;
    }else{
      acc.push(shopProductId);
      return acc;
    }
  }, [])
}



function deleteProduct(){

}

function updateProduct(){

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

// // function loadExternalProducts(){
// // }
// //
// //













// --
