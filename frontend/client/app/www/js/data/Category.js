export default class Category {

  constructor (catData){
    if(!catData){
      throw new Error(`Could not create a Category object: catData is null or undefined: ${catData}`);
    }

    if(!catData.id){
      throw new Error(`Each category must have a proper id, you provided: ${catData.id}`);
    }

    if(!catData.name || catData.name == "" ){
      throw new Error(`Each category must have a proper name, you provided: ${catData.id}`);
    }

    this.id = catData.id;
    this.name = catData.name;
    this.products = {};
  }

  addProductToCategory(product){
    this.products[product.id] = product;
  }


}
