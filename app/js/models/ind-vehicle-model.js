"use strict";
var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    vehicleType: 'car', //fueleconomy.gov and map
    year: 2013, //user entered
    make: 'Select a year', //user entered
    model: 'Select a make', //user entered
    mileage: 10000, //user entered
    mpg: 20, //will come from fueleconomy.gov
    fuelType: 'gas', //?!?!
    vehicleClass: 'car' //fueleconomy.gov and map
  }
});