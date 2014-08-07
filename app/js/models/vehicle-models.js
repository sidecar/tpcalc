'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, Qty = require('js-quantities')
, utils = require('../utils/utility');

var Vehicle = Backbone.Model.extend({
	defaults: {
		totalEmissions: 100,
		mpg: 23.5,
		fuelType: 'gasoline',
		zip: '00000-0000'
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

		var vehicle = require('../utils/ind-vehicle-emissions');
		vehicle.vehicleClass = this.get('vehicleType');

		switch(this.get('vehicleType')) {
			case 'car':
			case 'truck':
			case 'suv':
			case 'van':
			case 'motorcycle':
				vehicle.car.annMiles[this.get('fuelType')] = this.get('mileage');
				vehicle.car.fuelEconomy[this.get('fuelType')] = this.get('mpg');
				vehicle.year = this.get('year');
			break;
			case 'ecar':
				vehicle.ecar.zipCode = this.get('zip');
				vehicle.ecar.annMiles = this.get('mileage');
			break;
			case 'boat':
				vehicle.boat.annGallons = this.get('fuelQty');
				vehicle.boat.fuel = this.get('fuelType');
			break;
		}
		console.log('vehicleType', this.get('vehicleType'));
		console.log('mpg', this.get('mpg'));
		var total = vehicle.totalEmissions(this.get('fuelType'));
		
		this.set({totalEmissions: total});

		console.log('> total emissions:', total)
	},
	getTotalEmissions: function() {
		return this.get('totalEmissions');
	}
});

module.exports.vehicle = Vehicle;

var Vehicles = Backbone.Collection.extend({
  model: Vehicle,
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
module.exports.vehicles = Vehicles;