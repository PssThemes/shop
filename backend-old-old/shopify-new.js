
const Shared = require("./shared.js");

/////////////////////////////////////////////
Shared.loadPairsOfCategories("shopify")
// .then(x => console.log(x))
.catch(err => console.log("err: ", err));
/////////////////////////////////////////////



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
  const externalProductsIdsFromFirebase = Object.keys(customProducts).map(key =>  customProducts[key].externalProductId);

  console.log("externalProductsIdsFromFirebase: ", externalProductsIdsFromFirebase);


  pairsOfCategories.map(bothCats => {

    const externalCategoryId = bothCats.externalCategoryId;
    const customCategoryId = bothCats.customCategoryId;
    const promisedProducts = loadExternalProductsFromShopifyByCategory(settings, externalCategoryId)

    promisedProducts
      .then(externalProducts => {

        const externalProductsIdsFromShop = externalProducts.map(p => p.id);
        console.log("externalProductsIdsFromShop: ", externalProductsIdsFromShop );

// 
        const removedExternalProducsIds = getRemovedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop);
        const createdExternalProductsIds = getCreatedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop);
        const possiblyUpdatedExternalProductsIds = getUpdatedProductsIds(externalProductsIdsFromFirebase, removedExternalProducsIds, createdExternalProductsIds);



        console.log("removedExternalProducsIds: ", removedExternalProducsIds );
        console.log("createdExternalProductsIds: ", createdExternalProductsIds );
        console.log("possiblyUpdatedExternalProductsIds: ", possiblyUpdatedExternalProductsIds );



        // 1. remove the deleted products form firenbase.
        removedExternalProducsIds.map(removedExternalProductId => {

          const maybe_IdOfCustomProductToBeRemoved = Object.keys(customProducts).filter(key => customProducts[key].externalProductId == removedExternalProductId)[0];
          console.log("maybe_IdOfCustomProductToBeRemoved: ", maybe_IdOfCustomProductToBeRemoved);

          if(maybe_IdOfCustomProductToBeRemoved){
            Shared.deleteProduct(maybe_IdOfCustomProductToBeRemoved);
          }

          // return void since this is a sideefectful function.
          return;
        });



        // 2. create new products for the created ones.
        createdExternalProductsIds.map(createdExternalProductId => {
          const externalProduct = externalProducts.filter(product => product.id == createdExternalProductId)[0];
          console.log("externalProduct: ", externalProduct);
          const customProductData = Shared.convertFromExternalProductToCustomProductData(SHOPNAME, externalProduct);
          Shared.createProduct(customProductData, customCategoryId, SHOPNAME);

          // return void since this is a sideefectful function.
          return;
        });




        // 3. update the ones that need updating.
        // check the difference between shop and firebase for a paricular product using a specialized equality function.
        possiblyUpdatedExternalProductsIds.map(updatedExternalProductId => {
          const externalProduct = externalProducts.filter(product => product.id == updatedExternalProductId)[0];
          const customProductData = Shared.convertFromExternalProductToCustomProductData(SHOPNAME, externalProduct);
          const maybe_firebaseProductId = Object.keys(customProducts).filter(productId => customProducts[productId].externalProductId == updatedExternalProductId)[0];

          // console.log("customProductData: ", customProductData);

          if(maybe_firebaseProductId){
            if(Shared.requiresUpdating(customProductData, customProducts[maybe_firebaseProductId])){
              // TODO: fix this error here.. is an error with firebase not
              // beeing able to save # and other special chars...
              // where is it comming from?>??
              Shared.updateProduct(maybe_firebaseProductId, customProductData);
            }
          }

        });

      })
      .catch(err => console.log("error: ", err));
  })
})
.catch(err => console.log("error: ", err));

function loadExternalProductsFromShopifyByCategory(shopifySettings, categoryId){
  let shopify = null;
  return new Promise((resolve, reject) => {
    if(!categoryId){
      reject(`you forgot to include the categoryId: ${categoryId}`, );
      return ;
    }

    if(!shopifySettings){
      reject(`you forgot to include the shopifySettings: ${shopifySettings}`, );
      return;
    }

    const Shopify = require('shopify-api-node');
    shopify = new Shopify({
      shopName: shopifySettings.shopName ,
      apiKey: shopifySettings.apiKey,

      // TODO: rename it to password as in shopify docs to not create confusions.
      password: shopifySettings.apiSecret,
    });

    getProductsIdsForCategory()
      .then(productsIds => getProducts(productsIds))
      .then(products => {
        resolve(products);
      })
      .catch(errors => {
        reject({ message: `errors when loading the products.`, errors: errors });
      });

  });

  // functions below are hoisted so no closure problem here.
  // first get the product ids
  function getProductsIdsForCategory(){
    return new Promise((resolve, reject) => {
      // NOTE: based on this: https://stackoverflow.com/questions/24228734/how-to-retrieve-all-products-from-a-smart-collection-through-shopify-api
      // is required to get the product using the collect.. and not directly from the category.
      shopify.collect.list({ collection_id : categoryId })
        .then(collects => {
          const productIds = collects.map(collect  => {
            return collect.product_id;
          })
          resolve(productIds);
        })
        .catch(error => {
          reject(error);
        });

    });
  }

  // then using the products ids get the products themselfs..
  // shopify does not havea  way to load many products at once..
  // we use promise.all to load each one individually.
  // TODO: think of a better way here since if 1 product gives an error everything fails.
  // and thats quite dumb.
  function getProducts(productsIds){
    const allProductsAsPromised = productsIds.map(productId => {
      return shopify.product.get(productId);
    });
    return Promise.all(allProductsAsPromised);
  }

}

function getRemovedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop){
  // it means if a product in firebase but not in shop.. then that means is has been deleted.
  // if we map over firebnase .. and ask if the [p[roduct exists in shop.. if it doesnt..
  // then we add it to a special list.. the list of removed items.
  return externalProductsIdsFromFirebase.reduce((acc, firebaseId) => {
    if(externalProductsIdsFromShop.includes(firebaseId)){
      // has not been removed.
      return acc;
    }else{
      acc.push(firebaseId);
      return acc;
    }
  }, [])
}

function getUpdatedProductsIds(allIds, removedIds, createdIds){
  // NOTE: this idea here is that if an id present in allIds is not removed or created.. it means is updated.
  return allIds.filter(id => {
    if(removedIds.includes(id)){
      // means that this id was removed. is clearly not updated then.. so return false .. meaning trow it out.
      return false;
    }else if (createdIds.includes(id)){
      // means that this id was created just now.
      return false;
    }else {
      return true;
    }
  });
}


function getCreatedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop){
  // if means that if an id is inside the shop .. .but not in firebase.. then this product has been created now.
  // is a new product.
  return externalProductsIdsFromShop.reduce((acc, shopProductId) => {
    if(externalProductsIdsFromFirebase.includes(shopProductId)){
      // has not been removed.
      return acc;
    }else{
      acc.push(shopProductId);
      return acc;
    }
  }, [])
}











// --
