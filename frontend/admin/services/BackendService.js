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
    // getAllProducts: () => {
    //   return new Promise((resolve, reject) => {
    //     productsRef.once()
    //       .then(snap => {
    //         const allProducts = snap.value();
    //         console.log("allProducts: ", allProducts);
    //         resolve(
    //           Object.keys(allProducts).map(key => {
    //             decodeProduct(key, allProducts[key]);
    //           })
    //         );
    //       })
    //       .catch(err => {
    //         reject(err);
    //       });
    //   });
    // },

    onProductAdded: (observer) =>  {
      productsRef.on("child_added", snap => {
        const pushKey = snap.key;
        const data = snap.val();
        observer(pushKey, decodeProduct(pushKey, data));
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

    // onProductUpdate : (observer)  => {
    //   productsRef.on("child_changed", snap => {
    //     observer(decodeProduct(snap.key, snap.val()));
    //   });
    // },

    create3FakeProducts: () => {
      const p1 = createDummyProduct("Monitor")
      const p2 = createDummyProduct("Mouse")
      const p3 = createDummyProduct("Tastatura")

      productsRef.push(p1.getData())
      productsRef.push(p2.getData())
      productsRef.push(p3.getData())
        // .then(result => {
        //   console.log("Fake Products added")
        //   console.log("result:", result)
        // })
        // .catch(err => {
        //   console.log("error on adding fake products: ", err);
        // })
    }

    // #/region Products
    //
    //

  }
}

function decodeProduct(firebasePushKey, productData){
  if(productData){

    let reviews = {};

    if(productData.reviews){
      reviews = Object.keys(productData.reviews).reduce((acc,key) => {
        const review =  decodeReview(key, productData.reviews[key]);
        acc[key] = review;
        return acc;
      }, {});
    }

    return new Product(
      firebasePushKey,
      productData.mainImageUrl,
      productData.name,
      productData.short_description,
      productData.price,
      productData.isHidden,
      reviews,
    );

  }else{
    console.log("decodeProduct has been passed a bad value");
    return createDummyProduct("dummy product..")
  }
}

function decodeReview(firebasePushKey,reviewData){
  let replyes = null;
  if(reviewData.replies){
    replyes = Object.keys(reviewData.replies).reduce((acc, key) => {
      return acc[key] = decodeReply(key, reviewData.replies[key]);
    }, {});
  }

  if(reviewData){
    return new Review(
      firebasePushKey,
      reviewData.value,
      reviewData.messsage,
      reviewData.clientId,
      replyes
    );
  }
}

function decodeReply(firebasePushKey, replyData){
  if(replyData){
    return new Reply(firebasePushKey, replyData.text, replyData.who);
  }
}

function createDummyProduct(productName){
  const reviews = {
    "reviewId|0000": new Review(
      "reviewId|0000",
      3,
      "hey great product!!",
      "uid|awd892u739awd a",
      {},
    ),
    "reviewId|1111":  new Review(
      "reviewId|1111",
      null,
      "i like it! :)",
      "uid|qddqwdwqd739awd a",
      {
        "replyId|9999": new Reply (
          "replyId|8888",
          "I'm glad you do. Do you need any help with the setup?",
          "admin"
        ),
        "replyId|8888": new Reply (
          "replyId|8888",
          "no i'm fine, thanks..",
          "client"
        )
      }
    )
  };
  const product = new Product(
    "productId|123",
    "no image",
    productName,
    "Product Description..",
    120,
    false,
    reviews
  );
  return product;
}

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
