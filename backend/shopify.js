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
  const shopifySettings = snap.val();

  db.ref("categories").once("value")
  .then(snap => {
    const categories = snap.val();
    const categoriesIds = Object.keys(categories);

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
          console.log("acc: ", acc, x);
          acc = acc.push(x)
          return acc;
        }, []);


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
