import CustomCategory from "../data/CustomCategory.js"
import Product from "../data/Product.js"
import Reply from "../data/Reply.js"
import Review from "../data/Review.js"

export default function BackendService() {
  const db = firebase.database();
  const categoriesRef = db.ref("/categories");
  const productsRef = db.ref("/products");
  const productRef = (id) => {
    return db.ref("/products/" + id);
  }
  return {
    // #region Custom Categoryies
    // ------------------------------------------
    // Categories Resource
    // ------------------------------------------

    // CREATE
    createCustomCategory: catName => {

      const newCat = {
        name: catName,
        products: [],
        linkedTo: []
      }

      return new Promise((resolve, reject) => {
        categoriesRef.push(newCat)
          .then(result => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      });

    },

    onCustomCategoryAdded: observer => {
      categoriesRef.on("child_added", snap => {
        observer(makeCustomCategory(snap));
      });
    },


    // UPDATE
    updateCustomCategory: cat => {
      return new Promise((resolve, reject) => {
        const catData = cat.getData();
        db.ref("/categories/" + cat.id)
          .set(catData)
          .then(result => {
            resolve();
          })
          .catch(err => reject(cat, error))
      });
    },

    onCustomCategoryUpdate: observer => {
      categoriesRef.on("child_changed", snap => {
        observer(makeCustomCategory(snap));
      });
    },


    // DELETE
    deleteCustomCategory: catId => {
      return db.ref("/categories/" + catId).set(null)
    },

    onDeleteCustomCategory: observer => {
      categoriesRef.on("child_removed", snap => {
        observer(snap.key);
      });
    },

    // #/region Custom Categoryies

    //
    //
    // #region Products

    getProduct: id => {
      return new Promise((resolve, reject) => {
        productRef(id).once("value")
          .then(snap => {
            const product = makeProduct(snap);
            console.log("product: ", product);
            resolve(product);
          })
          .catch(err => {
            reject(err);
          })
      })
    },

    onProductAdded: (observer) =>  {
      productsRef.on("child_added", snap => {
        observer(makeProduct(snap));
      });
    },

    updateProduct : (productId, newProduct) => {
      return new Promise ((resolve, reject) => {
        productRef(productId).set(newProduct)
        .then(res => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
      });
    },

    onProductUpdate : (observer)  => {
      productsRef.on("child_changed", snap => {
        observer(makeProduct(snap));
      });
    },

    // create3FakeProducts: () => {
    //   const p1 = createDummyProduct("Monitor");
    //   productsRef.push(p1.getData());
    // }

    // #/region Products

  }
}

function makeCustomCategory(snap){
  const catData = snap.val();
  catData.id = snap.key;
  return new CustomCategory(catData)
}

function makeProduct(snap){
  const pushKey = snap.key;
  const data = snap.val();
  data.id = pushKey;
  return new Product(data);
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
        messsage : "Review msg",
        clientId : "clientId|noproblem..",
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
