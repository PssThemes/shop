import CustomCategory from "../data/CustomCategory.js"

export default function BackendService() {
  const db = firebase.database();
  const categoriesRef = db.ref("/categories");
  return {

    // ------------------------------------------
    // Categories Resource
    // ------------------------------------------

    getCustomCategories: () => {
      // TODO: ask firebase for a list of all custom categories.
      return categoriesRef
        .once('value')
        .then(snap => {
          return snap.val();
        })
        .then(catsData => {
          return Object.keys(catsData)
            .map(key => {
              return {
                catId: key,
                data: catsData[key]
              };
            })
            .map(catData => {
              const customCategory = new CustomCategory(catData.catId, catData.data.name, catData.data.products);
              return customCategory;
            })
            .reduce((acc, cat) => {
              acc[cat.id] = cat;
              return acc;
            }, {});
        });
    },

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
        const cat = new CustomCategory(snap.key, catData.name, catData.products);
        observer(cat.id, cat);
      });
    },

    // UPDATE
    updateCustomCategory: (catId, cat) => {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },

    onUpdateCustomCategory: (observer) => {
      observer("catId", "cat");
    },

    // DELETE
    deleteCustomCategory: (catId) => {
      return db.ref("/categories/" + catId).set(null)
    },
    onDeleteCustomCategory: (observer) => {
      categoriesRef.on("child_removed", (snap) => {
        observer(snap.key);
      });
    }


  }
}