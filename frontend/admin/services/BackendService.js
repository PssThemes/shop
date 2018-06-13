import CustomCategory from "../data/CustomCategory.js"

export default function BackendService() {
  const db = firebase.database();
  return {

    // ------------------------------------------
    // Categories Resource
    // ------------------------------------------

    getCustomCategories: () => {
      // TODO: ask firebase for a list of all custom categories.
      return new Promise((resolve, reject) => {
          resolve([{
              id: "adwjkjkn",
              name: "Monitoare",
              products: []
            },
            {
              id: "ajdwhhjkawdnkjad",
              name: "Casa si gradina",
              products: []
            }
          ])
        })
        .then(catsData => {
          return catsData
            .map(catData => {
              const customCategory = new CustomCategory(catData.id, catData.name, catData.products);
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
        resolve();
      });
    },

    onCreateCustomCategory: observer => {
      observer("catId", "cat");
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
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    onDeleteCustomCategory: (observer) => {
      observer("catId");
    }


  }
}