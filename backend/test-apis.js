// PRESTASHOP STUFF
const request = require("request-promise-native");
const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";

function getProduct(id){
  const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/1?output_format=JSON';
  return request.get(targetUrl, {}).auth(apiPrestashopKey)
}
function getProducts(){
  const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?output_format=JSON';
  return request.get(targetUrl, {}).auth(apiPrestashopKey);
}

getProducts()
    .then(result => {
      console.log("result: ", result);
    })
    .catch(error => {
      console.log("error: ", error);
    })
