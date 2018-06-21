export default function ShopsService() {

  return {

    loadExternalCategories: () => {
      return new Promise((resolve, reject) => {
        resolve({
          "shopify": {
            categories: {
              "externalCatId1": {
                name: "Monitors",
                externalCatId: "externalCatId1"
              },
              "externalCatId2": {
                name: "Home and Garden",
                externalCatId: "externalCatId2"
              }
            }
          },
          "magento": {
            categories: {
              "externalCatId1": {
                name: "Monitors",
                externalCatId: "externalCatId1"
              },
              "externalCatId2": {
                name: "Home and Garden",
                externalCatId: "externalCatId2"
              }
            }
          },
          "woocommerce": {
            categories: []
          }
        });
      });
    }
  }
}
