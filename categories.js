const Excel = require('exceljs');

module.exports = {
  readCategoriesFromFile: function(callback) {
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile("CategoriesAll.xlsx")
      .then(function() {
        const categoriesSheet = workbook.getWorksheet("Categories");
        const categories = [];
        categoriesSheet.eachRow(function(row, rowNumber) {
          categories.push({id: row.values[1], name: row.values[2], parent_id: row.values[6]});
        });
        callback(null, null, categories);
      });
  },

  findCategoriesByParentIds: (parentIds, categories) => {
    return categories.filter(category => {
      return parentIds.indexOf(category.parent_id) !== -1;
    });
  },

  findById: (id, categories) => {
    return categories.find(category => category.id === id);
  },

  findCategoryByParentNameAndCategoryName: function(parentName, categoryName, categories) {
    categories.filter(category => {
      return category.parentName === parentName && category.name === categoryName;
    });
  }
};