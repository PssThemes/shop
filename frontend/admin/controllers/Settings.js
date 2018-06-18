export default class Settings {

  constructor(settingsData){

    this.shopify = {
      configured: settingsData.shopify.configured || false,
      apiKey: settingsData.shopify.apiKey | "",
      apiSecret: settingsData.shopify.apiSecret | ""
    }

    this.magento = {
      configured: settingsData.magento.configured || false,
      apiKey: settingsData.magento.apiKey | "",
      apiSecret: settingsData.magento.apiSecret | ""
    }

    this.woocomerce = {
      configured: settingsData.woocomerce.configured || false,
      apiKey: settingsData.woocomerce.apiKey | "",
      apiSecret: settingsData.woocomerce.apiSecret | ""
    }

  }


}
