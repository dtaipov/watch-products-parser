const fs = require('fs');
const db = require('./db');
const Categories = require('./categories');
const PREFIX = "oc_";
//const PREFIX = "oc1_";

/*function writeToFile(fileName, callback) {
  const stream = fs.createWriteStream("Preparation.sql");
  stream.once('open', function(fd) {
    stream.write(`delete from ${PREFIX}attribute_group where attribute_group_id>0;\n`);
    stream.write(`delete from ${PREFIX}attribute_group_description where attribute_group_id>0;\n`);
    stream.write(`delete from ${PREFIX}attribute_description where attribute_id>0;\n`);
    stream.write(`delete from ${PREFIX}attribute where attribute_id>0;\n`);

    stream.write(`delete from ${PREFIX}manufacturer where manufacturer_id>0;\n`);
    stream.write(`delete from ${PREFIX}manufacturer_description where manufacturer_id>0;\n`);
    stream.write(`delete from ${PREFIX}manufacturer_to_store where manufacturer_id>0;\n`);

    stream.write(`delete from ${PREFIX}product where product_id > 0;\n`);
    stream.write(`delete from ${PREFIX}product_to_store where product_id > 0;\n`);
    stream.write(`delete from ${PREFIX}product_description where product_id > 0;\n`);
    stream.write(`delete from ${PREFIX}product_to_category where product_id > 0;\n`);
  });
  stream.end();
  console.log(`Writing ${fileName} done`);
}*/

