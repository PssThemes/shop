// console.log("DEV SCRIPT: load firebase..");

import CustomCategory from "../data/CustomCategory.js"
import Product from "../data/Product.js"
import Reply from "../data/Reply.js"
import Review from "../data/Review.js"
import UserProfile from "../data/UserProfile.js"


const db = firebase.database();
const categoriesRef = db.ref("/categories");

const productsRef = db.ref("/products");
const productRef = (id) => {
  return db.ref("/products/" + id);
}

const userProfileRef = (id) => {
  return db.ref("/users/" + id);
}

// create3FakeProducts()
// create3DummyUserProfiles()

function create3DummyUserProfiles(){
    const userProfile = createDummyUserProfile("jony macarony");
    userProfileRef(userProfile.uid).set(userProfile.getData());
}

function create3FakeProducts(){
  const p1 = createDummyProduct("Monitor");
  console.log("p1: ", p1)
  console.log("p1 data: ", p1.getData());
  productsRef.push(p1.getData());
}

function createDummyUserProfile(userName){
  return new UserProfile(
    { uid: "clientIdnoproblem"
    , name: userName
    , email: "jony@gmail.com"
    }
  )
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
