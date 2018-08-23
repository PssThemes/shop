// async function prestashop_getProductIds(){
//   const request = require("request-promise-native");
//   const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
//   const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?output_format=JSON';
//   let ids = [];
//   let result;
//   try{
//     result  = await request.get(targetUrl, {}).auth(apiPrestashopKey);
//   }catch(err){
//     console.log("seems we have an error with loading the products, eror is: ");
//     console.log(err);
//   }finally{
//     result = JSON.parse(result);
//     ids = result.products.map(x => x.id);
//     return ids;
//   }
// }

function test () {
  // prestashop_getProductIds()
  //   .then(result => {
  //     console.log("result: ", result );
  //   })
  //   .catch(err => {
  //     console.log("err: ", err );
  //   });

  const request = require("request-promise-native");
  const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
  // const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?display=full&output_format=JSON';
  const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/categories/?display=full&output_format=JSON';

  request.get(targetUrl, {}).auth(apiPrestashopKey)
    .then(result => {
      console.log("result: ", JSON.parse(result));

    })
    .catch(err => {
      console.log("error: ", err);
    })

}

test();
