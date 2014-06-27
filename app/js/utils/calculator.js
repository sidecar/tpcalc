var Qty = require('js-quantities'),
	factors = require('./vehicle-emissions-factors');

exports.getTotalEmissions = function(MTC02, gCH4, gN20) {
	var num = MTC02 + (((21*gCH4 + 310*gN20)/1000)/1000);
	var qty = Qty(''+num); //for some damn reason has to be a string
	var rounded = qty.toPrec('0.01');
	return rounded.toFloat();
}

exports.getTotalCH4 = function(vehicleClass, year, mileage) {
	var factor = factors.gCH4PerMile[vehicleClass][fuelType][year][0];
	return mileage * factor;
}

exports.getTotalN2O = function(vehicleClass, fuelType, year, mileage) {
	var factor = factors.gN2OPerMile[vehicleClass][fuelType][year][0];
	return mileage * factor;
}

exports.getTotalCO2 = function(fuelType, annualFuelGallons) {
	var factor = factors.kgCO2PerGallon[fuelType];
	return annualFuelGallons * factor;
}

exports.annualAutoEmissions = function(vehicle) {
	var fuelType = vehicle.fuelType;
	var year = vehicle.year;
	var miles = vehicle.miles;
	var annualFuelGallons = vehicle.miles/vehicle.mpg;
	var MTCO2 = getTotalCO2(fuelType, annualFuelGallons);
	var gCH4 = getTotalCH4(vehicleClass, year, mileage);
	var gN2O = getTotalN2O(vehicleClass, fuelType, year, mileage);
	var totalEmissions = getTotalEmissions(MTCO2, gCH4, gN20);
	return totalEmissions;
}




































