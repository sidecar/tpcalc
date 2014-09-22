'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, utils = require('../utils/utility');

var FleetVehicle = Backbone.Model.extend({
  defaults: {
    totalEmissions: 0,
    fuelType: '', //this has to be empty bc different options avail on different views
    mileage: 0,
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
    , numVehicles = this.get('numVehicles')
    , mileage = this.get('mileage')
    , fuelType = this.get('fuelType')
    , fuelQty = this.get('fuelQty') // only set for boats
    , zip = this.get('zip') // only set for ecars

    if(vehicleType === 'ecar') {if(!zip) return;}
    var fleet = require('../utils/biz-fleet-emissions');
    fleet.vehicleType = vehicleType;
    fleet.vehicleCount = numVehicles;
    fleet.annMiles = mileage;
    fleet.fuel = 'diesel';
    fleet.boatGallons = 2000;
    fleet.zipCode = zip;
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