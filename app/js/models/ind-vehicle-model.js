var $ = require('jquery')
, _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('../app');

module.exports = Backbone.Model.extend({
  defaults: {
    year: 2013, //user entered
    make: 'Select a year', //user entered
    model: 'Select a make', //user entered
    mileage: 10000, //user entered
    mpg: 20, //will come from fueleconomy.gov
    fuelType: 'gas', //?!?!
    vehicleClass: 'car' //fueleconomy.gov and map
  }
});