export default function ShopsService() {

  return {

    loadExternalCategories: () => {
      return new Promise((resolve, reject) => {
        resolve({
          "shopify": {
            categories: {
              "11111111": {
                name: "Monitors",
                id: "11111111"
              },
              "123": {
                name: "Home and Garden",
                id: "123"
              }
            }
          },
          "magento": {
            categories: []
          },
          "woocommerce": {
            categories: []
          }
        });
      });
    }
  }
}