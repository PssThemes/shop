import CustomCategory from "../data/CustomCategory.js"
import Product from "../data/Product.js"
import Reply from "../data/Reply.js"
import Review from "../data/Review.js"

export default function BackendService() {
  const db = firebase.database();
  const categoriesRef = db.ref("/categories");
  const productsRef = db.ref("/products");
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
    getAllProducts: () => {
      return new Promise((resolve, reject) => {

        // new Product()
        // resolve({
        //   "productId|123": {
        //     id: "productId|123",
        //     name: "ProductName",
        //     short_description: "Product Description..",
        //     price: 120,
        //     reviews: {
        //       "reviewId|0000": {
        //         value: 3,
        //         messsage: "hey great product!!",
        //         clientId: "uid|awd892u739awd a",
        //         replies: {}
        //       },
        //       "reviewId|1111": {
        //         value: null,
        //         messsage: "i like it! :)",
        //         clientId: "uid|qddqwdwqd739awd a",
        //         replies: {
        //           "replyId|9999": {
        //             text: "I'm glad you do. Do you need any help with the setup?",
        //             who: "admin"
        //           },
        //           "replyId|8888": {
        //             text: "no i'm fine, thanks..",
        //             who: "client"
        //           }
        //         }
        //       },
        //     }
        //     isHidden: false
        //   }
        // })
        resolve();
        // productsRef.once()
        //   .then(snap => {
        //     resolve();
        //   })
        //   .catch(err => {
        //     reject();
        //   });
      });
    },
    // #/region Products
    //
    //

  }
}


// { id : FirebasePushId
// , name: ProductName
// , description: String
// , description_short: String
// , price: Float
// , media: List {  url: String, alt: String }
// , category: ?
// , reviews: List Review
// }

// ## Review
// ```
// { value: Maybe Int
// , messsage: String
// , user: UserName // this is user name not userId..
// , replies: List Reply // only the admin can reply.. and only the client an add more messages.
// }
// ```
//
// ## Reply
// ```
// { text : String
// , who: Admin | Client
// }