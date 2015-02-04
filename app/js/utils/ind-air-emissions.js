/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Air Travel
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var air = {

	c : 			constants,
	useRFI : 		0, 			// 1: Yes, use Refractive Forcing Index (RFI). -  0: No, do not use RFI.
	calculateBy : 	{
		flightMiles : 	1,
		flightCount : 	0,
		fuel : 			0,
		itinerary : 	0
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
			annMiles : 		0,
			annFlights : 	0,
			km : 			462
		},

		medEcon : {
			annMiles : 		0,
			annFlights : 	0,
			km : 			1108
		},

		medFirst : {
			annMiles : 		0,
			annFlights : 	0,
			km : 			1108
		},

		longEcon : {
			annMiles : 		0,
			annFlights : 	0,
			km : 			6482
		},

		longEconPlus : {
			annMiles : 		0,
			annFlights : 	0,
			km : 			6482
		},

		longBusiness : {
			annMiles : 		0,
			annFlights : 	0,
			km : 			6482
		},

		longFirst : {
			annMiles : 		0,
			annFlights : 	0,
			km : 			6482
		}

	},

	flightMethods : [
						'shortHaul',
						'medEcon',
						'medFirst',
						'longEcon',
						'longEconPlus',
						'longBusiness',
						'longFirst'
					],

	fuel : {

		jetFuel : 		0,
		aviationGas : 	0

	},

	itinerary : {

		annMiles : 0

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
			oMedEcon = 		flight.medEcon,
			oMedFirst = 	flight.medFirst,
			oLongEcon = 	flight.longEcon,
			oLongEconPlus = flight.longEconPlus,
			oLongBusiness = flight.longBusiness,
			oLongFirst = 	flight.longFirst;
		var annMiles;


		if ( !calculateBy ) { return false; }
		if ( oMethod == '' ) { return false; }

		switch(calculateBy) {

			case 'flightMiles': 	// Calculate the annual mileage for each flight type
				annMiles = {
					shortHaul :     oShortHaul.annMiles,
					medEcon :     	oMedEcon.annMiles,
					medFirst :     	oMedFirst.annMiles,
					longEcon :     	oLongEcon.annMiles,
					longEconPlus : 	oLongEconPlus.annMiles,
					longBusiness : 	oLongBusiness.annMiles,
					longFirst :     oLongFirst.annMiles
				}

				break;

			case 'flightCount': 	// Do nothing. 'annMiles' has already been defined.
				annMiles = {
					shortHaul : 	oShortHaul.annFlights * 2 * oShortHaul.km * this.c.miletokm,
					medEcon : 		oMedEcon.annFlights * 2 * oMedEcon.km * this.c.miletokm,
					medFirst : 		oMedFirst.annFlights * 2 * oMedFirst.km * this.c.miletokm,
					longEcon : 		oLongEcon.annFlights * 2 * oLongEcon.km * this.c.miletokm,
					longEconPlus : 	oLongEconPlus.annFlights * 2 * oLongEconPlus.km * this.c.miletokm,
					longBusiness : 	oLongBusiness.annFlights * 2 * oLongBusiness.km * this.c.miletokm,
					longFirst : 	oLongFirst.annFlights * 2 * oLongFirst.km * this.c.miletokm
				}

				break;

			case 'fuel': 			// We don't even need a mileage calculation for this, bruh! We're using gallons.
				annMiles = '';
				break;

			case 'itinerary': 		// Do nothing again bruh! 'annMiles should be defined with some view scripting'
				annMiles = '';
				break;

		}

		return ( oMethod != '' ) ? annMiles[flightMethod] : annMiles;

	},

	totalEmissions : function(flightMethod) {

		var oFlightMethod = ( this.isValidFlightMethod(flightMethod) ) ? this[flightMethod] : '';
		var rfindex = ( this.useRFI === true ) ? this.c.rfi : 1;
		var calculateBy = this.getCalculateBy();
		var CO2e;
		var fShortHaul = 	this.c.transportFactors.shortHaul/this.c.miletokm,
			fMedEcon =		this.c.transportFactors.medEcon/this.c.miletokm,
			fMedFirst =		this.c.transportFactors.medFirst/this.c.miletokm,
			fLongEcon =		this.c.transportFactors.longEcon/this.c.miletokm,
			fLongEconPlus = this.c.transportFactors.longEconPlus/this.c.miletokm,
			fLongBusiness = this.c.transportFactors.longBusiness/this.c.miletokm,
			fLongFirst =	this.c.transportFactors.longFirst/this.c.miletokm


		switch(calculateBy) {

			case 'flightMiles':
			case 'flightCount':

				CO2e = {
					shortHaul : 	this.flightAnnMiles('shortHaul') * fShortHaul/1000 * rfindex,
					medEcon : 		this.flightAnnMiles('medEcon') * fMedEcon/1000 * rfindex,
					medFirst : 		this.flightAnnMiles('medFirst') * fMedFirst/1000 * rfindex,
					longEcon : 		this.flightAnnMiles('longEcon') * fLongEcon/1000 * rfindex,
					longEconPlus : 	this.flightAnnMiles('longEconPlus') * fLongEconPlus/1000 * rfindex,
					longBusiness : 	this.flightAnnMiles('longBusiness') * fLongBusiness/1000 * rfindex,
					longFirst : 	this.flightAnnMiles('longFirst') * fLongFirst/1000 * rfindex
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

module.exports = air;

// console.log('\nAIR');
// console.log('air.calculateBy',air.calculateBy);
// console.log('air.flight.shortHaul',air.flight.shortHaul);

// air.flight.shortHaul.annMiles = 5000;
// console.log('air.flight',air.flight);
// console.log('air.totalEmissions(shortHaul)',air.totalEmissions('shortHaul'));

// air.setCalculateBy('flightCount');
// air.flight.medEcon.annFlights = 20;
// air.useRFI = 1;
// console.log('air.totalEmissions(medEcon)',air.totalEmissions('medEcon'));
// console.log('air.totalEmissions()',air.totalEmissions());
// console.log('air.calculateBy',air.calculateBy);

// air.setCalculateBy('fuel');
// air.fuel.jetFuel = 10;
// air.fuel.aviationGas = 20;
// console.log('air.totalEmissions(jetFuel)',air.totalEmissions('jetFuel'));
// console.log('air.totalEmissions()',air.totalEmissions());

// air.setCalculateBy('fuel');
// console.log('air.totalEmissions(itinerary)',air.totalEmissions('itinerary'));
// console.log('air.totalEmissions()',air.totalEmissions());


























