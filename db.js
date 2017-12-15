const utils = require("./utils");
const mysql = require('mysql');

module.exports = {
  getProducts: (type, callback) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin1',
      database: 'iwatch1'
    });

    connection.connect();

    let selectQuery = 'SELECT wid id, pdt_lastavail, ps_bigFile, pictureBig1, ps_descr from gr_watch';
    if (type === "interior") {
      selectQuery = 'SELECT ' +
        'i.aid id, i.type, i.name, i.pi_price price, i.pdt_lastavail,' +
        'i.ps_bigFile, i.ps_bigFile pictureBig1, i.description ps_descr, ic.display manufacturer, t.display type_name FROM ' +
        'iwatch1.interior i, iwatch1.interior_category ic, iwatch1.interior_type t ' +
        'where i.type in (33, 35, 36, 37) ' +
        'and i.pi_show=1 and i.acid = ic.acid and i.type=t.id'
    } else if (type === "accessory") {
      selectQuery = 'SELECT ' +
        'i.aid id, i.type, i.name, i.pi_price price, i.pdt_lastavail,' +
        'i.ps_bigFile, i.ps_bigFile pictureBig1, i.description ps_descr, ic.display manufacturer, t.display type_name FROM ' +
        'iwatch1.accessory i, iwatch1.accessory_category ic, iwatch1.accessory_type t ' +
        'where i.type in (30,31,32) ' +
        'and i.pi_show=1 and i.acid = ic.acid and i.type=t.id';
    }

    connection.query(selectQuery, function (error, results, fields) {
      if (error)  {
        console.log("Error execution query", error);
      }
      callback(error, results);
    });
    connection.end();
  }
};