/* ----------------------------------------------------
 * BUSINESS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */

/* -------------------------------------
 * Business Commute
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var commute = {

	c : constants,

	car : 	{
		employees : 		0,
		annMiles : 			0,
		roundTripMiles : 	40,
		co2e : 				0,
		type : 				'car'
	},

	train : 	{
		employees : 		0,
		annMiles : 			0,
		roundTripMiles : 	40,
		co2e : 				0,
		type : 				'train'
	},

	bus : 		{
		employees : 		0,
		annMiles : 			0,
		roundTripMiles : 	40,
		co2e : 				0,
		type : 				'bus'
	},

	taxi : 		{
		employees : 		0,
		annMiles : 			0,
		roundTripMiles : 	40,
		co2e : 				0,
		type : 				'taxi'
	},

	walk : 		{
		employees : 		0,
		annMiles : 			0,
		roundTripMiles : 	2,
		co2e : 				0,
		type : 				'walk'
	},

	ferry : 	{
		employees : 		0,
		annMiles : 			0,
		roundTripMiles : 	40,
		co2e : 				0,
		type : 				'ferry'
	},

	methods : ['car','train','bus','taxi','walk','ferry'],

	isValidMethod : function(method) {		

		if ( method == undefined ) { return false; }
		if ( this.methods.indexOf(method) == -1 ) { return false; }
		return true;

	},

	annMiles : function(method) {

		var commuteIntervals = 	['week','month','year'];
		var oMethod = 	( this.isValidMethod(method) ) ? this[method] : null;
	
		if ( oMethod == null ) { return false; }

		oMethod.annMiles = oMethod.employees * oMethod.roundTripMiles * 250;
		// console.log('annMiles '+method, oMethod);
		return oMethod.annMiles;

	},

	emissionsByGas : function(gas) {

		var fCar = 		this.c.transportFactors.car,
			fTrain = 	this.c.transportFactors.train,
			fBus = 		this.c.transportFactors.bus,
			fTaxi = 	this.c.transportFactors.taxi,
			fWalk = 	this.c.transportFactors.walk,
			fFerry = 	this.c.transportFactors.ferry;


		switch(gas.toLowerCase()) {

			case 'co2':
 
				var mtCO2 = {
					car : 		commute.annMiles('car') * fCar.kgCO2perPassMi * .001,
					train : 	commute.annMiles('train') * fTrain.kgCO2perPassMi * .001,
					bus : 		commute.annMiles('bus') * fBus.kgCO2perPassMi * .001,
					taxi : 		commute.annMiles('taxi') * fTaxi.kgCO2perPassMi * .001,
					walk : 		commute.annMiles('walk') * fWalk.kgCO2perPassMi * .001,
					ferry : 	commute.annMiles('ferry') * fFerry.kgCO2perPassMi * .001,
				}
			
				return mtCO2;
				break;

			case 'ch4':
				var gCH4 = {
					car : 		commute.annMiles('car') * fCar.gCH4perPassMi,
					train : 	commute.annMiles('train') * fTrain.gCH4perPassMi,
					bus : 		commute.annMiles('bus') * fBus.gCH4perPassMi,
					taxi : 		commute.annMiles('taxi') * fTaxi.gCH4perPassMi,
					walk : 		commute.annMiles('walk') * fWalk.gCH4perPassMi,
					ferry : 	commute.annMiles('ferry') * fFerry.gCH4perPassMi,
				}
			
				return gCH4;
				break;

			case 'n2o':
				var gN2O = {
					car : 		commute.annMiles('car') * fCar.gN2OperPassMi,
					train : 	commute.annMiles('train') * fTrain.gN2OperPassMi,
					bus : 		commute.annMiles('bus') * fBus.gN2OperPassMi,
					taxi : 		commute.annMiles('taxi') * fTaxi.gN2OperPassMi,
					walk : 		commute.annMiles('walk') * fWalk.gN2OperPassMi,
					ferry : 	commute.annMiles('ferry') * fFerry.gN2OperPassMi,
				}
			
				return gN2O;
				break;

			default:
				return false;

		}

	},

	totalEmissions : function(method) {
		var CO2e;
		var oMethod = ( this.isValidMethod(method) ) ? this[method] : '';
		var mtCO2 	= this.emissionsByGas('CO2');
		var gCH4 	= this.emissionsByGas('CH4');
		var gN2O 	= this.emissionsByGas('N2O');

		// annMiles = {
		// 	car : 		commute.annMiles('car'),
		// 	train : 	commute.annMiles('train'),
		// 	bus : 		commute.annMiles('bus'),
		// 	taxi : 		commute.annMiles('taxi'),
		// 	walk : 		commute.annMiles('walk'),
		// 	ferry : 	commute.annMiles('ferry'),
		// }
		// console.log('totalEmissions annMiles',annMiles);

		// factors = {
		// 	car : 	this.c.transportFactors.car,
		// 	train : this.c.transportFactors.train,
		// 	bus : 	this.c.transportFactors.bus,
		// 	taxi : 	this.c.transportFactors.taxi,
		// 	walk : 	this.c.transportFactors.walk,
		// 	ferry : this.c.transportFactors.ferry
		// }
		// console.log('totalEmissions factors',factors);

		CO2e = {
			car : 		mtCO2.car + (gCH4.car * this.c.mtCH4toCO2e + gN2O.car * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			train : 	mtCO2.train + (gCH4.train * this.c.mtCH4toCO2e + gN2O.train * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			bus : 		mtCO2.bus + (gCH4.bus * this.c.mtCH4toCO2e + gN2O.bus * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			taxi : 		mtCO2.taxi + (gCH4.taxi * this.c.mtCH4toCO2e + gN2O.taxi * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			train : 	mtCO2.train + (gCH4.train * this.c.mtCH4toCO2e + gN2O.train * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			walk : 		mtCO2.walk + (gCH4.walk * this.c.mtCH4toCO2e + gN2O.walk * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			ferry : 	mtCO2.ferry + (gCH4.ferry * this.c.mtCH4toCO2e + gN2O.ferry * this.c.mtN2OtoCO2e ) / 1000 / 1000
		}

		return ( oMethod != '' ) ? CO2e[method] : CO2e;

	}

}

module.exports = commute;

console.log('\nCOMMUTE');
console.log('commute.methods',commute.methods);

commute.car.employees = 5;
console.log('commute.car',commute.car);

commute.train.employees = 5;
console.log('commute.train',commute.train);

commute.bus.employees = 9;
console.log('commute.bus',commute.bus);

commute.taxi.employees = 9;
console.log('commute.bus',commute.bus);

commute.ferry.employees = 5;
console.log('commute.ferry',commute.ferry);


console.log('commute.totalEmissions(train)',commute.totalEmissions('train'));
console.log('commute.totalEmissions(bus)',commute.totalEmissions('bus'));
console.log('commute.totalEmissions(taxi)',commute.totalEmissions('taxi'));
console.log('commute.totalEmissions(ferry)',commute.totalEmissions('ferry'));
console.log('commute.totalEmissions()',commute.totalEmissions());