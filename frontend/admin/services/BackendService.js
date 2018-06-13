import CustomCategory from "../data/CustomCategory.js"

export default function BackendService() {
  const db = firebase.database();
  return {
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
              const id = cat.getId();
              acc[id] = cat;
              return acc;
            }, {});
        });
    }
  }
}