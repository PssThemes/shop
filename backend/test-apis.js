// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

// PRESTASHOP STUFF
const request = require("request-promise-native");
const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";

// -------------------------------------------------
// Get CATEGORIES In prestashop.
// -------------------------------------------------

// function Prestashop_getCategories(id){
//   const targetUrl = `https://ecom.pssthemes.com/prestashop/api/categories/?output_format=JSON`;
//   return request.get(targetUrl, {}).auth(apiPrestashopKey)
// }
//
// Prestashop_getCategories()
//   .then(result => {
//     console.log("result: ", result);
//   })
//   .catch(error => {
//     console.log("error: ", error);
//   })
//
// function Prestashop_getCategory(id){
//   const targetUrl = `https://ecom.pssthemes.com/prestashop/api/categories/${id}?output_format=JSON`;
//   return request.get(targetUrl, {}).auth(apiPrestashopKey)
// }
//
// Prestashop_getCategory()
//   .then(result => {
//     console.log("result: ", result);
//   })
//   .catch(error => {
//     console.log("error: ", error);
//   })

// -------------------------------------------------
// Get Products In prestashop.
// -------------------------------------------------

// function Prestashop_getProduct(id){
//   const targetUrl = `https://ecom.pssthemes.com/prestashop/api/products/${id}?output_format=JSON`;
//   return request.get(targetUrl, {}).auth(apiPrestashopKey)
// }

// Prestashop_getProduct(1)
// .then(result => {
//   console.log("result: ", result);
// })
// .catch(error => {
//   console.log("error: ", error);
// })
//

// function Prestashop_getProducts(){
//   const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?output_format=JSON';
//   return request.get(targetUrl, {}).auth(apiPrestashopKey);
// }
//
// Prestashop_getProducts()
//     .then(result => {
//
//         const products = JSON.parse(result).products;
//
//         const allProductsAsPromises = products.map( productRef => {
//           return Prestashop_getProduct(productRef.id);
//         });
//
//         Promise.all(allProductsAsPromises)
//           .then(products => {
//               products.map(productStuff => {
//                 const productWrapper = JSON.parse(productStuff);
//                 const product = productWrapper.product;
//
//                 console.log(
//                   `Products
//                   productId: ${ product.id }
//                   productName: ${ product.name }
//                   price: ${ product.price }
//                   shortDescription: ${ product.description_short }
//                   images :  ${ product.associations.images }
//                   ------------------------------------------------
//                   `
//                   // description: ${ product.description }
//                 );
//               })
//           })
//           .catch( err => {
//               console.log("err: ", err);
//           });
//
//     })
//     .catch(error => {
//       console.log("error: ", error);
//     })

// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

// opencart stuff. nu merge.

// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// Woocomerce stuff.

// GET PRODUCTS FROM WOOCOMERCE.
// const WooCommerceAPI = require('woocommerce-api');
//
// const WooCommerce = new WooCommerceAPI({
//   url: 'https://ecom.pssthemes.com/woocommerce',
//   consumerKey: 'ck_8ce43152665f5b31a488e0f71a8885a91820d521',
//   consumerSecret: 'cs_e40f47d822e93e1a61e128e390c4ec612ceb1277',
//   wpAPI: true,
//   version: 'wc/v2'
// });

// WooCommerce.get('products', function(err, data, productsData) {
//   // console.log(products);
//   const products = JSON.parse(productsData);
//   products.map(product => {
//     console.log(
//     `
//       -------------------------------------
//       productId: ${ product.id }
//       productName: ${ product.name }
//       price: ${ product.price }
//       short_description: ${ product.short_description }
//       description: ${ product.description }
      // sku: ${ product.sku } not eno skyu since we dont have it in prestashop.
//       images: ${ product.images }
//       -------------------------------------
//     `
//     // NOTE:  we are not interesteed in external categories here.. this product is indexed inside our shop by our own cateogory id.
//
//     );
//   })
// });

