export default function CategoriesService() {

  var db = firebase.database();

  return {
    loadCustomCategories: () => {
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
        ]);
      });
    },
    addNewCategory: (name) => {
      const emptyCat = {
        name: name,
        products: [],
        mapper: []
      };
      // send this to firestore..
      db.ref("categories").push(emptyCat)
        .then(docRef => {
          console.log("docRef: ", docRef);
        })
        .catch(error => {
          console.log("error: ", error);
        });
    },

    addMapping: (categoryId, mapper) => {

    },

    onCustomCategoryAdded: (observer) => {
      db.ref("categories")
        .on("child_added", snap => {
          observer(snap.key, snap.val());
        });
    }
  }
}