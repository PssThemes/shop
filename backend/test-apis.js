const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products'
// console.log("it works");
fetch( proxyUrl + targetUrl,
    { headers: {
      "Content-Type": "application/json",
      "Authorization" : "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI"
      // "Content-Type": "application/x-www-form-urlencoded",
      }
    })
    // .then(blob => blob.json())
    .then(result => {
      console.log("result: ", result)
    })
    .catch(err => {
       console.log("err: ", err);
    });
