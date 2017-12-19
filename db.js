const utils = require("./utils");
const mysql = require('mysql');

function getResult(selectQuery, callback) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin1',
    database: 'iwatch1'
  });

  connection.connect();

  connection.query(selectQuery, function (error, results, fields) {
    if (error)  {
      console.log("Error execution query", error);
    }
    callback(error, results);
  });
  connection.end();
}

module.exports = {
  getProducts: (type, callback) => {
    let selectQuery;
    if (type === "watches") {
      selectQuery = 'SELECT ' +
        'i.wid id, i.pi_mark type, i.ps_Name name, i.pi_price price, i.pdt_lastavail, ' +
        'i.ps_bigFile, i.pictureBig1, i.ps_descr, t.ps_Name manufacturer, ' +
        'i.pi_mark+42 parent_id, i.pi_col+346 category_id ' +
        'from gr_watch i, gr_mark t, gr_collection ic ' +
        'where i.pi_col=ic.id and i.pi_mark=t.id and t.id=3';
    } else if (type === "interior") {
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

    getResult(selectQuery, callback);
  },

  getAttributes: (type, callback) => {
    if (type !== "watches") {
      return callback(null, []);
    }
    let selectQuery = "SELECT v.wid as product_id, v.fsid as fsid,\n" +
      "  \t\ts.fid as fid,\n" +
      "  \t\tf.ps_Display as name,\n" +
      "  \t\ts.ps_Display as value\n" +
      "     \tFROM iwatch1.gr_feature_value AS v,\n" +
      "     \t  iwatch1.gr_feature_space AS s,\n" +
      "     \t  iwatch1.gr_feature AS f\n" +
      "     \tWHERE v.fsid = s.fsid AND s.fid = f.fid";
    //v.wid=" + productId + " AND
    getResult(selectQuery, callback);
  }
};