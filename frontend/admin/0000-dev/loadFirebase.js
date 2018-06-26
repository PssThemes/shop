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


const productsRef = db.ref("/products");
const productRef = (id) => {
  return db.ref("/products/" + id);
}

// create3FakeProducts();

function create3FakeProducts(){
  const p1 = createDummyProduct("Monitor");
  const p2 = createDummyProduct("Tastatura");
  const p3 = createDummyProduct("Mouse");
  productsRef.push(p1.getData());
  productsRef.push(p2.getData());
  productsRef.push(p3.getData());
}

function createDummyProduct(productName){
  const productData = {
    id: "productId..",
    mainProductImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=89e5fd826f8bdc563ab1743608690f39&auto=format&fit=crop&w=800&q=80",
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
    },
    categoryId: "-LFWaisUPF_XssTJE10r",
    media : [
      "https://images.unsplash.com/photo-1504670073073-6123e39e0754?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=23c233a430f2ca6be8d78f8608b416d5&auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/19/desktop.JPG?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60f9c32ab84b0de2266d6afca2fabf4c&auto=format&fit=crop&w=750&q=80",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1046925db0fb1f15417d71ad1676880&auto=format&fit=crop&w=1050&q=80"
    ]
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


const userProfileRef = (id) => {
  return db.ref("/users/" + id);
}
const usersProfilesRef = () => {
  return db.ref("/users");
}

create3DummyUserProfiles()

function create3DummyUserProfiles(){
  console.log("create3DummyUserProfiles..")
    const userProfile = createDummyUserProfile("jony macarony");
    // userProfileRef(userProfile.uid).set(userProfile.getData());
    usersProfilesRef().push(userProfile)
      .then(() => console.log);
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
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
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
      mainProductImage : null,
      price : 200,
      howMany : 1,
      attributes : []
    },
    {
      productId : "productId2",
      productName : "Tastatura",
      mainProductImage : null,
      price : 50,
      howMany : 3,
      attributes : []
    },
    {
      productId : "productId3",
      productName : "Mouse",
      mainProductImage : null,
      price : 50,
      howMany : 1,
      attributes : []
    },
  ]
  });

  return fakeOrder;
}
