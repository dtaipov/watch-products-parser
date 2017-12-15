const Excel = require('exceljs');
const productsParser = require("./productsParser");

function findAttributesByProductId(id, attributes) {
  return attributes.filter(function(item) {
    return item.id === id;
  });
}

function readProductsFromFile (fileName, callback) {
  const workbook = new Excel.Workbook();
  workbook.xlsx.readFile(fileName)
    .then(function () {
      const attributeSheet = workbook.getWorksheet("Attribute");
      const attributes = [];
      attributeSheet.eachRow(function (row, rowNumber) {
        if(rowNumber !== 1) {
          attributes.push({
            id: row.values[1],
            name: row.values[2].split(">")[1].trim(),
            value: row.values[3]
          });
        }
      });

      const productsSheet = workbook.getWorksheet("Products");
      const products = [];
      productsSheet.eachRow(function (row, rowNumber) {
        if(rowNumber !== 1) {
          products.push({
            product_id: row.values[1],
            name: row.values[2],
            model: row.values[3],
            sku: row.values[4],
            description: row.values[5],
            meta_tag_description: row.values[6],
            meta_tag_keywords: row.values[7],
            tags: row.values[8],
            upc: row.values[9],
            ean: row.values[10],
            jan: row.values[11],
            isbn: row.values[12],
            mpn: row.values[13],
            price: row.values[14],
            location: row.values[15],
            status: row.values[16],
            tax_class: row.values[17],
            quantity: row.values[18],
            minimum_quantity: row.values[19],
            image: row.values[20],
            subtract_stock: row.values[21],
            out_of_stock_status: row.values[22],
            requires_shipping: row.values[23],
            seo_keyword: row.values[24],
            date_available: row.values[25],
            length: row.values[26],
            width: row.values[27],
            height: row.values[28],
            length_class: row.values[29],
            weight: row.values[30],
            weight_class: row.values[31],
            sort_order: row.values[32],
            reward_points: row.values[33],
            manufacturer: row.values[34],
            categories: row.values[35],
            filters: row.values[36],
            stores: row.values[37],
            downloads: row.values[38],
            related_products: row.values[39],
            meta_title: row.values[40],
            attributes: findAttributesByProductId(row.values[1], attributes)
          });
        }
      });

      callback(null, products);
    });
}

module.exports = self = {
  readProductsFromFile: function(fileName, callback) {
    readProductsFromFile(fileName, callback);
  },

  parseProducts: (collection, categories, dbProducts, type, callback) => {
    productsParser.parse(collection, categories, type, (err, products) => {
      const productsNotFound = [];
      productsParser.addFieldsFormDB(products, dbProducts, productsNotFound);
      console.log("PRODUCTS", products);
      console.log("PRODUCTS NOT FOUND", productsNotFound);
      callback(null, products);
    });
  },

  readProductsFromFiles: function(callback) {
    let productsAll = [];
    readProductsFromFile("Детские часы_Products.xlsx", function(err, products) {
      productsAll = productsAll.concat(products);
      console.log("productsAll", productsAll.length);
      readProductsFromFile("Европейские часы_Products.xlsx", function(err, products) {
        productsAll = productsAll.concat(products);
        console.log("productsAll", productsAll.length);
        readProductsFromFile("Остальной мир_Products.xlsx", function(err, products) {
          productsAll = productsAll.concat(products);
          console.log("productsAll", productsAll.length);
          readProductsFromFile("Российские часы_Products.xlsx", function(err, products) {
            productsAll = productsAll.concat(products);
            console.log("productsAll", productsAll.length);
            readProductsFromFile("Умные часы_Products.xlsx", function(err, products) {
              productsAll = productsAll.concat(products);
              console.log("productsAll", productsAll.length);
              readProductsFromFile("Швейцарские часы_ProductsPart1.xlsx", function(err, products) {
                productsAll = productsAll.concat(products);
                console.log("productsAll", productsAll.length);
                readProductsFromFile("Швейцарские часы_ProductsPart2.xlsx", function(err, products) {
                  productsAll = productsAll.concat(products);
                  //console.log("productsAll", productsAll.length);
                  callback(null, productsAll);
                })
              })
            })
          })
        })
      })
    })
  }
};