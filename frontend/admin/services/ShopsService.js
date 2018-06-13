export default function ShopsService() {

  return {
    loadExternalCategories: () => {
      return [{
          shopName: "shopify",
          categories: [{
            name: "Monitors",
            categoryId: "qajdhwljawnmdlkamdwlk"
          }, {
            name: "Home and Garden",
            categoryId: "qajdhwljawnmdlkamdwlk"
          }]
        },
        {
          shopName: "Magento",
          categories: [{
            name: "Monitors",
            categoryId: "qajdhwljawnmdlkamdwlk"
          }, {
            name: "Home and Garden",
            categoryId: "qajdhwljawnmdlkamdwlk"
          }]
        }
      ];
    }
  }
}