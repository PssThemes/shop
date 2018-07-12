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

shopify email is:
prettysmartsoft@gmail.com
password is in meail.








// --
