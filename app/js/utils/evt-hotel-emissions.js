/* ----------------------------------------------------
 * EVENTS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */

/* -------------------------------------
 * Event Air Travel
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var hotel = {

	c : 				constants,
	zipCode : 			94111,
	attendees : 		0,
	aveNights : 		0,
	CBECSelectricity : 	53.87, 	// Electricity Use ( 1,000 btu/sq-ft/year )
	CBECSgas : 			39.56, 	// Gas Use ( 1,000 btu/sq-ft/year )
	aveRoomSize : 		350,	// sq-ft


	electricity : function() {	// kWh/room

		var kwhRoom = this.CBECSelectricity * this.aveRoomSize/this.c.kwhtobtu * 1000 / 365;
		return kwhRoom;

	},

	gas : function() {	// btu/room

		var btuRoom = this.CBECSgas * 1000 * this.aveRoomSize / 365;
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

		CO2e = this.attendees * this.aveNights * 0.001 * ( elec * eFactor.CO2e + gas * gasFactor * 0.001);
		return CO2e;

	}

}

module.exports = hotel;

// console.log('\nHOTEL');
// hotel.zipCode = '94710';
// hotel.attendees = 25;
// hotel.aveNights = 2;
// console.log('hotel',hotel);
// console.log('hotel.totalEmissions',hotel.totalEmissions());