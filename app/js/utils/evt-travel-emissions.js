/* ----------------------------------------------------
 * EVENTS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */

/* -------------------------------------
 * Event Air Travel
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var travel = {

	c : constants,
	aveMileage : 	0,
	attendees : 	1,
	arrivedOnShortFlights: 0,
	arrivedOnMedFlights: 0,
	arrivedOnLongFlights: 0,
	useRFI : 		0, 			// 1: Yes, use Refractive Forcing Index (RFI). -  0: No, do not use RFI.
	calculateBy : 	{
		flightDuration : 		1,
		averageDistance : 		0
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
			oneWayKM : 		0,
			flights : 		0,
			km : 			462
		},

		medHaul : {
			percent : 		0,
			oneWayKM : 		0,
			flights : 		0,
			km : 			1108
		},

		longHaul : {
			percent : 		0,
			oneWayKM : 		0,
			flights : 		0,
			km : 			6482
		}

	},

	flightMethods : [
						'shortHaul',
						'medHaul',
						'longHaul'
					],

	isValidFlightMethod : function(method) {
		if ( method == undefined ) { return false; }
		if ( this.flightMethods.indexOf(method) == -1 ) { return false; }
		return true;
	},

	mileage : function(flightMethod) {

		var oMethod = 		( this.isValidFlightMethod(flightMethod) ) ? this[flightMethod] : '';
		var calculateBy = 	this.getCalculateBy();
		var flight = 		this.flight;
		var oShortHaul = 	flight.shortHaul,
			oMedHaul = 		flight.medHaul,
			oLongHaul = 	flight.longHaul;
		var miles;


		if ( !calculateBy ) { return false; }
		if ( oMethod == '' && calculateBy == 'flightDuration' ) { return false; }

		switch(calculateBy) {


			case 'flightDuration': 	// Calculate the annual mileage for each flight type by number of attendees
				miles = {
					shortHaul :     this.arrivedOnShortFlights * 2 * oShortHaul.km * this.c.miletokm,
					medHaul :     	this.arrivedOnMedFlights * 2 * oMedHaul.km * this.c.miletokm,
					longHaul :     	this.arrivedOnLongFlights * 2 * oLongHaul.km * this.c.miletokm
				}
				break;

			case 'averageDistance': 	// Do nothing. 'annMiles' has already been defined.
				miles = this.attendees * 2 * this.aveMileage;
				break;


		}

		return ( oMethod != '' ) ? miles[flightMethod] : miles;

	},

	totalEmissions : function(flightMethod) {

		var oFlightMethod = ( this.isValidFlightMethod(flightMethod) ) ? this[flightMethod] : '';
		var rfindex = ( this.useRFI == 1 ) ? this.c.rfi : 1;
		var calculateBy = this.getCalculateBy();
		var CO2e;
		var fShortHaul = 	this.c.transportFactors.shortHaulPassMi,
			fMedHaul =		this.c.transportFactors.medHaulPassMi,
			fLongHaul =		this.c.transportFactors.longHaulPassMi;

		switch(this.getCalculateBy()) {

			case 'flightDuration':
				CO2e = {
					shortHaul : 	this.mileage('shortHaul') * fShortHaul/1000 * rfindex,
					medHaul : 		this.mileage('medHaul') * fMedHaul/1000 * rfindex,
					longHaul : 		this.mileage('longHaul') * fLongHaul/1000 * rfindex
				}
				
				return ( oFlightMethod != '' ) ? CO2e[flightMethod] : CO2e;
				break;

			case 'averageDistance':
				CO2e = this.mileage() * fShortHaul/1000 * rfindex;
				return CO2e;
				break;

		}

		return false;

	}

}

module.exports = travel;

console.log('\nEVENT AIR');
console.log('travel.calculateBy',travel.calculateBy);
console.log('travel.flight.shortHaul',travel.flight.shortHaul);

console.log('\nflightMiles - shortHaul');
travel.attendees = 25;
travel.flight.shortHaul.oneWayKM = 1000;
travel.setCalculateBy('flightDuration');
console.log('travel.calculateBy',travel.calculateBy);
console.log('travel.flight',travel.flight);
console.log('travel.totalEmissions(shortHaul)',travel.totalEmissions('shortHaul'));

console.log('\nflightMiles - medHaul and longHaul');
travel.flight.medHaul.oneWayKM = 1000;
travel.flight.longHaul.oneWayKM = 1000;
console.log('travel.totalEmissions()',travel.totalEmissions(''));

console.log('\nflightMiles - By average distance');
travel.attendees = 50;
travel.aveMileage = 1000;
travel.setCalculateBy('averageDistance');
console.log('travel.calculateBy',travel.calculateBy);
console.log('travel.flight',travel.flight);
console.log('travel.totalEmissions()',travel.totalEmissions());