function doubleQuotes(str) {
  return (str+'').replace(/'/g, "''").replace(/"/g, '""');
}

module.exports = {

  createProductsFile: function(fileName, products) {
    const stream = fs.createWriteStream(fileName + "_Products.sql");
    stream.once('open', function(fd) {
      Categories.readCategoriesFromFile(function(err, categoriesResult, categoriesArray) {
      stream.write(`delete from ${PREFIX}product where product_id > 0;\n`);
      stream.write(`delete from ${PREFIX}product_to_store where product_id > 0;\n`);
      stream.write(`delete from ${PREFIX}product_description where product_id > 0;\n`);
      stream.write(`delete from ${PREFIX}product_to_category where product_id > 0;\n`);

      for (let i = 0; i < products.length; i++) {
        stream.write(`insert into ${PREFIX}product(product_id,model,quantity,stock_status_id,image,manufacturer_id,shipping,price,points,tax_class_id,date_available,weight,weight_class_id,length,width,height,length_class_id,subtract,minimum,sort_order,status,viewed,date_added) values (${products[i].product_id},'${products[i].name}',1,0,'${products[i].image}',${products[i].manufacturer_id},0,${products[i].price},0,0,'${products[i].date_available}',0,0,0,0,0,0,0,0,0,${products[i].pi_show},0,now());\n`);
        stream.write(`insert into ${PREFIX}product_to_category (product_id, category_id, main_category) values (${products[i].product_id}, ${products[i].category_id}, 1);\n`);
        stream.write(`insert into ${PREFIX}product_to_category (product_id, category_id, main_category) values (${products[i].product_id}, ${products[i].manufacturer_id}, 0);\n`);
        const category = Categories.findById(products[i].manufacturer_id, categoriesArray);
        stream.write(`insert into ${PREFIX}product_to_category (product_id, category_id, main_category) values (${products[i].product_id}, ${category.parent_id}, 0);\n`);
        if (category.parent_id !== 34) {
          stream.write(`insert into ${PREFIX}product_to_category (product_id, category_id, main_category) values (${products[i].product_id}, 34, 0);\n`);
        }
        stream.write(`insert into ${PREFIX}product_to_store (product_id, store_id) values (${products[i].product_id}, 0);\n`);
        stream.write(`insert into ${PREFIX}product_description (product_id, language_id, name, description) values (${products[i].product_id}, 1, '${products[i].name}', '${doubleQuotes(products[i].description)}');\n
        insert into ${PREFIX}product_description (product_id, language_id, name, description) values (${products[i].product_id}, 2, '${products[i].name}', '');\n`);
      }

      stream.end();
      console.log("Writing Products done");
    });
    });

  },

  createCategoriesFile: function() {
    db.getCategories(function() {
      const stream = fs.createWriteStream("Categories.sql");
      const catColumns = "(category_id,image,parent_id,top,column,sort_order,status,date_added,date_modified)";
      const catDescriptionColumns = "(category_id,language_id,name,description,meta_title,meta_h1,meta_description,meta_keyword)";
      stream.once('open', function(fd) {
        stream.write(`insert into ${PREFIX}category ${catColumns} values (1,null,0,1,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (1,0,'Аксессуары',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (2,null,1,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (2,1,'Боксы для подзавода часов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (3,null,1,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (3,1,'Шкатулки для украшений',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (4,null,1,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (4,1,'Шкатулки для часов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (5,null,2,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (5,1,'Для 1 часов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (6,null,2,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (6,1,'Для 2 часов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (7,null,2,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (7,1,'Для 3-4 часов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (8,null,2,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (8,1,'Для 5-6 часов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (9,null,2,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (9,1,'Для 7 и более часов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (10,null,3,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (10,1,'Для драгоценностей',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (11,null,3,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (11,1,'Для запонок',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (12,null,3,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (12,1,'Для очков',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (13,null,3,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (13,1,'Для шармов',null,null,null,null,null);`);
        stream.write(`insert into ${PREFIX}category ${catColumns} values (14,null,3,0,1,1,1,now(),now());`);
        stream.write(`insert into ${PREFIX}category_description ${catDescriptionColumns} values (14,1,'Несессеры',null,null,null,null,null);`);
      });
    })
  },

  createAttributesFile: function() {
    db.getAttributes("watches", function(err, attributes) {
      const stream = fs.createWriteStream("Attributes.sql");
      stream.once('open', function(fd) {
        stream.write(`delete from ${PREFIX}product_attribute where product_id >= 0;\n`);
        for (let i = 0; i < attributes.length; i++) {
          const a = attributes[i];
          stream.write(`insert into ${PREFIX}product_attribute (product_id, attribute_id, language_id, text) values (${a.product_id},${a.fid},1,'${a.value}');\n`);
        }
        stream.end();
        console.log("Writing attributes done");
      });
    })
  },

  createSexAttributesFile: function() {
    db.getSexAttributes(function(err, attributes) {
      const stream = fs.createWriteStream("AttributesSex.sql");
      stream.once('open', function(fd) {
        stream.write(`delete from ${PREFIX}product_attribute where product_id >= 0 and attribute_id=45;\n`);
        for (let i = 0; i < attributes.length; i++) {
          const a = attributes[i];
          stream.write(`insert into ${PREFIX}product_attribute (product_id, attribute_id, language_id, text) values (${a.product_id},45,1,'${a.value}');\n`);
        }
        stream.end();
        console.log("Writing attributes sex done");
      });
    })
  },

  createAttributeNamesFile: function() {
    db.getAttributesNames((err, attributeNames) => {
      const stream = fs.createWriteStream("AttributeNames.sql");
      stream.once('open', function(fd) {
        stream.write(`delete from ${PREFIX}attribute_group where attribute_group_id>0;\n`);
        stream.write(`delete from ${PREFIX}attribute_group_description where attribute_group_id>0;\n`);
        stream.write(`delete from ${PREFIX}attribute_description where attribute_id>0;\n`);
        stream.write(`delete from ${PREFIX}attribute where attribute_id>0;\n`);

        stream.write(`insert into ${PREFIX}attribute_group (attribute_group_id, sort_order) values (1, 0);\n`);
        stream.write(`insert into ${PREFIX}attribute_group (attribute_group_id, sort_order) values (2, 0);\n`);
        stream.write(`insert into ${PREFIX}attribute_group (attribute_group_id, sort_order) values (3, 0);\n`);
        stream.write(`insert into ${PREFIX}attribute_group_description (attribute_group_id, language_id, name) values (1,1,'Наручные часы');\n`);
        stream.write(`insert into ${PREFIX}attribute_group_description (attribute_group_id, language_id, name) values (2,1,'Интерьерные часы');\n`);
        stream.write(`insert into ${PREFIX}attribute_group_description (attribute_group_id, language_id, name) values (3,1,'Аксессуары');\n`);

        for (let i = 0; i < attributeNames.length; i++) {
          const a = attributeNames[i];
          stream.write(`insert into ${PREFIX}attribute (attribute_id, attribute_group_id, sort_order) values (${a.id}, 1, 0);\n`);
          stream.write(`insert into ${PREFIX}attribute_description (attribute_id, language_id, name) values (${a.id},1,'${a.name}');\n`);
        }
        stream.write(`insert into ${PREFIX}attribute (attribute_id, attribute_group_id, sort_order) values (45,1,0);\n`);
        stream.write(`insert into ${PREFIX}attribute_description (attribute_id, language_id, name) values (45,1,'Пол');\n`);
        stream.end();
        console.log("Writing attributeNames done");
        });
    });
  },

  createManufacturersFile: function() {
    db.getManufacturers((err, manufacturers) => {
      const stream = fs.createWriteStream("Manufacturers.sql");
      stream.once("open", function(fd) {
        stream.write(`delete from ${PREFIX}manufacturer where manufacturer_id>0;\n`);
        stream.write(`delete from ${PREFIX}manufacturer_description where manufacturer_id>0;\n`);
        stream.write(`delete from ${PREFIX}manufacturer_to_store where manufacturer_id>0;\n`);

        for (let i = 0; i < manufacturers.length; i++) {
          const m = manufacturers[i];
          stream.write(`insert into ${PREFIX}manufacturer(manufacturer_id,name,image,sort_order)values (${m.id},"${m.name}","${m.image}",0);\n`);
          stream.write(`insert into ${PREFIX}manufacturer_description (manufacturer_id, language_id, name) values (${m.id},1,"${m.name}");\n`);
          stream.write(`insert into ${PREFIX}manufacturer_to_store (manufacturer_id, store_id) values (${m.id}, 0);\n`);
        }
        stream.end();
        console.log("Writing manufacturers done");
      });
    });
  }
};
