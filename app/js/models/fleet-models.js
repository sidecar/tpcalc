'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, Qty = require('js-quantities')
, utils = require('../utils/utility');

var FleetVehicle = Backbone.Model.extend({
  defaults: {
    totalEmissions: 0,
    fuelType: '', //this has to be empty bc different options avail on different views
    annMiles: 0,
    numVehicles: 0,
    useRFI: 'false'
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

    var vehicleType = this.get('vehicleType')
    , vehicleCount = this.get('vehicleCount')
    , annMiles = this.get('annMiles')
    , fuel = this.get('fuelType')
    , boatGallons = this.get('fuelQty') // only set for boats
    , zipCode = this.get('zip') // only set for ecars
 
    if(vehicleType === 'ecar') {if(!zipCode) return;}
    var fleet = require('../utils/biz-fleet-emissions');
    fleet.vehicleType = vehicleType;
    fleet.vehicleCount = vehicleCount;
    fleet.annMiles = annMiles;
    fleet.fuel = fuel;
    fleet.boatGallons = boatGallons;
    fleet.zipCode = zipCode;
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