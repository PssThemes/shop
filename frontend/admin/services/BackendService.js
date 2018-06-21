import CustomCategory from "../data/CustomCategory.js"
import Product from "../data/Product.js"
import Reply from "../data/Reply.js"
import Review from "../data/Review.js"
import UserProfile from "../data/UserProfile.js"
import Settings from "../data/Settings.js"
import {Order} from "../data/Order.js"

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

  const usersProfilesRef = () => {
    return db.ref("/users");
  }

  const settingsRef = () => {
    return db.ref("/settings");
  }

  const ordersRef = () => {
    return db.ref("/orders");
  }

  const orderRef = (id) => {
    return db.ref("/orders/" + id);
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

    onUserProfileChanged: (observer) => {
      usersProfilesRef().on("child_changed", snap => {
        observer(makeUserProfile(snap));
      });
      return;
    },

    onUserProfileAdded: (observer) => {
      usersProfilesRef().on("child_added", snap => {
        observer(makeUserProfile(snap));
      });
      return;
    },

    updateUserProfile: (userProfile) => {
      return new Promise((resolve, reject) => {
        userProfileRef(userProfile.uid).set(userProfile.getData())
        .then(ok => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
      });
    },


    // #/region Users


    // #region Settings

    getSettings: () => {
      return new Promise((resolve, reject) => {
        settingsRef().once("value")
          .then(snap => {
            resolve(makeSettings(snap));
          })
          .catch(err => {
            reject(err);
          });
      })
    },

    updateSettings: settings => {
      return new Promise((resolve, reject) => {
        console.log(settings.getData())
        settingsRef().set(settings.getData())
          .then(result => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
      });
    },

    // #/region Settings


    // #region ORDERS

    // productRef(id).once("value")
    //   .then(snap => {
    //     const product = makeProduct(snap);
    //     resolve(product);
    //   })
    //   .catch(err => {
    //     reject(err);
    //   })

    getOrder: orderId => {
      return new Promise((resolve, reject) => {
        orderRef(orderId).once("value")
          .then(snap => {
            resolve(makeOrder(snap));
          })
          .catch(err => {
            reject(err);
          })
        });
    },

    onSpecificOrderChanged : (orderId, observer) => {
      orderRef(orderId).on("value", snap => {
        observer(makeOrder(snap));
      })
    },

    onOrderChanged: observer => {
      ordersRef().on("child_changed", snap => {
        observer(makeOrder(snap));
      });
    },

    onOrderAdded: observer => {
      ordersRef().on("child_added", snap => {
        observer(makeOrder(snap));
      });
    },

    updateOrder : order => {
      return new Promise((resolve, reject) => {
        orderRef(order.id).set(order.getData())
        .then(result => {
          resolve()
        })
        .catch(err => {
          reject(err);
        });
      })
    }

    // #/region ORDERS

  }
}

function makeOrder(snap){
  const orderData = snap.val();
  orderData.id = snap.key;
  return new Order(orderData);
}

function makeSettings(snap){
  return new Settings(snap.val());
}

function makeUserProfile(snap){
  const profileData = snap.val();
  profileData.uid = snap.key;
  return new UserProfile(profileData);
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
