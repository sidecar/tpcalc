/* ----------------------------------------------------
 * BUSINESS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Travel
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var travel = {

	c : 			constants,
	aveAnnMiles : 	5000,
	annMiles : 		0,
	employees : 	1,
	fuelType : 		'jetFuel',
	useRFI : 		0, 			// 1: Yes, use Refractive Forcing Index (RFI). -  0: No, do not use RFI.
	calculateBy : 	{
		flightPercent : 0,
		flightMiles : 	1,
		flightCount : 	0,
		fuel : 			0
	},

	getCalculateBy : function() {  // Assuems only one 'calculateBy' property is 'on' (i.e. has a value of '1')

		var obj = this.calculateBy;
		for (var prop in obj ) {
			if ( obj.hasOwnProperty(prop)){
				if ( obj[prop] == 1 ) { return prop; }
			}
		}
		return false;

	},

	setCalculateBy : function(by) { // Change the 'calculateBy' object state. 'by' is one of the property names of 'calculateBy'

		var obj = this.calculateBy;
		for (var prop in obj ) {
			if ( obj.hasOwnProperty(prop)){
			
				obj[prop] = ( prop.toLowerCase() == by.toLowerCase() ) ? 1 : 0;
			}
		}
		return false;

	},	

	flight : {

		shortHaul : {
			percent : 		0,
			annMiles : 		0,
			staffFlights : 	0,
			km : 			462
		},

		medHaul : {
			percent : 		0,
			annMiles : 		0,
			staffFlights : 	0,
			km : 			1108
		},

		longHaul : {
			percent : 		0,
			annMiles : 		0,
			staffFlights : 	0,
			km : 			6482
		}

	},

	flightMethods : [
						'shortHaul',
						'medHaul',
						'longHaul'
					],

	fuel : {

		jetFuel : 		0,
		aviationGas : 	0

	}, 

	isValidFlightMethod : function(method) {
		if ( method == 'undefined' ) { return false; }
		if ( this.flightMethods.indexOf(method) == -1 ) { return false; }
		return true;
	},


	flightAnnMiles : function(flightMethod) {

		var oMethod = 		( this.isValidFlightMethod(flightMethod) ) ? this[flightMethod] : '';
		var calculateBy = 	this.getCalculateBy();
		var flight = 		this.flight;
		var oShortHaul = 	flight.shortHaul,
			oMedHaul = 		flight.medHaul,
			oLongHaul = 	flight.longHaul;
		var annMiles;


		if ( !calculateBy ) { return false; }
		if ( oMethod == '' ) { return false; }

		switch(calculateBy) {

			case 'flightPercent': 	// Calculate the annual mileage for each flight type by percentage
				annMiles = {
					shortHaul : 	oShortHaul.percent/100 * this.annMiles,
					medHaul : 		oMedHaul.percent/100 * this.annMiles,
					longHaul : 		oLongHaul.percent/100 * this.annMiles
				}
				break;

			case 'flightMiles': 	// Calculate the annual mileage for each flight type by number of employees
				annMiles = {
					shortHaul :     this.employees * oShortHaul.annMiles,
					medHaul :     	this.employees * oMedHaul.annMiles,
					longHaul :     	this.employees * oLongHaul.annMiles
				}
				break;

			case 'flightCount': 	// Do nothing. 'annMiles' has already been defined.
				annMiles = {
					shortHaul : 	oShortHaul.staffFlights * 2 * oShortHaul.km * this.c.miletokm,
					medHaul : 		oMedHaul.staffFlights * 2 * oMedHaul.km * this.c.miletokm,
					longHaul : 		oLongHaul.staffFlights * 2 * oLongHaul.km * this.c.miletokm
				}
				break;

			case 'fuel': 			// We don't even need a mileage calculation for this, bruh! We're using gallons.
				annMiles = '';
				break;

		}

		return ( oMethod != '' ) ? annMiles[flightMethod] : annMiles;

	},

	totalEmissions : function(flightMethod) {

		var oFlightMethod = ( this.isValidFlightMethod(flightMethod) ) ? this[flightMethod] : '';
		var rfindex = ( this.useRFI == 1 ) ? this.c.rfi : 1;
		var calculateBy = this.getCalculateBy();
		var CO2e;
		var fShortHaul = 	this.c.transportFactors.shortHaulPassMi,
			fMedHaul =		this.c.transportFactors.medHaulPassMi,
			fLongHaul =		this.c.transportFactors.longHaulPassMi;


		switch(calculateBy) {

			case 'flightMiles':
			case 'flightPercent':

				CO2e = {
					shortHaul : 	this.flightAnnMiles('shortHaul') * fShortHaul/1000 * rfindex,
					medHaul : 		this.flightAnnMiles('medHaul') * fMedHaul/1000 * rfindex,
					longHaul : 		this.flightAnnMiles('longHaul') * fLongHaul/1000 * rfindex
				}
				break;

			case 'fuel':

				CO2e = {
					jetFuel : 		this.fuel.jetFuel * this.c.transportFactors.jetFuel/1000,
					aviationGas : 	this.fuel.aviationGas * this.c.transportFactors.aviationGas/1000
				}
				break;

			case 'itinerary':

				CO2e = {
					itinerary : 	this.itinerary.annMiles * this.c.transportFactors.defaultFactor/1000
				}
				break;

		}

		if ( oFlightMethod != '' ) {

			return CO2e[flightMethod];

		} else if ( oFlightMethod == '' ) {

			if ( calculateBy == 'fuel' && flightMethod == 'jetFuel' || calculateBy == 'fuel' && flightMethod == 'aviationGas' ) {

				return CO2e[flightMethod];

			}

			if ( calculateBy == 'itinerary' && flightMethod == 'itinerary' ) {

				return CO2e[flightMethod];

			}

			return CO2e;

		}

		return CO2e;

	}

}

console.log('\nTRAVEL');
console.log('travel.calculateBy',travel.calculateBy);
console.log('travel.flight.shortHaul',travel.flight.shortHaul);

console.log('\nflightMiles - shortHaul');
travel.employees = 2;
travel.flight.shortHaul.annMiles = 5000;
travel.setCalculateBy('flightMiles');
console.log('travel.flight',travel.flight);
console.log('travel.totalEmissions(shortHaul)',travel.totalEmissions('shortHaul'));

console.log('\nfuel - jetFuel');
travel.fuelType = 'jetFuel';
travel.setCalculateBy('fuel');
travel.fuel.jetFuel = 100; // Set the number of gallons of jet fuel
console.log('travel.calculateBy',travel.calculateBy);
travel.flight.shortHaul.annMiles = 5000;
console.log('travel.flight',travel.flight);
console.log('travel.totalEmissions(fuel)',travel.totalEmissions('fuel'));

console.log('\nfuel - aviationGas');
travel.fuelType = 'aviationGas';
travel.setCalculateBy('fuel');
travel.fuel.aviationGas = 200; // Set the number of gallons of jet fuel
console.log('travel.calculateBy',travel.calculateBy);
travel.flight.shortHaul.annMiles = 5000;
console.log('travel.flight',travel.flight);
console.log('travel.totalEmissions(fuel)',travel.totalEmissions('fuel'));

console.log('\nflightPercent');
travel.annMiles = 10000;
travel.flight.shortHaul.percent = 35;
travel.flight.medHaul.percent = 35;
travel.flight.longHaul.percent = 30;
travel.setCalculateBy('flightPercent');
console.log('travel.calculateBy',travel.calculateBy);
console.log('travel.totalEmissions()',travel.totalEmissions());
