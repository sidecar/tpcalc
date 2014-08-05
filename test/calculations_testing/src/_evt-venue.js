/* ----------------------------------------------------
 * EVENTS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Event Venue
 * ------------------------------------- */

var venue = {

	c : 				tpConstants,
	zipCode : 			94111,
	venueSize : 		500,	// square feet
	days : 				2,
	CBECSelectricity : 	53.87,
	CBECSgas : 			0.054584372,

	electricity : function() {	// kWh/room

		var kwhRoom = this.CBECSelectricity * this.venueSize/this.c.kwhtobtu * 1000 / 365;
		return kwhRoom;

	},

	gas : function() {	// btu/room

		var btuRoom = this.CBECSgas * 1000 * this.venueSize / 365;
		return btuRoom;

	},

	egridSubregion : function(zip) {
		
		var zip = ( zip == undefined ) ? this.zipCode : zip;
		return zipSubregion[zip]['egridSubregion'];

	},
	
	electricityFactor : function(zip) {

		var factor = this.c.egridSubregionGas[this.egridSubregion(zip)];
		return factor;

	},

	gasFactor : 	0.055,

	totalEmissions : function() {

		var elec 		= this.electricity();
		var eFactor 	= this.electricityFactor(this.zipCode);
		var gas 		= this.gas();
		var gasFactor 	= this.gasFactor;

		CO2e = this.venueSize * this.days * 0.001 * ( elec * eFactor.CO2e + gas * gasFactor * 0.001);
		return CO2e;

	}

}

console.log('\nVENUE');
venue.zipCode = '94111';
venue.venueSize = 500;
venue.days = 2;
console.log('venue',venue);
console.log('venue.totalEmissions',venue.totalEmissions());