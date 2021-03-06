/* ----------------------------------------------------
 * EVENTS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Event Air Travel
 * ------------------------------------- */

var eventAir = {

	c : 			tpConstants,
	aveMileage : 	0,
	attendees : 	1,
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
					shortHaul :     this.attendees * 2 * oShortHaul.km * this.c.miletokm,
					medHaul :     	this.attendees * 2 * oMedHaul.km * this.c.miletokm,
					longHaul :     	this.attendees * 2 * oLongHaul.km * this.c.miletokm
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

console.log('\nEVENT AIR');
console.log('eventAir.calculateBy',eventAir.calculateBy);
console.log('eventAir.flight.shortHaul',eventAir.flight.shortHaul);

console.log('\nflightMiles - shortHaul');
eventAir.attendees = 25;
eventAir.flight.shortHaul.oneWayKM = 1000;
eventAir.setCalculateBy('flightDuration');
console.log('eventAir.calculateBy',eventAir.calculateBy);
console.log('eventAir.flight',eventAir.flight);
console.log('eventAir.totalEmissions(shortHaul)',eventAir.totalEmissions('shortHaul'));

console.log('\nflightMiles - medHaul and longHaul');
eventAir.flight.medHaul.oneWayKM = 1000;
eventAir.flight.longHaul.oneWayKM = 1000;
console.log('eventAir.totalEmissions()',eventAir.totalEmissions(''));

console.log('\nflightMiles - By average distance');
eventAir.attendees = 50;
eventAir.aveMileage = 1000;
eventAir.setCalculateBy('averageDistance');
console.log('eventAir.calculateBy',eventAir.calculateBy);
console.log('eventAir.flight',eventAir.flight);
console.log('eventAir.totalEmissions()',eventAir.totalEmissions());


