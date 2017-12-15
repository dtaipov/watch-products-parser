const Excel = require('exceljs');

function createAndFillWorkbook(products) {
  const workbook = new Excel.Workbook();
  const productsSheet = workbook.addWorksheet('Products');
  productsSheet.columns = [
    {header: 'Product ID', key: 'product_id', width: 10},
    {header: 'Name', key: 'name', width: 32},
    {header: 'Model', key: 'model', width: 32},
    {header: 'SKU', key: 'sku', width: 32},
    {header: 'Description', key: 'description', width: 32},
    {header: 'Meta Tag Description', key: 'meta_tag_description', width: 32},
    {header: 'Meta Tag Keywords', key: 'meta_tag_keywords', width: 32},
    {header: 'Tags', key: 'tags', width: 32},
    {header: 'UPC', key: 'upc', width: 32},
    {header: 'EAN', key: 'ean', width: 32},
    {header: 'JAN', key: 'jan', width: 32},
    {header: 'ISBN', key: 'isbn', width: 32},
    {header: 'MPN', key: 'mpn', width: 32},
    {header: 'Price', key: 'price', width: 32},
    {header: 'Location', key: 'location', width: 32},
    {header: 'Status', key: 'status', width: 32},
    {header: 'Tax Class', key: 'tax_class', width: 32},
    {header: 'Quantity', key: 'quantity', width: 32},
    {header: 'Minimum Quantity', key: 'minimum_quantity', width: 32},
    {header: 'Image', key: 'image', width: 32},
    {header: 'Subtract Stock', key: 'subtract_stock', width: 32},
    {header: 'Out Of Stock Status', key: 'out_of_stock_status', width: 32},
    {header: 'Requires Shipping', key: 'requires_shipping', width: 32},
    {header: 'SEO Keyword', key: 'seo_keyword', width: 32},
    {header: 'Date Available', key: 'date_available', width: 32},
    {header: 'Length', key: 'length', width: 32},
    {header: 'Width', key: 'width', width: 32},
    {header: 'Height', key: 'height', width: 32},
    {header: 'Length Class', key: 'length_class', width: 32},
    {header: 'Weight', key: 'weight', width: 32},
    {header: 'Weight Class', key: 'weight_class', width: 32},
    {header: 'Sort Order', key: 'sort_order', width: 32},
    {header: 'Reward Points', key: 'reward_points', width: 32},
    {header: 'Manufacturer', key: 'manufacturer', width: 32},
    {header: 'Categories', key: 'categories', width: 32},
    {header: 'Filters', key: 'filters', width: 32},
    {header: 'Stores', key: 'stores', width: 32},
    {header: 'Downloads', key: 'downloads', width: 32},
    {header: 'Related Products', key: 'related_products', width: 32},
    {header: 'Meta Title', key: 'meta_title', width: 32},
  ];

  productsSheet.addRows(products);

  const attributesSheet = workbook.addWorksheet('Attribute');
  attributesSheet.columns = [
    {header: 'Product ID', key: 'product_id', width: 10},
    {header: 'Attribute', key: 'attribute', width: 32},
    {header: 'Text', key: 'text', width: 32}
  ];

  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < products[i].attributes.length; j++) {
      attributesSheet.addRow({
        product_id: products[i].product_id,
        attribute: "Наручные часы  >  " + products[i].attributes[j].name, // TODO группа Наручные часы подходит только для Watches
        text: products[i].attributes[j].value
      });
    }
  }

  return workbook;
}

module.exports = {

  createFile: function(manufacturer, products) {
    const workbook = createAndFillWorkbook(products);
    workbook.xlsx.writeFile(`${manufacturer}_Products.xlsx`)
      .then(function () {
        console.log("Writing done");
      });
  }
};