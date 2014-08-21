var zips = require('./zip-subregions');

module.exports.zip = function(str) {
  if(!str || str == '' || str.match(/^\d{5}(-\d{4})?$/) == null || !zips[str.slice(0,6)]) return false;
    return true;
}