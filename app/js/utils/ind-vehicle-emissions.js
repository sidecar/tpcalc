/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */


/* -------------------------------------
 * Vehicle Transportation
 * ------------------------------------- */

var zipSubregion = require('./egrid-subregions-by-zip');
var constants = require('./emissions-constants');

var vehicle = {

	vehicleClass : 'car',

	car : {
		annMiles : {
			gasoline : 			10000,
			diesel : 			10000,
			bioDieselB20 : 		10000,
			bioDieselB100 : 	10000,
			cng : 				10000,
			e85 : 				10000
		},

		fuelEconomy : {
			gasoline : 			23.5,
			diesel : 			23.5,
			bioDieselB20 : 		23.5,
			bioDieselB100 : 	23.5,
			cng : 				23.5,
			e85 : 				23.5
		}
	},

	boat : {
		annGallons : 	500,
		fuel : 			'diesel'
	},

	ecar : {
		annMiles : 		5000,
		mpge : 			95,
		zipCode : 		94710
	},

	factors : {
		kgCO2pergal : {
			gasoline : 			8.81,
			diesel : 			10.15,
			bioDieselB20 : 		8.12,
			bioDieselB100 : 	0,
			cng : 				5.99,
			e85 : 				1.3215,
			residualFuelOil : 	0.3
		},
		gCH4permile : {
			gasoline : 			0.0704,
			diesel : 			0.0006,
			bioDieselB20 : 		0.0006,
			bioDieselB100 : 	0.0006,
			cng : 				0.737,
			e85 : 				0.0704
		},
		gN2Opermile : {
			gasoline : 			0.0647,
			diesel : 			0.0012,
			bioDieselB20 : 		0.0012,
			bioDieselB100 : 	0.0012,
			cng : 				0.05,
			e85 : 				0.0647
		},
		gCH4pergal : {
			gasoline : 			0.64,
			diesel : 			0.74,
			residualFuelOil : 	0.86
		},
		gN2Opergal : {
			gasoline : 			0.22,
			diesel : 			0.26,
			residualFuelOil : 	0.3
		},
	},

	carGallonsUsed : function() {
		var gallons = {
			gasoline : 			this.car.annMiles.gasoline/this.car.fuelEconomy.gasoline,
			diesel : 			this.car.annMiles.diesel/this.car.fuelEconomy.diesel,
			bioDieselB20 : 		this.car.annMiles.bioDieselB20/this.car.fuelEconomy.bioDieselB20,
			bioDieselB100 : 	this.car.annMiles.bioDieselB100/this.car.fuelEconomy.bioDieselB100,
			cng : 				this.car.annMiles.cng/this.car.fuelEconomy.cng,
			e85 : 				this.car.annMiles.e85/this.car.fuelEconomy.e85,
		}
		return gallons;
	},

	carEmissionsByGas : function(gas) {
		var gallonsUsed = this.carGallonsUsed();
		var factors 	= this.factors;
		var kgCO2pergal = factors.kgCO2pergal;
		var gCH4permile = factors.gCH4permile;
		var gN2Opermile = factors.gN2Opermile;
		var annMiles	= this.car.annMiles;

		switch(gas.toLowerCase()) { 
			case 'co2': // Metric tons of CO2
 
				var mtCO2 = {
					gasoline : 			gallonsUsed.gasoline * kgCO2pergal.gasoline * 0.001,
					diesel : 			gallonsUsed.diesel * kgCO2pergal.diesel * 0.001,
					bioDieselB20 : 		gallonsUsed.bioDieselB20 * kgCO2pergal.bioDieselB20 * 0.001,
					bioDieselB100 : 	gallonsUsed.bioDieselB100 * kgCO2pergal.bioDieselB100 * 0.001,
					cng : 				gallonsUsed.cng * kgCO2pergal.cng * 0.001,
					e85 : 				gallonsUsed.e85 * kgCO2pergal.e85 * 0.001
				}
				// console.log('carEmissionsByGas - mtCO2',mtCO2);
				return mtCO2;
				break;

			case 'ch4': // grams of CH4 (methane)

				var gCH4 = {
					gasoline : 			annMiles.gasoline * gCH4permile.gasoline * 0.001,
					diesel : 			annMiles.diesel * gCH4permile.diesel * 0.001,
					bioDieselB20 : 		annMiles.bioDieselB20 * gCH4permile.bioDieselB20 * 0.001,
					bioDieselB100 : 	annMiles.bioDieselB100 * gCH4permile.bioDieselB100 * 0.001,
					cng : 				annMiles.cng * gCH4permile.cng * 0.001,
					e85 : 				annMiles.e85 * gCH4permile.e85 * 0.001
				}
				// console.log('carEmissionsByGas - gCH4',gCH4);
				return gCH4;
				break;

			case 'n2o': // grams of N2O (nitrous oxide)

				var gN2O = {
					gasoline : 			annMiles.gasoline * gN2Opermile.gasoline * 0.001,
					diesel : 			annMiles.diesel * gN2Opermile.diesel * 0.001,
					bioDieselB20 : 		annMiles.bioDieselB20 * gN2Opermile.bioDieselB20 * 0.001,
					bioDieselB100 : 	annMiles.bioDieselB100 * gN2Opermile.bioDieselB100 * 0.001,
					cng : 				annMiles.cng * gN2Opermile.cng * 0.001,
					e85 : 				annMiles.e85 * gN2Opermile.e85 * 0.001
				}
				// console.log('carEmissionsByGas - gN2O',gN2O);
				return gN2O;
				break;

			default:
				return false;
		}
	},

	boatEmissionsByGas : function(gas) {

		var boat 		= this.boat;
		var fuel 		= boat.fuel;
		var factors 	= this.factors;
		var kgCO2pergal = factors.kgCO2pergal;
		var gCH4pergal 	= factors.gCH4pergal;
		var gN2Opergal 	= factors.gN2Opergal;

		switch(gas.toLowerCase()) { 
			case 'co2': // Metric tons of CO2
 
				var mtCO2 = {
					gasoline : 			boat.annGallons * kgCO2pergal.gasoline/1000,
					diesel : 			boat.annGallons * kgCO2pergal.diesel/1000,
					residualFuelOil : 	boat.annGallons * kgCO2pergal.residualFuelOil/1000
				}
				// console.log('boatEmissionsByGas - mtCO2',mtCO2);
				return mtCO2;
				break;

			case 'ch4': // Metric tons CH4

				var gCH4 = {
					gasoline : 			boat.annGallons * gCH4pergal.gasoline,
					diesel : 			boat.annGallons * gCH4pergal.diesel,
					residualFuelOil : 	boat.annGallons * gCH4pergal.residualFuelOil
				}
				// console.log('boatEmissionsByGas - gCH4',gCH4);
				return gCH4
				break;

			case 'n2o': // Metric tons N2O

				var gN2O = {
					gasoline : 			boat.annGallons * gN2Opergal.gasoline,
					diesel : 			boat.annGallons * gN2Opergal.diesel,
					residualFuelOil : 	boat.annGallons * gN2Opergal.residualFuelOil
				}
				// console.log('boatEmissionsByGas - gN2O',gN2O);
				return gN2O
				break;

			default:
				return false;

		}

	},

	totalEmissions : function(fuel) {
// console.log('1.totalEmissions - fuel',fuel);
		var CO2e;
		var vehicleClass 	= ( !(this.vehicleClass != 'undefined'  && this.vehicleClass != '' ) ) ? "car" : this.vehicleClass;
		var fuel 			= ( typeof(fuel) != 'undefined' ) ? fuel : '';
		// console.log('totalEmissions - vehicleClass',this.vehicleClass);
// console.log('2.totalEmissions - fuel',fuel);

		switch ( vehicleClass ) {

			case 'car':
				CO2e = this.totalCarEmissions(fuel);
				// console.log('this is a car using ' + fuel + ' fuel');
				break;

			case 'boat':
				CO2e = this.totalBoatEmissions(fuel);
				break;

			case 'ecar':
				CO2e = this.totalEcarEmissions(fuel);
				break;

			case 'motorcycle':
				CO2e = this.totalMotorcycleEmissions(fuel);
				break;

			default:
				CO2e = this.totalCarEmissions(fuel);
		}

		return CO2e;

	},

	totalCarEmissions : function(fuel) {

		var mtCO2 	= this.carEmissionsByGas('CO2');
		var gCH4 	= this.carEmissionsByGas('CH4');
		var gN2O 	= this.carEmissionsByGas('N2O');
		var CO2e 	= {
			gasoline : 			mtCO2.gasoline + ( gCH4.gasoline*constants.mtCH4toCO2e + gN2O.gasoline*constants.mtN2OtoCO2e )/1000,
			diesel : 			mtCO2.diesel + ( gCH4.diesel*constants.mtCH4toCO2e + gN2O.diesel*constants.mtN2OtoCO2e )/1000,
			bioDieselB20 :  	mtCO2.bioDieselB20 + ( gCH4.bioDieselB20*constants.mtCH4toCO2e + gN2O.bioDieselB20*constants.mtN2OtoCO2e )/1000,
			bioDieselB100 : 	mtCO2.bioDieselB100 + ( gCH4.bioDieselB100*constants.mtCH4toCO2e + gN2O.bioDieselB100*constants.mtN2OtoCO2e )/1000,
			cng : 				mtCO2.cng + ( gCH4.cng*constants.mtCH4toCO2e + gN2O.cng*constants.mtN2OtoCO2e )/1000,
			e85 : 				mtCO2.e85 + ( gCH4.e85*constants.mtCH4toCO2e + gN2O.e85*constants.mtN2OtoCO2e )/1000,
		}

		return ( typeof(fuel) != 'undefined' && fuel != '' ) ? CO2e[fuel.toLowerCase()] : CO2e;

	},

	totalBoatEmissions : function(fuel) {

		var mtCO2 		= this.boatEmissionsByGas('CO2');
		var gCH4 		= this.boatEmissionsByGas('CH4');
		var gN2O 		= this.boatEmissionsByGas('N2O');
		var boatFuel 	= this.boat.fuel;
// console.log('totalBoatEmissions - mtCO2', mtCO2);
// console.log('totalBoatEmissions - gCH4', gCH4);
// console.log('totalBoatEmissions - gN2O', gN2O);
// console.log('***',gCH4.diesel*constants.mtCH4toCO2e + gN2O.diesel*constants.mtN2OtoCO2e );
		var CO2e = {
			gasoline : 			mtCO2.gasoline + ( gCH4.gasoline*constants.mtCH4toCO2e + gN2O.gasoline*constants.mtN2OtoCO2e )/1000/1000,
			diesel : 			mtCO2.diesel + ( gCH4.diesel*constants.mtCH4toCO2e + gN2O.diesel*constants.mtN2OtoCO2e )/1000/1000,
			residualFuelOil : 	mtCO2.residualFuelOil + ( gCH4.residualFuelOil*constants.mtCH4toCO2e + gN2O.residualFuelOil*constants.mtN2OtoCO2e )/1000/1000
		}
// console.log('totalBoatEmissions CO2e',CO2e);
// console.log('totalBoatEmissions fuel',fuel);
// console.log('totalBoatEmissions boatFuel',boatFuel);
		if ( typeof(fuel) != 'undefined' && fuel != '' ) {
			return CO2e[fuel.toLowerCase()];
		}
		if ( typeof(boatFuel) != 'undefined' && boatFuel != '' ) {
			return CO2e[boatFuel.toLowerCase()];
		} 
// console.log('totalBoatEmissions - this is a boat using ' + fuel + ' fuel');
		return CO2e;

	},

	totalEcarEmissions : function() {

		var annMiles = this.ecar.annMiles;
		var mpge = this.ecar.mpge;
		var zipCode = this.ecar.zipCode;
		var total = (annMiles/mpge) * constants.gasGallonEquiv * constants.egridSubregion[zipSubregion[zipCode].egridSubregion]/1000;
		// console.log('totalEcarEmissions - annMiles/mpge',annMiles/mpge);
		// console.log('totalEcarEmissions - annMiles/mpge*33.4',annMiles/mpge*33.4);
		// console.log('totalEcarEmissions - zipSubregion[zipCode]',zipSubregion[zipCode]);
		// console.log('totalEcarEmissions - constants.egridSubregion[]',constants.egridSubregion[zipSubregion[zipCode].egridSubregion])

		return total;

	}

};

// console.log('vehicle.car.annMiles',vehicle.car.annMiles);
// console.log('vehicle.car.annMiles.gasoline',vehicle.car.annMiles.gasoline);
// console.log('vehicle.carGallonsUsed()',vehicle.carGallonsUsed());
// console.log('vehicle.totalEmissions()',vehicle.totalEmissions());
// console.log('vehicle.totalEmissions(gasoline)',vehicle.totalEmissions('gasoline'))


vehicle.vehicleClass = "boat";
// console.log('vehicle.totalEmissions()',vehicle.totalEmissions());
// console.log('vehicle.totalEmissions(gasoline)',vehicle.totalEmissions('gasoline'));

vehicle.vehicleClass = "ecar";
// console.log('vehicle.totalEmissions()',vehicle.totalEmissions());

module.exports = vehicle;