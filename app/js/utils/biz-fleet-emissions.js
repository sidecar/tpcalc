/* ----------------------------------------------------
 * BUSINESS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Fleet
 * ------------------------------------- */


var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var fleet = {

	c : 			constants,
	vehicleType : 	'car',
	vehicleCount : 	0,
	fuel : 			'gasoline',
	annMiles : 		10000,
	zipCode : 		94111,
	boatFuel : 		'residualFuelOil',
	boatGallons : 	1,

	vehicleTypes : [
		'car',
		'truck',
		'deliverytruck',
		'semi',
		'boat',
		'ecar'
	],

	isValidVehicleType : function(vehicleType) {

		if ( vehicleType == undefined ) { return false; }
	
		return ( this.vehicleTypes.indexOf(vehicleType.toLowerCase()) == -1 )  ? false : true;

	},

	vehicle : function() {

		var self = this;

		return {

			// annMiles : {
			// 	gasoline : 			10000,
			// 	diesel : 			10000,
			// 	bioDieselB20 : 		10000,
			// 	bioDieselB100 : 	10000,
			// 	cng : 				10000,
			// 	e85 : 				10000
			// },

			annMiles : 		10000,

			fuelEconomy : {
				car : 			23.5,
				truck : 		25,
				deliverytruck : 7.3,
				semi : 			5.8,
				boat : 			0,
				ecar : 			95
			}

		}

	},

	factors : {

		kgCO2pergal : {
			gasoline : 			8.81,
			diesel : 			10.15,
			bioDieselB20 : 		8.12,
			bioDieselB100 : 	0,
			cng : 				5.99,
			e85 : 				1.3215
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
		}

	},

	milesPerGallon : {

		car : 				23.5,
		truck : 			25,
		deliverytruck : 	7.3,
		semi : 				5.8

	},

	CO2e : {

		car : 				{},
		truck : 			{},
		deliveryTruck : 	{},
		semi : 				{},
		boat : 				{},
		ecar : 				{}

	},

	boatFuelTypes : [
		'gasoline',
		'diesel',
		'residualfueloil'
	],

	isValidBoatFuel : function(fuelType) {

		if ( fuelType == undefined ) { return false; }
	
		return ( this.boatFuelTypes.indexOf(fuelType.toLowerCase()) == -1 )  ? false : true;

	},

	gallonsUsed : function(vehicleType) {

		vehicleType = ( this.isValidVehicleType(vehicleType) ) ? vehicleType : 'car';
		var gallons;

		// var gallons = {
		// 	gasoline : 			this.annMiles.gasoline/this.vehicle().fuelEconomy[vehicleType],
		// 	diesel : 			this.annMiles.diesel/this.vehicle().fuelEconomy[vehicleType],
		// 	bioDieselB20 : 		this.annMiles.bioDieselB20/this.vehicle().fuelEconomy[vehicleType],
		// 	bioDieselB100 : 	this.annMiles.bioDieselB100/this.vehicle().fuelEconomy[vehicleType],
		// 	cng : 				this.annMiles.cng/this.vehicle().fuelEconomy[vehicleType],
		// 	e85 : 				this.annMiles.e85/this.vehicle().fuelEconomy[vehicleType],
		// }

		switch(vehicleType) {

			case 'boat':
				gallons = this.boatGallons;
				break;

			default:
				gallons = this.annMiles/this.vehicle().fuelEconomy[vehicleType];
		}

		
		return gallons;

	},

	emissionsByGas : function(vehicleType) {


		vehicleType = ( this.isValidVehicleType(vehicleType) ) ? vehicleType : 'car';

		var gallonsUsed = this.gallonsUsed(vehicleType);
		var kgCO2pergal = this.c.fleetFactors.kgCO2pergal;
		var gCH4permile = this.c.fleetFactors.gCH4permile[vehicleType];
		var gN2Opermile = this.c.fleetFactors.gN2Opermile[vehicleType];
		var annMiles	= this.annMiles;

		var emissions = {

			mtCO2 : {
				gasoline : 			gallonsUsed * kgCO2pergal.gasoline * 0.001,
				diesel : 			gallonsUsed * kgCO2pergal.diesel * 0.001,
				bioDieselB20 : 		gallonsUsed * kgCO2pergal.bioDieselB20 * 0.001,
				bioDieselB100 : 	gallonsUsed * kgCO2pergal.bioDieselB100 * 0.001,
				cng : 				gallonsUsed * kgCO2pergal.cng * 0.001,
				e85 : 				gallonsUsed * kgCO2pergal.e85 * 0.001
			},

			gCH4 : {
				gasoline : 			annMiles * gCH4permile.gasoline,
				diesel : 			annMiles * gCH4permile.diesel,
				bioDieselB20 : 		annMiles * gCH4permile.bioDieselB20,
				bioDieselB100 : 	annMiles * gCH4permile.bioDieselB100,
				cng : 				annMiles * gCH4permile.cng,
				e85 : 				annMiles * gCH4permile.e85
			},

			gN2O : {
				gasoline : 			annMiles * gN2Opermile.gasoline,
				diesel : 			annMiles * gN2Opermile.diesel,
				bioDieselB20 : 		annMiles * gN2Opermile.bioDieselB20,
				bioDieselB100 : 	annMiles * gN2Opermile.bioDieselB100,
				cng : 				annMiles * gN2Opermile.cng,
				e85 : 				annMiles * gN2Opermile.e85
			}

		}








		return emissions;

	},

	boatEmissionsByGas : function() {

		var factors 	= this.c.fleetFactors;
		var gallons 	= this.boatGallons;
		var kgCO2pergal = factors.kgCO2pergal;
		var gCH4pergal 	= factors.gCH4pergal;
		var gN2Opergal 	= factors.gN2Opergal;

		var emissions = {

			mtCO2 : {
				gasoline : 			gallons * kgCO2pergal.gasoline/1000,
				diesel : 			gallons * kgCO2pergal.diesel/1000,
				residualFuelOil : 	gallons * kgCO2pergal.residualFuelOil/1000
			},

			gCH4 : {
				gasoline : 			gallons * gCH4pergal.gasoline,
				diesel : 			gallons * gCH4pergal.diesel,
				residualFuelOil : 	gallons * gCH4pergal.residualFuelOil
			},

			gN2O : {
				gasoline : 			gallons * gN2Opergal.gasoline,
				diesel : 			gallons * gN2Opergal.diesel,
				residualFuelOil : 	gallons * gN2Opergal.residualFuelOil
			}

		}

		return emissions;

	},

	totalBoatEmissions : function() {

		var mtCO2 		= this.boatEmissionsByGas()['mtCO2'];
		var gCH4 		= this.boatEmissionsByGas()['gCH4'];
		var gN2O 		= this.boatEmissionsByGas()['gN2O'];
		//var vehicles 	= this.vehicleCount;

		var CO2e = {
			gasoline : 			(mtCO2.gasoline + ( gCH4.gasoline*this.c.mtCH4toCO2e + gN2O.gasoline*this.c.mtN2OtoCO2e )/1000/1000),
			diesel : 			(mtCO2.diesel + ( gCH4.diesel*this.c.mtCH4toCO2e + gN2O.diesel*this.c.mtN2OtoCO2e )/1000/1000),
			residualFuelOil : 	(mtCO2.residualFuelOil + ( gCH4.residualFuelOil*this.c.mtCH4toCO2e + gN2O.residualFuelOil*this.c.mtN2OtoCO2e )/1000/1000)
		}

		return CO2e;

	},

	totalEcarEmissions : function() {

		var annMiles = 	this.annMiles;
		var mpge = 		this.vehicle().fuelEconomy['ecar'];
		var zipCode = 	this.zipCode;
		var vehicles = 	this.vehicleCount;
		var total = 	vehicles * ((annMiles/mpge) * this.c.gasGallonEquiv * this.c.egridSubregionGas[zipSubregion[zipCode].egridSubregion].CO2e/1000);
	
		return total;

	},

	totalEmissions : function(vehicleType) {

		vehicleType = ( this.isValidVehicleType(vehicleType) ) ? vehicleType : 'car';
		var fuel = this.fuel;

		// Deal with ecars

		if ( vehicleType == 'ecar' ) { return this.totalEcarEmissions(); }

		if ( vehicleType == 'boat' ) { 
			return ( this.isValidBoatFuel ) ? this.totalBoatEmissions()[fuel] : this.totalEcarEmissions(); 
		}

		var vehicleCount = fleet.vehicleCount;

		var mtCO2 	= this.emissionsByGas(vehicleType).mtCO2;
		var gCH4 	= this.emissionsByGas(vehicleType).gCH4;
		var gN2O 	= this.emissionsByGas(vehicleType).gN2O;
		var CO2e 	= {
			gasoline : 			vehicleCount * (mtCO2.gasoline + ( gCH4.gasoline*this.c.mtCH4toCO2e + gN2O.gasoline*this.c.mtN2OtoCO2e )/1000/1000),
			diesel : 			vehicleCount * (mtCO2.diesel + ( gCH4.diesel*this.c.mtCH4toCO2e + gN2O.diesel*this.c.mtN2OtoCO2e )/1000/1000),
			bioDieselB20 :  	vehicleCount * (mtCO2.bioDieselB20 + ( gCH4.bioDieselB20*this.c.mtCH4toCO2e + gN2O.bioDieselB20*this.c.mtN2OtoCO2e )/1000/1000),
			bioDieselB100 : 	vehicleCount * (mtCO2.bioDieselB100 + ( gCH4.bioDieselB100*this.c.mtCH4toCO2e + gN2O.bioDieselB100*this.c.mtN2OtoCO2e )/1000/1000),
			cng : 				vehicleCount * (mtCO2.cng + ( gCH4.cng*this.c.mtCH4toCO2e + gN2O.cng*this.c.mtN2OtoCO2e )/1000/1000),
			e85 : 				vehicleCount * (mtCO2.e85 + ( gCH4.e85*this.c.mtCH4toCO2e + gN2O.e85*this.c.mtN2OtoCO2e )/1000/1000),
		}

		this.CO2e[vehicleType] = CO2e;
		return ( typeof(fuel) != 'undefined' && fuel != '' ) ? CO2e[fuel.toLowerCase()] : CO2e;

	}

}

