import CustomCategory from "../data/CustomCategory.js"

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
        productsRef.once()
          .then(snap => {
            resolve();
          })
          .catch(err => {
            reject();
          });
      });
    },
    // #/region Products
    //
    //

  }
}