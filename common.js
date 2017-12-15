const xls = require("./xls");
const db = require("./db");
const Categories = require("./categories");
const utils = require("./utils");

function removeSpaces(str) {
  return (str+'').replace(/\s/g, '');
}

module.exports = {
  getProducts: function(type) {
    db.getProducts(type, function(error, dbProducts) {
      if (error) {throw error;}
      Categories.readCategoriesFromFile(function(err, categoriesResult, categoriesArray) {
        console.log("dbProducts", dbProducts);

        const products = [];
        let idCnt = 1;
        if (type === "accessory") {
          idCnt = 1000;
        }
        for (let i=0; i < dbProducts.length; i++) {
          const parentCategory = categoriesArray.find(function(item) {
            return removeSpaces(item.name) === removeSpaces(dbProducts[i].type_name);
          });
          console.log("parentCategory", parentCategory);
          const category = categoriesArray.find(function(item) {
            return removeSpaces(item.name) === removeSpaces(dbProducts[i].manufacturer) && parentCategory.id === item.parent_id;
          });
          console.log("category", category);
          const product = {stores: 0, quantity: 1, status: 'Enabled', attributes: []};

          const date = new Date(dbProducts[i].pdt_lastavail);
          product.date_available = utils.formatDate(date);
          product.description = dbProducts[i].ps_descr;
          product.image = `catalog/${dbProducts[i].ps_bigFile}`;
          product.name = dbProducts[i].name;
          product.model = dbProducts[i].name;
          product.manufacturer = dbProducts[i].manufacturer;
          product.categories = category.id+","+parentCategory.id;
          product.price = dbProducts[i].price;
          product.product_id = idCnt++;
          products.push(product);
        }
        console.log("products", products);

        xls.createFile(type, products);
      });
    });
  }
};