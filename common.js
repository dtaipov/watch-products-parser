const xls = require("./xls");
const sqlFile = require("./sqlFile");
const db = require("./db");
const Categories = require("./categories");
const utils = require("./utils");

function removeSpaces(str) {
  return (str+'').replace(/\s/g, '');
}

module.exports = {
  getProducts: (type, callback) => {
    db.getProducts(type, function(error, dbProducts) {
      if (error) {throw error;}
      //db.getAttributes(type, function(error, dbAttributes) {
      //Categories.readCategoriesFromFile(function(err, categoriesResult, categoriesArray) {
        const products = [];
        let idCnt = 1;
        if (type === "accessory") {
          idCnt = 1000;
        }
        for (let i=0; i < dbProducts.length; i++) {
          const product = {stores: 0, quantity: 1, status: 'Enabled', attributes: []};

          const date = new Date(dbProducts[i].pdt_lastavail);
          product.date_available = utils.formatDate(date);
          product.description = dbProducts[i].ps_descr;
          product.image = `catalog/${dbProducts[i].ps_bigFile}`;
          product.name = dbProducts[i].name;
          product.model = dbProducts[i].name;
          product.manufacturer = dbProducts[i].manufacturer;
          product.manufacturer_id = dbProducts[i].parent_id;
          product.categories = dbProducts[i].category_id+","+dbProducts[i].parent_id;
          product.category_id = dbProducts[i].category_id;
          product.price = dbProducts[i].price;
          product.pi_show = dbProducts[i].pi_show;
          if (type === "watches") {
            product.product_id = dbProducts[i].id;
          } else {
            product.product_id = idCnt++;
          }
          /*product.attributes = dbAttributes.filter(function(item) {
            return item.product_id === product.product_id;
          });*/
          products.push(product);
        }
        //console.log("products", products);
        return callback(null, products);
        /*const chunkSize = 5000;
        for (let i=0; i<products.length; i+=chunkSize) {
          const productsChunk = products.slice(i, i+chunkSize);
          xls.createFile(type + i + "-" + (i+chunkSize), productsChunk);
        }*/

     // });
      //});
    });
  }
};