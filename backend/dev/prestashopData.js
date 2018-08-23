



////////////////////////////////////////////////////////////////////////////////////////////////
// // Images.
////////////////////////////////////////////////////////////////////////////////////////////////

function getImgUrls(imgsIds){
  function template(x){
    return `https://ecom.pssthemes.com/prestashop/img/p/${x}/${x}.jpg`
  }
  return  imgsIds.map(id => template(id + ""));
}



////////////////////////////////////////////////////////////////////////////////////////////////
// // Categories
////////////////////////////////////////////////////////////////////////////////////////////////

const request = require("request-promise-native");
const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
// const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?display=full&output_format=JSON';
const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/categories/?display=full&output_format=JSON';

request.get(targetUrl, {}).auth(apiPrestashopKey)
  .then(result => {

    // TODO:  Make sure to include .categories since the object returned is a werapper around the categories..
    console.log("categories: ", JSON.parse(result));

  })
  .catch(err => {
    console.log("error: ", err);
  })

const whatINeedFromACategory =
    {
      id: 1,
      name: 'Root',
    }

const exampleCategory =
    {
      id: 1,
       id_parent: '0',
       level_depth: '0',
       nb_products_recursive: '7',
       active: '1',
       id_shop_default: '1',
       is_root_category: '0',
       position: '0',
       date_add: '2018-06-07 13:38:16',
       date_upd: '2018-06-07 13:38:16',
       name: 'Root',
       link_rewrite: 'root',
       description: '',
       meta_title: '',
       meta_description: '',
       meta_keywords: '',

       // Not sure whats up with this asoications..
       associations: [ { id: '2' } ]
    }

////////////////////////////////////////////////////////////////////////////////////////////////
// // Products.
////////////////////////////////////////////////////////////////////////////////////////////////
// NOT USED JUST FOR REFERENCE>>
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


const request = require("request-promise-native");
const apiPrestashopKey = "R21PLEPZI2H4KAXQ4RPG1FELYEI17GYI";
const targetUrl = 'https://ecom.pssthemes.com/prestashop/api/products/?display=full&output_format=JSON';

request.get(targetUrl, {}).auth(apiPrestashopKey)
  .then(result => {
    console.log("products: ", JSON.parse(result));
  })
  .catch(err => {
    console.log("error: ", err);
  })



// // Normalized product..
// { externalId : ExternalProductId
// , name : String
// , mainImage : Maybe String
// , price : Float
// , short_description : String
// , description : String
// , media : List String
//
// }


const whatINeedFromAProduct =
  {
      id: 4,
      name: 'Dress Printed Dress DressDress Dress',
      price: '50.994153',
      description:
      '<p>Fashion has been creating well-designed collections since 2010. The brand offers feminine designs delivering stylish separates and statement dresses which have since evolved into a full ready-to-wear collection in which every item is a vital part of a woman\'s wardrobe. The result? Cool, easy, chic looks with youthful elegance and unmistakable signature style. All the beautiful pieces are made in Italy and manufactured with the greatest attention. Now Fashion extends to a range ofaccessories including shoes, hats, belts and more!</p>',
      description_short:
      '<p>Printed evening dress with straight sleeves with black thin waist belt and ruffled linings.</p>',
      associations: {
        // This ids are enough to create the externalCatIds
        categories: [
          { id: '2' },
          { id: '3' },
          { id: '8' },
          { id: '9' }
        ],
        // This ids are enough to build up the image url. as shown in the getImgUrls function from above.
        images: [
          { id: '8' },
          { id: '9' }
        ],
      }
  };

const exammpleProduct =
    {
      id: 4,
      id_manufacturer: '1',
      id_supplier: '1',
      id_category_default: '10',
      new: null,
      cache_default_attribute: '16',
      id_default_image: '10',
      id_default_combination: '16',
      id_tax_rules_group: '1',
      position_in_category: '0',
      manufacturer_name: 'Fashion Manufacturer',
      quantity: '0',
      type: 'simple',
      id_shop_default: '1',
      reference: 'demo_4',
      supplier_reference: '',
      location: '',
      width: '0.000000',
      height: '0.000000',
      depth: '0.000000',
      weight: '0.000000',
      quantity_discount: '0',
      ean13: '0',
      upc: '',
      cache_is_pack: '0',
      cache_has_attachments: '0',
      is_virtual: '0',
      on_sale: '0',
      online_only: '0',
      ecotax: '0.000000',
      minimal_quantity: '1',
      price: '50.994153',
      wholesale_price: '15.300000',
      unity: '',
      unit_price_ratio: '0.000000',
      additional_shipping_cost: '0.00',
      customizable: '0',
      text_fields: '0',
      uploadable_files: '0',
      active: '1',
      redirect_type: '404',
      id_product_redirected: '0',
      available_for_order: '1',
      available_date: '0000-00-00',
      condition: 'new',
      show_price: '1',
      indexed: '1',
      visibility: 'both',
      advanced_stock_management: '0',
      date_add: '2018-06-07 13:38:16',
      date_upd: '2018-07-20 09:59:20',
      pack_stock_type: '3',
      meta_description: '',
      meta_keywords: '',
      meta_title: '',
      link_rewrite: 'printed-dress',
      name: 'Dress Printed Dress DressDress Dress',
      description:
        '<p>Fashion has been creating well-designed collections since 2010. The brand offers feminine designs delivering stylish separates and statement dresses which have since evolved into a full ready-to-wear collection in which every item is a vital part of a woman\'s wardrobe. The result? Cool, easy, chic looks with youthful elegance and unmistakable signature style. All the beautiful pieces are made in Italy and manufactured with the greatest attention. Now Fashion extends to a range ofaccessories including shoes, hats, belts and more!</p>',
      description_short:
        '<p>Printed evening dress with straight sleeves with black thin waist belt and ruffled linings.</p>',
      available_now: 'In stock',
      available_later: '',
      associations: {

          categories: [ { id: '2' }, { id: '3' }, { id: '8' }, { id: '9' } ],
          images: [ { id: '8' }, { id: '9' } ],
          combinations: [ { id: '13' }, { id: '14' }, { id: '15' } ],
          product_option_values: [ { id: '1' }, { id: '13' }, { id: '2' }, { id: '3' } ],

          product_features:
           [ { id: '5', id_feature_value: '5' },
             { id: '6', id_feature_value: '13' },
             { id: '7', id_feature_value: '18' }
           ],

          stock_availables:
           [ { id: '3', id_product_attribute: '0' },
             { id: '20', id_product_attribute: '13' },
             { id: '21', id_product_attribute: '14' },
             { id: '22', id_product_attribute: '15' }
           ]
      }
    };
