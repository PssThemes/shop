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

exports.loadExternalCategoriesIds = (shopName) => {
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
                  return Object.keys(cats);
                }else{
                  return false;
                }
            })
            .reduce((acc, x) => {
              acc = acc.concat(x);
              return acc;
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
      reject(`Failed to load custom categories.. categories is:  `, categories);
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
        reject("seems like custom products is actually empty: ", customProducts);
      }
    })
    .catch(err => {
      reject("failed to load custom products for shop: ", shopName);
    });

  });
}

exports.loadExternalProductsFromShopifyByCategory = (shopifySettings, categoryId) => {
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