module.exports = fleet;

// console.log('\nFLEET');
// console.log('fleet.vehicle()',fleet.vehicle());
// console.log('fleet.c.fleetFactors',fleet.c.fleetFactors);

// fleet.vehicleCount = 1;
// fleet.vehicleType = 'car';
// fleet.annMiles = 10000;
// fleet.fuel = 'gasoline';
// console.log('fleet.totalEmissions(car)',fleet.totalEmissions('car'));
// console.log('fleet.CO2e',fleet.CO2e);

// fleet.vehicleCount = 1;
// fleet.vehicleType = 'truck';
// fleet.annMiles = 10000;
// fleet.fuel = 'gasoline';
// console.log('fleet.totalEmissions(truck)',fleet.totalEmissions('truck'));
// console.log('fleet.CO2e',fleet.CO2e);

// fleet.vehicleType = 'boat';
// fleet.boatGallons = 2000;
// console.log('fleet.boatGallons',fleet.boatGallons);
// fleet.fuel = 'diesel';
// console.log('fleet.fuel',fleet.fuel);
// console.log('fleet.totalEmissions(boat)',fleet.totalEmissions('boat'));
// console.log('fleet.CO2e',fleet.CO2e);


// fleet.vehicleCount = 3;
// fleet.vehicleType = 'ecar';
// fleet.annMiles = 15000;
// fleet.zipCode = 94111;
// console.log('fleet.totalEmissions(ecar)',fleet.totalEmissions('ecar'));
// console.log('fleet.CO2e',fleet.CO2e);
// fleet.vehicleCount = 1;
// fleet.vehicleType = 'boat';
// fleet.boatGallons = 1;
// fleet.fuel = 'residualFuelOil';
// console.log('fleet.totalEmissions(boat)',fleet.totalEmissions('boat'));
// console.log('fleet.CO2e',fleet.CO2e);




