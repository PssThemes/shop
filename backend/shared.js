const firebase = require("firebase");

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
    // NOTE: this loads only the products asociated with a particular shop.

}
