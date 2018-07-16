const Shared = require("./shared.js");


Shared.loadExternalCategoriesIds("shopify")
.then(cats => console.log("cats: ", cats))
.catch(err => console.log("err: ", err));
