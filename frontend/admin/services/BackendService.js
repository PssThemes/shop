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
        data.id = pushKey;
        observer(pushKey, new Product(data));
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
      const p1 = createDummyProduct("Monitor");
      productsRef.push(p1.getData());
    }

    // #/region Products
    //
    //

  }
}
//
// function decodeProduct(firebasePushKey, productData){
//   if(productData){
//
//     let reviews = {};
//
//     if(productData.reviews){
//       reviews = Object.keys(productData.reviews).reduce((acc,key) => {
//         const review =  decodeReview(key, productData.reviews[key]);
//         acc[key] = review;
//         return acc;
//       }, {});
//     }
//
//     return new Product(
//       firebasePushKey,
//       productData.mainImageUrl,
//       productData.name,
//       productData.short_description,
//       productData.price,
//       productData.isHidden,
//       reviews,
//     );
//
//   }else{
//     console.log("decodeProduct has been passed a bad value");
//     return createDummyProduct("dummy product..")
//   }
// }
//
// function decodeReview(firebasePushKey,reviewData){
//   let replyes = null;
//   if(reviewData.replies){
//     replyes = Object.keys(reviewData.replies).reduce((acc, key) => {
//       return acc[key] = decodeReply(key, reviewData.replies[key]);
//     }, {});
//   }
//
//   if(reviewData){
//     return new Review(
//       firebasePushKey,
//       reviewData.value,
//       reviewData.messsage,
//       reviewData.clientId,
//       replyes
//     );
//   }
// }
//
// function decodeReply(firebasePushKey, replyData){
//   if(replyData){
//     return new Reply(firebasePushKey, replyData.text, replyData.who);
//   }
// }


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
