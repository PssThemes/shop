// // Extenral products..
// const shopify = new Shopify({
//   shopName: "aion-shop1.myshopify.com",
//   apiKey: "6899818a3b21c823434c02a71605067b",
//   password: "fc0f0ed27ec9a3448eeddc871151f290",
// });

// // Getting the products form shopify
//
// shopify.product.list()
//   .then(result => {
//     console.log("products: ", result);
//   })
//   .catch(err => {
//     console.log("error in loading shopify products..: ", err);
//   });
//
// // Getting the collects form shopify
//
// shopify.collect.list()
// .then(result => {
//   console.log("collects: ", result);
// })
// .catch(err => {
//   console.log("error in loading shopify collects..: ", err);
// });
//


//////////////////////////////////////////////////////////////////////////////////////////////////
// Products.
//////////////////////////////////////////////////////////////////////////////////////////////////

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
    id: 1436642836547,
    title: 'Product 1.0',
    body_html: 'description for Product 1.0',
    images :
      [
        {
          src: 'https://cdn.shopify.com/s/files/1/0026/7603/1555/products/002.gif?v=1534323158',
        }
      ]
    image:
      {
        src: 'https://cdn.shopify.com/s/files/1/0026/7603/1555/products/002.gif?v=1534323158',
      },

    variants :
      [
        {
          price: '0.00',
        }
      ]
  };

const exammpleProduct1 =
  {
    id: 1436642836547,
    title: 'Product 1.0',
    body_html: 'description for Product 1.0',
    vendor: 'aion-shop1',
    product_type: '',
    created_at: '2018-08-15T10:55:24+03:00',
    handle: 'product-1-0',
    updated_at: '2018-08-22T14:02:30+03:00',
    published_at: '2018-08-15T10:54:57+03:00',
    template_suffix: null,
    tags: '',
    published_scope: 'web',
    admin_graphql_api_id: 'gid://shopify/Product/1436642836547',
    variants: [ [Object] ],
    options: [ [Object] ],
    images:
      [
        {
          id: 4069332549699,
          product_id: 1436642836547,
          position: 1,
          created_at: '2018-08-15T11:52:38+03:00',
          updated_at: '2018-08-15T11:52:38+03:00',
          alt: null,
          width: 479,
          height: 473,
          src: 'https://cdn.shopify.com/s/files/1/0026/7603/1555/products/002.gif?v=1534323158',
          variant_ids: [],
          admin_graphql_api_id: 'gid://shopify/ProductImage/4069332549699'
        }
      ],
    image:
     {
       id: 4069332549699,
       product_id: 1436642836547,
       position: 1,
       created_at: '2018-08-15T11:52:38+03:00',
       updated_at: '2018-08-15T11:52:38+03:00',
       alt: null,
       width: 479,
       height: 473,
       src:
        'https://cdn.shopify.com/s/files/1/0026/7603/1555/products/002.gif?v=1534323158',
       variant_ids: [],
       admin_graphql_api_id: 'gid://shopify/ProductImage/4069332549699'
     }
  };

const exampleProduct2 =
  { id: 1456931242051,
    title: 'Product 1.1',
    body_html: 'description for Product 1.1',
    vendor: 'aion-shop1',
    product_type: '',
    created_at: '2018-08-22T14:00:00+03:00',
    handle: 'product-1-1',
    updated_at: '2018-08-22T14:00:00+03:00',
    published_at: '2018-08-22T13:58:35+03:00',
    template_suffix: null,
    tags: '',
    published_scope: 'web',
    admin_graphql_api_id: 'gid://shopify/Product/1456931242051',
    variants: [
      {
        id: 12871165640771,
        product_id: 1436642836547,
        title: 'Default Title',
        price: '0.00',
        sku: '',
        position: 1,
        inventory_policy: 'deny',
        compare_at_price: null,
        fulfillment_service: 'manual',
        inventory_management: null,
        option1: 'Default Title',
        option2: null,
        option3: null,
        created_at: '2018-08-15T10:55:24+03:00',
        updated_at: '2018-08-22T14:02:30+03:00',
        taxable: true,
        barcode: '',
        grams: 0,
        image_id: null,
        inventory_quantity: 1,
        weight: 0,
        weight_unit: 'kg',
        inventory_item_id: 13070712569923,
        old_inventory_quantity: 1,
        requires_shipping: true,
        admin_graphql_api_id: 'gid://shopify/ProductVariant/12871165640771'
      }
    ],
    options: [
      {
        id: 1932543656003,
        product_id: 1436642836547,
        name: 'Title',
        position: 1,
        values: [ 'Default Title' ]
      }
    ],
    images: [],
    image: null
  };

//////////////////////////////////////////////////////////////////////////////////////////////////
//  Collects
//////////////////////////////////////////////////////////////////////////////////////////////////


const whatINeedFromACollect =
  {
    collection_id: 74549592131,
    product_id: 1436642836547,
  };

const exampleCollect =
  {
    id: 9671245070403,
    collection_id: 74549592131,
    product_id: 1436642836547,
    featured: false,
    created_at: '2018-08-22T13:57:53+03:00',
    updated_at: '2018-08-22T13:57:53+03:00',
    position: 1,
    sort_value: '0000000001'
  };
