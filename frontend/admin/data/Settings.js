export default class Settings {

  constructor(settingsData){

    if(!settingsData){
      throw new Error(`bad parameter for Settings object: ${settingsData}`);
    }

    this.shopify = {
      configured: settingsData.shopify.configured || false,
      apiKey: settingsData.shopify.apiKey || "",
      apiSecret: settingsData.shopify.apiSecret || "",
      sync: settingsData.shopify.sync || true
    }

    this.magento = {
      configured: settingsData.magento.configured || false,
      apiKey: settingsData.magento.apiKey || "",
      apiSecret: settingsData.magento.apiSecret || "",
      sync: settingsData.magento.sync || true
    }

    this.woocomerce = {
      configured: settingsData.woocomerce.configured || false,
      apiKey: settingsData.woocomerce.apiKey || "",
      apiSecret: settingsData.woocomerce.apiSecret || "",
      sync: settingsData.woocomerce.sync || true
    }

  }

  getData(){
    return {
      shopify : this.shopify,
      magento : this.magento,
      woocomerce : this.woocomerce
    }
  }

  toggleSync(shopName){
    if(shopName == "shopify"){
      this.shopify.sync = !this.shopify.sync;
    }

    if(shopName == "magento"){
      this.magento.sync = !this.magento.sync;
    }

    if(shopName == "woocomerce"){
      this.woocomerce.sync = !this.woocomerce.sync;
    }
  }

  // NOTE: this is super duplication .. but this is temporaryt since each shop is configured
  // diferently .. so in reality this functions will be so different, then code will not look like duplication at all.
  configureShopify(key, secret){
    if(!key || !secret){
      throw new Error(`Bad key or secret for Shopify. key is: "${key}" and secret is: "${secret}"`);
    }

    if((key.trim() == "") || (secret.trim() == "")){
      throw new Error(`Empty key or secret for Shopify. key is: "${key}" and secret is: "${secret}"`);
    }

    this.shopify = {
      configured: true,
      apiKey: key.trim(),
      apiSecret: secret.trim()
    }
    return true;
  }

  configureMagento(key, secret){
    if(!key || !secret){
      throw new Error(`Bad key or secret for Magento. key is: "${key}" and secret is: "${secret}"`);
    }

    if((key.trim() == "") || (secret.trim() == "")){
      throw new Error(`Empty key or secret for Magento. key is: "${key}" and secret is: "${secret}"`);
    }

    this.magento = {
      configured: true,
      apiKey: key.trim(),
      apiSecret: secret.trim()
    }
    return true;
  }

  configureWoocomerce(key, secret){
    if(!key || !secret){
      throw new Error(`Bad key or secret for Woocomerce. key is: "${key}" and secret is: "${secret}"`);
    }

    if((key.trim() == "") || (secret.trim() == "")){
      throw new Error(`Empty key or secret for Woocomerce. key is: "${key}" and secret is: "${secret}"`);
    }

    this.woocomerce = {
      configured: true,
      apiKey: key.trim(),
      apiSecret: secret.trim()
    }
    return true;
  }

}
