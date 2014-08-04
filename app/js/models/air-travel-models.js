'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, LocalStorage = require('backbone.Localstorage');

var Flight = Backbone.Model.extend({
  defaults: {
    roundTrip: true,
  }
});

module.exports.flight = Flight;

var Flights = Backbone.Collection.extend({
  model: Flight,
  localStorage: new LocalStorage("FlightssCollection")
});
module.exports.flights = Flights;