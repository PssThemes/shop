import CustomCategory from "../data/CustomCategory.js"
import Product from "../data/Product.js"
import Reply from "../data/Reply.js"
import Review from "../data/Review.js"
import UserProfile from "../data/UserProfile.js"

export default function BackendService() {
  const db = firebase.database();

  const categoriesRef = db.ref("/categories");

  const productsRef = db.ref("/products");
  const productRef = (id) => {
    return db.ref("/products/" + id);
  }

  const userProfileRef = (id) => {
    return db.ref("/users/" + id);
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

    onSpecificProductUpdate: (productId, observer) =>{
      productRef(productId).on("value", snap => {
        observer(makeProduct(snap));
      });
    },

    createAdminReplyForReview: (productId, reviewId, value) => {
      const reply = {
        text: value,
        who: "admin"
      };

      return new Promise((resolve, reject) => {
        db.ref(`products/${productId}/reviews/${reviewId}/replies`).push(reply)
          .then( res => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
      });
    },
    // #/region Products

    // #region Users

    getUserProfile : userId => {
      return new Promise((resolve, reject) => {
        userProfileRef(userId).once("value")
          .then(snap => {
            resolve(makeUserProfile(snap));
          })
          .catch( err => {
            reject(err);
          });
      });
    },




    // #/region Users


  }
}

function makeUserProfile(snap){
  const profileData = snap.val();
  profileData.uid = snap.key;
  return new UserProfile(profileData);
}

function makeCustomCategory(snap){
  const catData = snap.val();
  console.log("catData: ", catData);
  catData.id = snap.key;
  return new CustomCategory(catData)
}

function makeProduct(snap){
  const pushKey = snap.key;
  const data = snap.val();
  data.id = pushKey;
  return new Product(data);
}
