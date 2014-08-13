'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, Qty = require('js-quantities')
, utils = require('../utils/utility');

var FleetVehicle = Backbone.Model.extend({
  defaults: {
    totalEmissions: 0,
    fuelType: 'gasoline',
    annMiles: 0,
    numVehicles: 0,
  },
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    return json;
  },
  initialize: function() {
    this.on('change', this.calculateEmissions, this);
  },
  calculateEmissions: function() {
    var fleet = require('../utils/biz-fleet-emissions');
    fleet.vehicleType = this.get('vehicleType');
    fleet.vehicleCount = this.get('vehicleCount');
    fleet.annMiles = this.get('annMiles');
    fleet.fuel = this.get('fuelType');
    fleet.boatGallons = this.get('fuelQty'); // only set for boats
    fleet.zipCode = this.get('zip'); // only set for ecars
    var totalEmissions = fleet.totalEmissions(this.get('vehicleType'));
    this.set({totalEmissions: totalEmissions});
  },
  getTotalEmissions: function() {
    return this.get('totalEmissions');
  }
});

module.exports.fleetVehicle = FleetVehicle;

var FleetVehicles = Backbone.Collection.extend({
  model: FleetVehicle,
  totalEmissions: 0,
  initialize: function() {
    this.bind('add', this.calculateEmissions, this);
  },
  calculateEmissions: function() {
    var total = 0;
    this.models.forEach(function(item){
      total += item.getTotalEmissions(); 
    });
    this.totalEmissions = total;
  },
  getTotalEmissions: function() {
    return this.totalEmissions;
  }
});
module.exports.fleetVehicles = FleetVehicles;