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

    onCreateCustomCategory: observer => {
      categoriesRef.on("child_added", (snap) => {
        const catData = snap.val();
        const cat = new CustomCategory(snap.key, catData.name, catData.products, catData.linkedTo);
        observer(cat.id, cat);
      });
    },


    // UPDATE
    updateCustomCategory: (catId, cat) => {
      return new Promise((resolve, reject) => {
        db.ref("/categories/" + catId)
          .set(cat)
          .then(result => {
            resolve();
          })
          .catch(err => reject(catId, cat, error))
      });
    },

    onUpdateCustomCategory: (observer) => {
      categoriesRef.on("child_changed", snap => {
        const catData = snap.val();
        const cat = new CustomCategory(snap.key, catData.name, catData.products, catData.linkedTo);
        observer(cat.id, cat);
      });
    },


    // DELETE
    deleteCustomCategory: (catId) => {
      return db.ref("/categories/" + catId).set(null)
    },

    onDeleteCustomCategory: (observer) => {
      categoriesRef.on("child_removed", (snap) => {
        observer(snap.key);
      });
    },

    // #/region Custom Categoryies

    //
    //
    // #region Products

    onProductAdded: (observer) =>  {
      productsRef.on("child_added", snap => {
        observer(pushKey, makeProduct(snap));
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
        observer(pushKey, makeProduct(snap));
      });
    },

    create3FakeProducts: () => {
      const p1 = createDummyProduct("Monitor");
      productsRef.push(p1.getData());
    }

    // #/region Products

  }
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
