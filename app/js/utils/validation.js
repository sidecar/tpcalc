var zips = require('./zip-subregions');

module.exports.zip = function(str) {
  if(!str || str === '' || str.match(/^\d{5}(-\d{4})?$/) === null || !zips[str.slice(0,6)]) return false;
    return true;
}

module.exports.isDigit = function(str) {
  if(!str || str === '' || str.match(/^\d+$/) === null) return false;
    return true;
}

module.exports.hasValue = function(str) {
  if(!str || str === '') return false;
    return true;
}