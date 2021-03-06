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
db.ref("settings").once("value").then(snap => {
  const settings = snap.val();
  if(settings){
    ports.received_settings.send(settings)
  }
})
.catch(err => {
  console.log("error in loading settings: ", err);
});


// // Load internalCategories..
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

  }else if (categories == null) {

    ports.received_internalCategories.send([]);

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
db.ref("products").once("value").then(snap => {

  const products = snap.val();
  // console.log(":products:", products);
  if(products){
    const productsAsArray = transformObjectInArray(products);
    ports.received_InternalProducts.send(productsAsArray);
  } else if(products == null) {
    ports.received_InternalProducts.send([]);
  }
})
.catch(err => {
  console.log("error in loading InternalProducts: ", err);
});


// Extenral products..
const shopify = new Shopify({
  shopName: "aion-shop2.myshopify.com",
  apiKey: "f12fa0019654d4d1d30087e637b39bc5",
  password: "67b3ea756b30521c58027663af84a78c",
});

shopify.product.list()
  .then(result => {

    const products = result;

    if(products){

      console.log("____________________________________");
      ports.received_ExternalProducts.send(products);

    }else if (products == null){
      ports.received_ExternalProducts.send([]);
    }
  })
  .catch(err => {
    console.log("error in loading shopify products..: ", err);
  });


shopify.collect.list()
.then(result => {
  const collects = result;

  // console.log("collects: ", collects);

  if(collects){

    console.log("____________________________________");
    ports.received_Collects.send(collects);

  }else if (collects == null){
    ports.received_Collects.send([]);
  }
})
.catch(err => {
  console.log("error in loading shopify collects..: ", err);
});

////////////////////////////////////////////////////////////////////////////////////
// From Elm in js..
////////////////////////////////////////////////////////////////////////////////////

ports.saveToFirebase.subscribe(elmData => {

  // console.log("js elmData: ", elmData);
  console.log("js elmData: created - ", elmData.deleted); 

  elmData.created.map(product => {
    const pushKey = db.ref("products").push().key;
    product.selfId = pushKey;
    db.ref("products").child(pushKey).set(product);
  });

  elmData.deleted.map(pushKey => {
    db.ref("products").child(pushKey).set(null);
  })

});


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
