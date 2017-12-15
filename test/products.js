//const expect = require("chai").expect;
const products = require("../products");
const xls = require("../xls");

describe('Products', function() {
  /*it('should execute readProductsFromFile method', function() {
    products.readProductsFromFile(function(err, products) {
      console.log(products);
    })
  });*/

  it('should execute readProductsFromFile method', function() {
    products.readProductsFromFiles(function(err, products) {
      console.log(products);
      xls.createFile("WatchesAll", products);
    })
  })
});