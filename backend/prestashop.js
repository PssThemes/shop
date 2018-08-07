// Import stuff from the shared module.
// all different cloud functions use this module.
const Shared = require("./shared.js");
const SHOPNAME = "prestashop";
const utils = require("./utils.js");

prestashop().then();

async function prestashop(){

  const settings = await Shared.loadSettings();
  const intenralCategories = await Shared.getInternalCategories(SHOPNAME);

  // all categoryIds that exist in firebase..
  const relevantExternalCatsIds = await Shared.getRelevantExternalCategoriesIds(SHOPNAME);
  // // prepare external products and asociated pieces we need for them.
  const allExternalProducts = await prestashop_loadAllPrestashopProducts();

  const group = await groupExternalCategoriesAndExternalProducts(allExternalProducts);
  const externalProductsGroupedByCategory = group.externalProductsGroupedByCategory;
  const externalCategoriesGroupedByProduct = group.externalCategoriesGroupedByProduct;



  const relevantProductIdsSet = Shared.getRelevantProductIds(relevantExternalCatsIds, externalProductsGroupedByCategory);

  // const relevantProducts = Object.keys(allExternalProducts).reduce((acc, key) => {
  //
  //   const product = allExternalProducts[key];
  //   const productId = product.externalProductId;
  //
  //   if(relevantProductIdsSet.has(productId)){
  //     acc[productId] = product;
  //     return acc;
  //   } else {
  //     return acc;
  //   }
  //
  // }, {});
  //
  // console.log("relevantProducts: ", relevantProducts);

}


async function groupExternalCategoriesAndExternalProducts(externalProducts) {
  // we get the external categories first.
  // const allCollects = await loadAllShopifyCollects();

  console.log("externalProducts: ", externalProducts);

  return Promise.resolve( { externalProductsGroupedByCategory : {}, externalCategoriesGroupedByProduct : {} });
  // const group = allCollects.reduce((acc, collect) => {
  //
  //   const productId = collect.product_id;
  //   const categoryId = collect.collection_id;
  //
  //   if(acc.externalProductsGroupedByCategory[categoryId]){
  //     acc.externalProductsGroupedByCategory[categoryId].push(productId);
  //   }else {
  //     acc.externalProductsGroupedByCategory[categoryId] = [];
  //     acc.externalProductsGroupedByCategory[categoryId].push(productId);
  //   }
  //
  //   if(acc.externalCategoriesGroupedByProduct[productId]){
  //     acc.externalCategoriesGroupedByProduct[productId].push(categoryId);
  //   }else {
  //     acc.externalCategoriesGroupedByProduct[productId] = [];
  //     acc.externalCategoriesGroupedByProduct[productId].push(categoryId);
  //   }
  //
  //   return acc;
  // }, { externalProductsGroupedByCategory : {}, externalCategoriesGroupedByProduct : {} });
  //
  // return group;
}


async function prestashop_getProductIds(){
  const request = require("request-promise-native");
  const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
  const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?output_format=JSON';
  let ids = [];
  let result;
  try{
    result  = await request.get(targetUrl, {}).auth(apiPrestashopKey);
  }catch(err){
    console.log("seems we have an error with loading the products, eror is: ");
    console.log(err);
  }finally{
    result = JSON.parse(result);
    ids = result.products.map(x => x.id);
    return ids;
  }
}



async function prestashop_getProductById(id){
  const request = require("request-promise-native");
  const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
  const targetUrl = `https://ecom.pssthemes.com/prestashop/api/products/${id}?output_format=JSON`;

  let rawData;
  let normalizedProductData;

  try{
    rawData = await request.get(targetUrl, {}).auth(apiPrestashopKey);
  }catch(err){
    console.log(`Could not load product with id: ${id}, eror is: `);
    console.log(err);
  }finally{
    const productWrapper = JSON.parse(rawData);
    const rawProduct = productWrapper.product;


    const temp = rawProduct.associations.images;

    console.log("rawProduct.associations.images: ", Array.isArray(temp), temp);


    const imagesIds = rawProduct.associations.images.map(x => x.id); 
    const images = getImgUrls(imagesIds);

    normalizedProductData = {
      externalProductId: rawProduct.id + "",
      name: rawProduct.name || "",
      mainProductImage: images[0] || "",
      price: rawProduct.price || 0,
      description: rawProduct.description || "",
      media: images,
    };

    // console.log("normalizedProductData: ", normalizedProductData);
  }

  return normalizedProductData;

}

function getImgUrls(imgsIds){
  function template(x){
    return `https://ecom.pssthemes.com/prestashop/img/p/${x}/${x}.jpg`
  }
  return  imgsIds.map(id => template(id + ""));
}



async function test(){
  const stuff = await prestashop_getProductById(2);
  // console.log("stuff: ", stuff);
}

test().then();


async function prestashop_loadAllPrestashopProducts(){

  // let productIds;
  prestashop_getProductIds()
    .then(ids => {
      return Promise.all(ids.map(id => prestashop_getProductById(id)));
      // console.log('ids: ', ids);
    })
    .then(what => {
      console.log("whatL: ", what);
    });



  // .then()
  // try{
  //   productsIds = await prestashop_getProductIds();
  //   let shit= []
  //   shit = Array.from(productsIds);
  //
  //   console.log("productIds: ", shit);
  //
  //   const allPromisedProducts = [...shit].map(id => {
  //     return prestashop_getProductById(id);
  //   });
  //
  //   const stuff = await Promise.all(allPromisedProducts);
  //
  //   // console.log("typeof productIds: ", typeof productIds);
  //
  // }catch(err){
  //   console.log("error when loading the products: ");
  //   console.log(err);
  // }finally{
  //
  // }


  // productsIds = productIds;
  //
  // const stuff = await Promise.all(productIds.map( async (id) => {
  //   return prestashop_getProductById(id);
  // }));
  //
  // console.log("stuff: ", stuff);

//
//
//
//   console.log("productIds: ", productIds);
//
//
//   return productIds;
  // return Promise.resolve({});
}
