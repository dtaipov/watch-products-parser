//const expect = require("chai").expect;
const categories = require("../categories");

describe('Categories', function() {
  /*it('should execute findCategoriesByParentId method', function () {
    categories.readCategoriesFromFile(function(err, categoriesResult, categoriesArray) {
      const result = categories.findCategoriesByParentId(42, categoriesArray);
    })
  });*/

  it('should execute findNameById method', function() {
    categories.readCategoriesFromFile(function(err, categoriesResult, categoriesArray) {
      categories.findById(47, categoriesArray);
    })
  })
});