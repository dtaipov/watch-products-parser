const async = require('async');
const xls = require("./xls");
const db = require("./db");
const Categories = require("./categories");
const Products = require("./products");

const Common = require("./common");

Common.getProducts("watches");

/*const START_CATEGORY_ID = 41;

db.getProducts("watches", function(error, results) {
  const dbProducts = utils.toMappedArray(results, "id");
  if (error) {throw error;}
  Categories.readCategoriesFromFile(function(err, categoriesResult, categoriesArray) {

    let manufacturers = Categories.findCategoriesByParentIds([START_CATEGORY_ID], categoriesArray).map(function(item) {
      return item.id;
    });
    console.log("MANUFACTURERS", manufacturers);
    //manufacturers = [47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77];
    //manufacturers = [78,79,80,81,82,83,84,85,86,87,88,89];

    const collections = Categories.findCategoriesByParentIds(manufacturers, categoriesArray);
    console.log("COLLECTIONS", collections);

    async.concatSeries(collections, function(collection, callback) {
      Products.parseProducts(collection, categoriesArray, dbProducts, 'watches', function(err, products) {
        callback(err, products);
      })
    },

    function(err, result) {
      console.log("RESULT", result);
      const startCategory = Categories.findById(START_CATEGORY_ID, categoriesArray);
      xls.createFile(startCategory.name, result);
    });

  });

});*/
