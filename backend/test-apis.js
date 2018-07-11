// PRESTASHOP STUFF
// const request = require("request-promise-native");
// const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
//
// function Prestashop_getProduct(id){
//   const targetUrl = `https://ecom.pssthemes.com/prestashop/api/products/${id}?output_format=JSON`;
//   return request.get(targetUrl, {}).auth(apiPrestashopKey)
// }
// function Prestashop_getProducts(){
//   const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?output_format=JSON';
//   return request.get(targetUrl, {}).auth(apiPrestashopKey);
// }
//
// getProducts()
//     .then(result => {
//       console.log("result: ", result);
//     })
//     .catch(error => {
//       console.log("error: ", error);
//     })


// opencart stuff. nu merge.


// Woocomerce stuff.

const WooCommerceAPI = require('woocommerce-api');

const WooCommerce = new WooCommerceAPI({
  url: 'https://ecom.pssthemes.com/woocommerce',
  consumerKey: 'ck_8ce43152665f5b31a488e0f71a8885a91820d521',
  consumerSecret: 'cs_e40f47d822e93e1a61e128e390c4ec612ceb1277',
  wpAPI: true,
  version: 'wc/v2'
});
//
// WooCommerce.get('products', function(err, data, res) {
//   console.log(res);
// });

WooCommerce.get('products/12312', function(err, data, res) {
  console.log(res);
});


//
// function Prestashop_getProducts(){
//   const targetUrl = 'https://ecom.pssthemes.com/woocommerce/wp-json/wc/v2/products';
//   return request.get(targetUrl, {}).auth(apiPrestashopKey);
// }
