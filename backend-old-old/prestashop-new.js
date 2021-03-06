
const Shared = require("./shared.js");
const request = require("request-promise-native");
/////////////////////////////////////////////
Shared.loadPairsOfCategories("shopify")
// .then(x => console.log(x))
.catch(err => console.log("err: ", err));
/////////////////////////////////////////////



const SHOPNAME = "prestashop"
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

  console.log("pairsOfCategories: ", pairsOfCategories);

  const promisedProducts = loadPrestashopProducts(settings.prestashop);

  promisedProducts
    .then(shopProducts => {

      const relevantProducts = shopProducts.filter(normalizedShopProduct => {
        const externalCatIds = normalizedShopProduct.categories.map(cat => cat.id);
        const asociatedCustomCatsIds = getAsociatedCatsIds(externalCatIds, pairsOfCategories);
        return asociatedCustomCatsIds != [];
      });

      const externalIdsOfRelevantProducts =  relevantProducts.map(x => x.externalProductId);

      // deletedProducts .. is customProducts - relevantProducts.

      const removedExternalProductsIds = getRemovedProductsIds(externalProductsIdsFromFirebase, externalIdsOfRelevantProducts);
      const createdExternalProductsIds = getCreatedProductsIds(externalProductsIdsFromFirebase, externalIdsOfRelevantProducts);
      const possiblyUpdatedExternalProductsIds = getUpdatedProductsIds(externalProductsIdsFromFirebase, removedExternalProductsIds, createdExternalProductsIds);

      console.log("removedExternalProductsIds: ", removedExternalProductsIds)
      console.log("createdExternalProductsIds: ", createdExternalProductsIds)
      console.log("possiblyUpdatedExternalProductsIds: ", possiblyUpdatedExternalProductsIds)



      // 1. was this product removed?
      removedExternalProductsIds.map(removedExternalProductId => {

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

        const normalizedProduct = relevantProducts.filter(normalizedProduct => normalizedProduct.externalProductId == createdExternalProductId)[0];

        console.log("normalizedProduct: ", normalizedProduct);
        const externalCatIds = normalizedProduct.categories.map(cat => cat.id);
        const customCategoriesIds = getAsociatedCatsIds(externalCatIds, pairsOfCategories);

        Shared.createProduct(normalizedProduct, customCategoriesIds, SHOPNAME);
        // const customProductData = Shared.convertFromExternalProductToCustomProductData(SHOPNAME, externalProduct);

        // return void since this is a sidefectful function.
        return;

      });


      // 3. was this product updated?

      // 3. update the ones that need updating.
      // check the difference between shop and firebase for a paricular product using a specialized equality function.
      possiblyUpdatedExternalProductsIds.map(updatedExternalProductId => {
        const normalizedProduct = relevantProducts.filter(normalizedProduct => normalizedProduct.externalProductId == updatedExternalProductId)[0];
        // const customProductData = Shared.convertFromExternalProductToCustomProductData(SHOPNAME, externalProduct);
        const maybe_firebaseProductId = Object.keys(customProducts).filter(productId => customProducts[productId].externalProductId == updatedExternalProductId)[0];

        // console.log("customProductData: ", customProductData);

        if(maybe_firebaseProductId){
          if(Shared.requiresUpdating(normalizedProduct, customProducts[maybe_firebaseProductId])){
            // TODO: fix this error here.. is an error with firebase not
            // beeing able to save # and other special chars...
            // where is it comming from?>??
            Shared.updateProduct(maybe_firebaseProductId, normalizedProduct);
          }
        }

      });

    })
    .catch(err => {
      console.log("error: ", err);
    });

})
.catch(err => console.log("error: ", err));

