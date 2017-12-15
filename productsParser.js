const Iconv = require('iconv').Iconv;
const fromEnc = 'cp1251';
const toEnc = 'utf-8';
const translator = new Iconv(fromEnc,toEnc);
const cheerio = require("cheerio");
const request = require("request");
const utils = require("./utils");

module.exports = {

  parse: function(collection, categories, type, callback) {
    const url = utils.getUrl(type, categories, collection);
    console.log("URL", url);
  request({
            url,
            encoding:null
          },
  function (err, vres, body) {
    const translatedBody = translator.convert(body).toString();
    if (err) {
      console.log(err);
      return callback(err);
    }
    $ = cheerio.load(translatedBody);
    const products = [];
    const modelsText = $('h3 + table tr:first-child td.menuItem').text().split(":")[1].trim();
    const modelsCount = parseInt(modelsText);

    $('table.tableBottomSpacing').each(function () {
      const product = {stores: 0, quantity: 1, status: 'Enabled', attributes: []};
      $(this).find("tr:first-child td:first-child a").each(function () {
        let href = $(this).attr("href");
        if (href.startsWith("/index.php")) {
          const array = href.split("&");
          product.product_id = array[2].split("=")[1];
        }
        if (href.startsWith("/?section=")) { // для interior
          const array = href.split("&");
          product.product_id = array[1].split("=")[1];
        }

        /*$(this).find("img").each(function () {
          let imgSrc = $(this).attr("src");
          if (imgSrc.indexOf("Button_buy") === -1) {
            product.image = imgSrc;
          }
        });*/
      });

      $(this).find(".menuItem").each(function () {
        let txt = $(this).text();
        if (txt.indexOf("Модель") !== -1) {
          txt = txt.substring("Модель".length).trim();
          product.model = txt;
          product.name = txt;
        } else if (txt.indexOf("Торговая марка") !== -1) {
          txt = txt.substring("Торговая марка".length).trim();
          product.manufacturer = txt;
        } else if (txt.indexOf("Коллекция") !== -1) {
          txt = txt.substring("Коллекция".length).trim();
          product.categories = collection.id;//categories[product.manufacturer+"-"+txt].id;
        }
        else {
          $(this).find("a img").each(function () {
            let attributeString = $(this).attr("title");
            if (!attributeString) { // на сайте для атрибута "Скелетон" нет title
              product.attributes.push({name: "Скелетон", value: "да"})
            } else {
              const arr = attributeString.split(":");
              product.attributes.push({name: arr[0].trim(), value: arr[1].trim()});
            }
          });
          $(this).find("span.price").each(function () {
            let priceString = $(this).text();
            priceString = priceString.replace("руб.", "").replace(" ", "").trim();
            product.price = priceString;
          });
        }
      });
      if (product.product_id) {
        products.push(product)
      }
    });
    console.log("PRODUCTS!!!", products);
    callback(null, products);
  });
  },

  addFieldsFormDB: function(products, dbProducts, productsNotFound) {
    for (let i=0; i<products.length; i++) {
      console.log("products[i]", products[i]);
      const dbProduct = dbProducts[products[i].product_id];
      if (!dbProduct) {
        productsNotFound.push(products[i].product_id);
        continue;
      }
      const date = new Date(dbProduct.pdt_lastavail);
      products[i].date_available = utils.formatDate(date);
      products[i].description = dbProduct.ps_descr;
      products[i].image = `catalog/${products[i].manufacturer}/${dbProduct.ps_bigFile}`;
    }
  }
};