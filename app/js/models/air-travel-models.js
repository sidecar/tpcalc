'use strict';
var _ = require('underscore')
, Backbone = require('backbone');

var Flight = Backbone.Model.extend({
  defaults: {
    roundTrip: true,
  },
  calculateDistance: function(event) {
    var airports = require('../utils/airports');
    var fromLatitude = this.get('fromLatitude');
    var fromLongitude = this.get('fromLongitude');
    var toLatitude = this.get('toLatitude');
    var toLongitude = this.get('toLongitude');
    var getGeoDistance = require('geodist');
    var between = getGeoDistance(
      {lon: fromLongitude, lat: fromLatitude},
      {lon: toLongitude, lat: toLatitude},
      {unit: 'mi'}
    );
    var multiplier = (this.get('roundTrip') === 'true') ? 2 : 1; 
    var distance = between*multiplier;
    this.set({distance: distance});
  }, // end caculateDistance
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    return json;
  }
}); // end Flight

module.exports.flight = Flight;

var Flights = Backbone.Collection.extend({
  model: Flight,
  totalEmissions: 0,
    initialize: function() {
        this.bind('add', this.calculateTotalDistance, this);
        this.bind('remove', this.calculateTotalDistance, this);
    },
    calculateTotalDistance: function() {
        var distance = 0;
        this.models.forEach(function(item){
            distance += item.get('distance'); 
        });
        this.distance = distance;
    },
    getTotalDistance: function() {
        return this.distance;
    }
});
module.exports.flights = Flights;