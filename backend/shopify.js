

const SHOPNAME = "shopify";









// 1.
// Load the api key and secret from the firebase database.
// I need shop name. apikey  and password.
// const shopify = new Shopify({
//   shopName: 'shop-dop.myshopify.com',
//   apiKey: '5a0e2ee78ef4cf8195d8b09ab4008b09',
//   password: '1d5b877b681052373a8b375c0ff6ccc2'
// });



// 2.
// build the shopify instance.

// 3.
// read all categories from firebase.. find the one wich have a link to shopify.
// llok inside categories.. and extract all external categories ids.

// 4.
// get this this list of external categories ids.. for each one.. ask shpofiy api to get the products.
// at this stage the products are just what we have in shoopify.


// 5.
// merge the firebase database info with the new product info we have from shopify.

// 6.
// if the product is created for the first time then add a categorid .. real one.. intenral one to it.
// plus other things like is hidden and so on.


const firebase = require('firebase');

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

db.ref("settings").child("shopify").once("value")
.then(snap => {
  // we goit the settings from firebase.
  const shopifySettings = snap.val();

  // get the categories also.
  db.ref("categories").once("value")
  .then(snap => {
    // we got the custom categories
    const categories = snap.val();
    const categoriesIds = Object.keys(categories);

    // given custom categories.. get the external categories just for shjopify.
    // im appling a map reduce here to ghater up in a list..
    // all external categories ids (which are basically the real shopify categories/collections..)
    // here we got the external categoires.
    const externalCatIds =
      categoriesIds
        .map(catId => {
            const cats = ((categories[catId].linkedTo || {}).shopify || {}).categories;
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

    // for each external category..  grab all products from shopify.. and put them in firebase..
    // is a merge action.. so only certain fields get overriden.. the other custom ones like is this product hidden or not they dont.

    // for this to work... i need to detect if a product is already in our firebase.. or is not.
    // if it is.. we need an update action.. which means i need to find its key.
    // else.. i need to create a new one with default options.. like productIsHidden is false.

    // this means.. somnehow i need a mapping. a mapping from my own internal product ids .. which are firebase push keys .. to the external product ids.
    // i need a functiuon which is async which answers to question.. does this this product already exists in our firebase database?

    // this allows me to keep the custom data intact.
    // i can put it in a special dict .. lets call it a mapper..  which is all about detecting if a product exists already or not.

    // this also mean i need to remove this once the product is not longer in shopify..
    // this means each time this cloud function runns.. i need to take out the products that have been deleted from shopify.
    // we are not using hooks.. so i need to implement this mechanism of removing propducts, manually.
    // what i need is a function that takes in all shopify product ids and compare that with all the shpoify product ids we had before running this function.
    // or said in anothe way, i need to compare the current state - the product ids we currently have in database.. with the new ids aded..
    // and this is how we can detect which ones have been removed.

    // same process but backwards works for the newly created products.

    // so 3 different actions: update, create and remove.
    // each of them requires their own logic.
    // the process starts by detecing for each product.. what type of action need to perform on it.
    // not sure if is better to do multiple writes.. or batch them in a transaction.
    // logically .. since the product is a single logical isolated unit.. it must be true that we need to inact this update write or remove.. at the product level,
    // im gonna worry about firebase costs later. right now im not even sure if you can do it in any other way.. since this logic of detecting when to remove update or create is quite complex.
    // requires multiple async checks.. so you cant do it for all products at once.



    // console.log("categoriesIds", categoriesIds);
    console.log("externalCatIds: ", externalCatIds);
  })
  .catch(error => {
    console.log("error: ", error);
  })

})
.catch(error => {
  console.log("error: ", error);
});

// function concat(x,y){
//   return x.concat(y);
// }
//
// function flatMap
//
//







//