function getAsociatedCatsIds(externalCatIds, pairsOfCategories){
  return externalCatIds.reduce((acc, shop_externalCatId) => {

    const customCatsIdsAsociatedWithThisExternalCatId = pairsOfCategories.reduce((acc, pair) => {

      const firebase_externalCatId = both.externalCategoryId;
      const customCategoryId = both.customCategoryId;

      if(shop_externalCatId == firebase_externalCatId){

        acc.push(customCategoryId);
        return acc;

      }else{
        return acc;
      }

    }, []);

    acc = acc.concat(customCatsIdsAsociatedWithThisExternalCatId);

    return acc;

  }, []);
}


  // pairsOfCategories.map(bothCats => {
  //   const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
  //
  //
  //   const externalCategoryId = bothCats.externalCategoryId;
  //   const customCategoryId = bothCats.customCategoryId;
  // promisedProducts
  //   .then(externalProducts => {
  //
  //     const externalProductsIdsFromShop = externalProducts.map(p => p.id);
  //     console.log("externalProductsIdsFromShop: ", externalProductsIdsFromShop );
  //
  //
  //     const removedExternalProducsIds = getRemovedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop);
  //     const createdExternalProductsIds = getCreatedProductsIds(externalProductsIdsFromFirebase, externalProductsIdsFromShop);
  //     const possiblyUpdatedExternalProductsIds = getUpdatedProductsIds(externalProductsIdsFromFirebase, removedExternalProducsIds, createdExternalProductsIds);
  //
  //
  //
  //     console.log("removedExternalProducsIds: ", removedExternalProducsIds );
  //     console.log("createdExternalProductsIds: ", createdExternalProductsIds );
  //     console.log("possiblyUpdatedExternalProductsIds: ", possiblyUpdatedExternalProductsIds );
  //
  //
  //
  //     // 1. remove the deleted products form firenbase.
  //     removedExternalProducsIds.map(removedExternalProductId => {
  //
  //       const maybe_IdOfCustomProductToBeRemoved = Object.keys(customProducts).filter(key => customProducts[key].externalProductId == removedExternalProductId)[0];
  //       console.log("maybe_IdOfCustomProductToBeRemoved: ", maybe_IdOfCustomProductToBeRemoved);
  //
  //       if(maybe_IdOfCustomProductToBeRemoved){
  //         Shared.deleteProduct(maybe_IdOfCustomProductToBeRemoved);
  //       }
  //
  //       // return void since this is a sideefectful function.
  //       return;
  //     });
  //
  //
  //
  //     // 2. create new products for the created ones.
  //     createdExternalProductsIds.map(createdExternalProductId => {
  //       const externalProduct = externalProducts.filter(product => product.id == createdExternalProductId)[0];
  //       console.log("externalProduct: ", externalProduct);
  //       const customProductData = Shared.convertFromExternalProductToCustomProductData(SHOPNAME, externalProduct);
  //       Shared.createProduct(customProductData, customCategoryId, SHOPNAME);
  //
  //       // return void since this is a sideefectful function.
  //       return;
  //     });
  //
  //
  //
  //
  //     // 3. update the ones that need updating.
  //     // check the difference between shop and firebase for a paricular product using a specialized equality function.
  //     possiblyUpdatedExternalProductsIds.map(updatedExternalProductId => {
  //       const externalProduct = externalProducts.filter(product => product.id == updatedExternalProductId)[0];
  //       const customProductData = Shared.convertFromExternalProductToCustomProductData(SHOPNAME, externalProduct);
  //       const maybe_firebaseProductId = Object.keys(customProducts).filter(productId => customProducts[productId].externalProductId == updatedExternalProductId)[0];
  //
  //       // console.log("customProductData: ", customProductData);
  //
  //       if(maybe_firebaseProductId){
  //         if(Shared.requiresUpdating(customProductData, customProducts[maybe_firebaseProductId])){
  //           // TODO: fix this error here.. is an error with firebase not
  //           // beeing able to save # and other special chars...
  //           // where is it comming from?>??
  //           Shared.updateProduct(maybe_firebaseProductId, customProductData);
  //         }
  //       }
  //
  //     });
  //
  //   })
  //   .catch(err => console.log("error: ", err));
  // })

function loadExternalProductsFromPrestashop(prestashopSettings){

}


function Prestashop_getProducts(){
  const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?output_format=JSON';
  return request.get(targetUrl, {}).auth(apiPrestashopKey);
}

// Clarity.
// i need all prestashop products in one call.
// then usa a promise to get them since they are async.
// after we get the products from shopify.. we need to conver it to something
// we can use easy.. so a bunck of fields like name and stuff
// and we trow out the rest.



function loadPrestashopProducts(prestashopSettings){

  function getProduct(id){
    const targetUrl = `https://ecom.pssthemes.com/prestashop/api/products/${id}?output_format=JSON`;
    return request.get(targetUrl, {}).auth(prestashopSettings.apiKey)
  }

  return new Promise((resolve, reject) => {

    const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?output_format=JSON';

    request.get(targetUrl, {}).auth(prestashopSettings.apiKey)
      .then(result => {

        const products = JSON.parse(result).products;
        const allProductsAsPromised = products.map( productRef => {
          return getProduct(productRef.id);
        });

        return Promise.all(allProductsAsPromised);

      })
      .then(rawProducts => {

        const customProductsData = rawProducts.map(productStuff => {
          // const productWrapper = JSON.parse(productStuff).product;
          const rawProduct = JSON.parse(productStuff).product;
          return convertFromRawProductToNormalizedProduct(rawProduct);
        });

        resolve(customProductsData);

      })
      .catch(err => {
        reject(err);
      });
  });

}


function convertFromRawProductToNormalizedProduct(rawProduct){
  const categoriesOfThisProduct = rawProduct.associations.categories;
  const images = rawProduct.associations.images;

  const normalizedProductData = {

    externalProductId: rawProduct.id,
    name: rawProduct.name,

    categories: categoriesOfThisProduct,
    price: rawProduct.price,

    short_description: rawProduct.description_short,
    description: rawProduct.description || "",

    mainProductImage: rawProduct.mainProductImage || "",
    media: images,
  };

  return normalizedProductData;

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
  }, []);
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
  }, []);
}











// --
