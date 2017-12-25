const categoriesLib = require("./categories");

function replaceSpacesWithUnderscore(str) {
  return (str+'').replace(/\s/g, '_');
}

function replaceSpacesWithPercent20(str) {
  return (str+'').replace(/\s/g, '%20');
}

const collectionIdToSectionAndATID = {
  "22":	{name: "Будильники", atid: 36},
  "23":	{name: "Напольные часы", atid: 37},
  "24":	{name: "Настенные часы", atid: 33},
  "25":	{name: "Настольные часы", atid: 35}
};

module.exports = {

  toMappedArray: function(arr, filedToMap) {
    const newArr = {};
    arr.forEach(function (obj) {
      newArr[obj[filedToMap]] = obj;
    });
    return newArr;
  },

  getUrl: (type, categories, collection) => {
    if (type === "watches") {
      const parent = categoriesLib.findById(collection.parent_id, categories);
      console.log("PARENT", parent);
      console.log("COLLECTION", collection);
      let parentName = replaceSpacesWithPercent20(parent.name);
      let collectionName = replaceSpacesWithUnderscore(collection.name);
      return `http://i-watch.ru/catalog/watches/${parentName}/${collectionName}/collection.html`;
    } else if (type==="interior") {
      const atid = collectionIdToSectionAndATID[collection.id+""].atid;
      return "http://i-watch.ru/?section=19&atid=" + atid;
    }
  },

  formatDate: (date) => {
    if (!date || isNaN(date.getFullYear()) || isNaN(date.getMonth()) || isNaN(date.getDate())) {
      return null;
    }
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
};