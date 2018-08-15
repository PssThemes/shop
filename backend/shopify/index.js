const ElmShopify = require("./Shopify.js");
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


const elmApp = ElmShopify.Shopify.worker();
const ports = elmApp.ports;

ports.start.send(null);

ports.finish.subscribe(() => {
  console.log("finish... ");
});


// // Load settings..
// db.ref("settings").once("value").then(snap => {
//   const settings = snap.val();
//   if(settings){
//     ports.received_settings.send(settings)
//   }
// })
// .catch(err => {
//   console.log("error in loading settings: ", err);
// });


// Load internalCategories..
db.ref("categories").once("value").then(snap => {
  const categories = snap.val();
  if(categories){
    let categoriesAsArray = [];

    Object.keys(categories).map(key => {

      const firebaseCat = categories[key];

      const cat = {};

      cat.shopify = transformObjectInArray(firebaseCat.shopify);
      cat.prestashop = transformObjectInArray(firebaseCat.prestashop);
      cat.selfId = firebaseCat.selfId;
      cat.name = firebaseCat.name;

      categoriesAsArray.push(cat);

    });

    ports.received_internalCategories.send(categoriesAsArray);

  }
})
.catch(err => {
  console.log("error in loading internalCategories: ", err);
});

function transformObjectInArray(obj){
  const array = [];
  Object.keys(obj).map(key => {
    array.push(obj[key]);
  });
  return array;
}

// // Load InternalProducts..
// db.ref("products").once("value").then(snap => {
//   const products = snap.val();
//   if(products){
//     ports.received_InternalProducts.send(products);
//   }
// })
// .catch(err => {
//   console.log("error in loading InternalProducts: ", err);
// });


// // Extenral products..
// const shopify = new Shopify({
//   shopName: "aion-shop1.myshopify.com",
//   apiKey: "6899818a3b21c823434c02a71605067b",
//   password: "fc0f0ed27ec9a3448eeddc871151f290",
// });
//
// shopify.product.list()
//   .then(result => {
//     products = result;
//     if(products){
//       // console.log("proudctus: ", products[0].images);
//       console.log("____________________________________");
//       ports.received_ExternalProducts.send(products);
//     }
//   })
//   .catch(err => {
//     console.log("error in loading shopify products..: ", err);
//   });

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// async function loadSettings(){
//
//   let snap;
//   try{
//     snap = await ;
//   }catch(err){
//     console.log(new Error(`clould not load firebase settings for reason: ${err}`));
//   }
//   return snap.val();
// }
//
//

// function makeShopifyInstance(){
//   const Shopify = require('shopify-api-node');
//   const shopify = new Shopify({
//     shopName: "aion-shop.myshopify.com",
//     apiKey: "646fbee50103355217533c95aad3520d",
//     password: "0f4b837596ecfa3b700ef1fd975efec0",
//   });
//   return shopify;
// }

// const express = require("express");
// const app = express();
//
//
// app.get("/", (req, res) => {
//
//   const elmApp = ElmShopify.Shopify.worker();
//   const ports = elmApp.ports;
//
//   ports.start.send(null);
//
//   ports.finish.subscribe(() => {
//     res.send("ok da da ");
//   });
//
// });
//
//
// app.listen(3000, () =>  {
//   console.log("listening on port 8080");
// });