// // GET CATEGORIES FROM WOOCOMERCE.
// WooCommerce.get('products/categories/', function(err, data, categoriesData) {
//   const categories = JSON.parse(categoriesData);
//   categories.map(category => {
//     console.log(
//       `
//       external categoryId: ${ category.id }
//       name: ${ category.name }
//       -------------------------------
//       `
//     );
//   });
// });

// NOTE: we have no way so far in woocommerce to get all the products from 1 category.

// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------


// SHOPPIFY

const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: 'shop-dop.myshopify.com',
  apiKey: '5a0e2ee78ef4cf8195d8b09ab4008b09',
  password: '1d5b877b681052373a8b375c0ff6ccc2'
});




// -----------------------------------
// Getting External categoreis form shopify
// -----------------------------------
// function Shopily_getExternalCats(){
//   return new Promise((res, rej) => {
//
//     shopify.customCollection.list()
//     // shopify.collect.get(62468784195)
//     .then(collections => {
//
//       const externalCategories = collections.map(collection => {
//         return {
//           name: collection.title,
//           externalCatId: collection.id
//         }
//       });
//
//       console.log("shopify externalCategories", externalCategories);
//       res(externalCategories);
//
//     })
//     .catch(error => {
//       console.log("error: ", error);
//     });
//
//   });
// }
// Shopily_getExternalCats().then(() => {});

// -----------------------------------
// Getting all products from shopify.
// -----------------------------------

// function Shopify_getAllProducts(){
//   shopify.product.list().then(products => {
//     console.log("products: ", products);
//   })
//   .catch(error => {
//     console.log("error: ", error);
//   });
// }
// Shopify_getAllProducts()

// -----------------------------------
// Getting products from a specific category in shopify.
// -----------------------------------

function getProductsIdsForCategory(categorId){
  return new Promise((res, rej) => {
    // NOTE: based on this: https://stackoverflow.com/questions/24228734/how-to-retrieve-all-products-from-a-smart-collection-through-shopify-api
    // is required to get the product using the collect.. and not directly from the category.
    shopify.collect.list({ collection_id : categorId })
      .then(collects => {
        const productIds = collects.map(collect  => {
          return collect.product_id;
        })
        res(productIds);
      })
      .catch(error => {
        rej(error);
      });

  });
}

function getProducts(productsIds){
  const allProductsAsPromised = productsIds.map(productId => {
    return shopify.product.get(productId);
  });
  return Promise.all(allProductsAsPromised);
}

function getProductsForCategory(categoryId){
  return getProductsIdsForCategory(categoryId)
    .then((productIds) => {
      return getProducts(productIds);
    });
}


getProductsForCategory(62656053315)
  .then(products => {

    const preparedProducts = products.map(product => {
      console.log("product price>? : ", product);
      return {
        mainProductImage:  (product.image || {}).src || "",
        media: product.images.map(img => {
          return img.src
        }),
        name: product.title,
        price: product.variants[0].price || 0,
        description: product.body_html
      }
    });

    console.log("preparedProducts: ", preparedProducts);

  })
  .catch(error => {
    console.log("error: ", error);
  })



// --------------------------------------------------------------------
// return new Promise((res, rej) => {
//
//     .then(products => {
//       // TODO: handle the conversion to here.
//       res(products);
//     })
//     .catch(error => {
//       rej(error);
//     })
// });




// shopify.product.list()
// shopify.collect.list({ collection_id : 62468784195 })
// shopify.collect.get(9339937226819)
// shopify.customCollection.get(9339937226819)
// shopify.customCollection.list()
// // shopify.collect.get(62468784195)
  // .then(result => {
  //   console.log("result: ", result);
  // })
  // .catch(error => {
  //   console.log("error: ", error);
  // });

// shopify email is:
// prettysmartsoft@gmail.com
// password is in meail.








// --
