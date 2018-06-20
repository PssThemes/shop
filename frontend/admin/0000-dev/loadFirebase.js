// console.log("DEV SCRIPT: load firebase..");

import CustomCategory from "../data/CustomCategory.js"
import Product from "../data/Product.js"
import Reply from "../data/Reply.js"
import Review from "../data/Review.js"
import UserProfile from "../data/UserProfile.js"
import { RECEIVED, Order } from "../data/Order.js"


const db = firebase.database();


// --------------------------------------------------------------
// Categories
// --------------------------------------------------------------

const categoriesRef = db.ref("/categories");



// --------------------------------------------------------------
// Product
// --------------------------------------------------------------

// create3FakeProducts();

const productsRef = db.ref("/products");
const productRef = (id) => {
  return db.ref("/products/" + id);
}

function create3FakeProducts(){
  const p1 = createDummyProduct("Monitor");
  console.log("p1: ", p1)
  console.log("p1 data: ", p1.getData());
  productsRef.push(p1.getData());
}

function createDummyProduct(productName){
  const productData = {
    id: "productId..",
    mainImageUrl: "img url here",
    name: productName || "Product Name",
    short_description: "short_description here",
    price: "123",
    isHidden: "true",
    reviews: {
      "reviewId|1111": {
        id: "reviewId|1111",
        value : 0,
        message : "Review msg",
        clientId : "clientIdnoproblem",
        replies : {
          "replyId|9999" : {
            who : "admin",
            text : "How do you enjoy it?"
          },
          "replyId|8888" : {
            who : "client",
            text : "Is good thanks."
          }
        },
      }
    }
  };
  return new Product(productData);
}


// --------------------------------------------------------------
// Settings
// --------------------------------------------------------------


// createSettings();


function createSettings(){
  db.ref("settings").set(
    { shopify: {
        configured: false,
        sync: true
      },
      magento: {
        configured: false,
        sync: true
      },
      woocomerce: {
        configured: false,
        sync: true
      }
    }
  )
}


// --------------------------------------------------------------
// User Profiles
// --------------------------------------------------------------


// create3DummyUserProfiles()

const userProfileRef = (id) => {
  return db.ref("/users/" + id);
}


function create3DummyUserProfiles(){
    const userProfile = createDummyUserProfile("jony macarony");
    userProfileRef(userProfile.uid).set(userProfile.getData());
}

function createDummyUserProfile(userName){
  const fakeUserAddress = {
    street: "5 May",
    more: "Aleea infundata",
    city: "Timisoara",
    county: "Timis",
    postalCode: "732888",
  };

  const fakeUserProfile = new UserProfile({
    uid : "user profile id",
    name :  userName,
    email :  "joncastron@gmail.com",
    address :  fakeUserAddress,
    phone : "07928034923",
    isBlocked : false,
  });

  return new UserProfile(fakeUserProfile);
}



// --------------------------------------------------------------
// Orders
// --------------------------------------------------------------

const ordersRef = () => {
  return db.ref("/orders");
}

// loadFakeOrder();

function loadFakeOrder(){
  const ford = createFakeOrder();
  ordersRef().push(ford);
}

function createFakeOrder(){

  const fakeOrder = new Order({
    id: "orderId111",
    date: "17 may 2019",
    orderStatus: RECEIVED,
    userProfileId: "user profile id.",
    purchases: [{
      productId : "productId1",
      productName : "Monitor",
      productImage : null,
      price : 200,
      howMany : 1,
      attributes : []
    },
    {
      productId : "productId2",
      productName : "Tastatura",
      productImage : null,
      price : 50,
      howMany : 3,
      attributes : []
    },
    {
      productId : "productId3",
      productName : "Mouse",
      productImage : null,
      price : 50,
      howMany : 1,
      attributes : []
    },
  ]
  });

  return fakeOrder;
}
