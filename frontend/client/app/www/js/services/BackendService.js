import Category from "../data/Category.js"
import Product from "../data/Product.js"



const db = firebase.database();

const categoriesRef = db.ref("/categories");
const oneCategoryRef = (id) => {
  db.ref("/categories/" + id);
}

const productsRef = db.ref("/products");
const oneProductRef = (id) => {
  db.ref("/products/" + id);
}

export default class BackendService {
  constructor(){

  }
  // #region Categories

  onCategoryAdded(observer){
    categoriesRef.on("child_added", snap => {
      observer(makeCategory(snap));
    });
  }

  getCategory(id){
    return new Promise((resolve, reject) => {
      oneCategoryRef(id).once("value")
        .then(snap => {
          resolve(makeCategory(snap));
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // #endregion Categories


  // #region Quering Products


  // Get first x products from a category:
  getFirstXProductsOfACategory(categoryId, x){

    return new Promise((resolve,reject) => {
      const qRef = productsRef
        .orderByChild("categoryId")
        .equalTo(categoryId)
        .limitToFirst(x);

      qRef.once("value")
        .then(snap => {
          resolve(makeProductsList(snap));
        })
        .catch(err => {
          reject(err);
        });
    });

  }


  // Querying products form a specific section,
  // using a starting firebase push key as offset..
  // and another step integer to know when to stop.
  // exmaple: "awdkjjllk" 5 -> returns the first 5 products after the awdkjjllk key.
  getProductsForCategoryUsingOffset(categoryId, startAt, step){

    return new Promise((resolve,reject)=> {

      // setup the query.
      const qRef =
          productsRef
            .orderByChild("categoryId")
            .equalTo(categoryId)
            .startAt(startAt)
            .limitToFirst(step);

      // call it only once..
      qRef.once("value")
        .then(snap => {
          resolve(makeProductsList(snap));
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  // #endregion Quering Products

  // END BackendService class.

}


function makeProductsList(snap){
  // raw firebase list of dumb json objects.
  const listOfProductsAsData = snap.val();

  // Dev crap
  console.log("listOfProductsAsData: ", listOfProductsAsData);


  // transform it to a list of Products.
  const products = Object.keys(listOfProductsAsData).reduce((add, key) => {
    const productData = listOfProductsAsData[key];
    productData.id = key;

    // construct a new Product and addd it to the products list(is actually an object).
    acc[key] = new Product(productData);

    return acc;
  }, {});

  return products;
}



function makeCategory(snap){
  const catData = snap.val();
  console.log("catData: ", catData);
  catData.id = snap.key;
  const cat = new Category(catData);
  console.log("cat: ", cat);
  return cat;
}
