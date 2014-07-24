var _ = require('underscore')
, Backbone = require('backbone')
, Qty = require('js-quantities')
, utils = require('../utils/utility')
, LocalStorage = require('backbone.Localstorage');

// to expose this module to browseirfy (i.e. CommonJS) http://stackoverflow.com/questions/19747500/how-to-use-browserify-to-bundle-a-backbone-app
Vehicle = Backbone.Model.extend({
	// defaults: {
	// 	year: 2013,
	// 	make: '',
	// 	model: '',
	// 	mileage: 100000, 
	// 	mpg: 20,
	// 	fuelType: 'gasoline',
	// 	vehicleClass: 'car', //fueleconomy.gov and map
	// },
	toJSON: function() {
	  var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
	  json.cid = this.cid;
	  return json;
	},
	convertEmissionsToCO2: function(MTC02, gCH4, gN20) {
		var num = MTC02 + (((21*gCH4 + 310*gN20)/1000)/1000);
		var qty = Qty(''+num); //for some damn reason has to be a string
		var rounded = qty.toPrec('0.01');
		return rounded.toFloat();
	},
	getTotalCH4: function(mileage) {
		var mappedVClassName = this.isCarOrTruck(this.vehicleClass);
		var factor = utils.gCH4PerMile[mappedVClassName][this.fuelType][this.year][0];
		return mileage * factor
	},
	getTotalN2O: function(mileage) {
		var mappedVClassName = this.isCarOrTruck(this.vehicleClass);
		var factor = utils.gN2OPerMile[mappedVClassName][this.fuelType][this.year][0];
		return mileage * factor
	},
	getTotalCO2: function(annualFuelGallons) {
		var factor = utils.kgCO2PerGallon[this.fuelType];
		return annualFuelGallons * factor
	},
	getTotalEmissions: function() {
		var annualFuelGallons = this.mileage/this.mpg
		, MTCO2 = this.getTotalCO2(annualFuelGallons)
		, gCH4 = this.getTotalCH4(this.mileage)
		, gN2O = this.getTotalN2O(this.mileage)
		, totalEmissions = convertEmissionsToCO2(MTCO2, gCH4, gN20);
		return totalEmissions;
	},
	isCarOrTruck: function(vehicleClass) {
		var containedInCarsList = _.find(this.vClassToTypeMap.cars, function(item){return item.indexOf(this.vehicleClass);});
		return (containedInCarsList > -1) ? 'car' : 'truck';
	},
	vClassToTypeMap: {
		cars: [
			'Two-Seater Car', 
			'Mini-Compact Car',
			'Sub-Compact Car',
			'Compact Car',
			'Midsize Car',
			'Large Car',
			'Small Station Wagon',
			'Midsize Station Wagon',
			'Small Sport Utility Vehicle',
			'Standard Sport Utility Vehicle'
		], 
		trucks: [
			'Minivan',
			'Small Pickup Truck',
			'Standard Pickup Truck',
			'Van, Cargo',
			'Van, Passenger',
			'Special Purpose Vehicle'
		] 
	}
});
module.exports.vehicle = Vehicle;

var Vehicles = Backbone.Collection.extend({
  model: Vehicle,
  localStorage: new LocalStorage("VehiclesCollection")
});
module.exports.vehicles = Vehicles;