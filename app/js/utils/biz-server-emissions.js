/* ----------------------------------------------------
 * BUSINESS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */

/* -------------------------------------
 * Server
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var server = {

	c : 			constants,
	factor : 		0.278,
	servers : 		0,
	avgServerLoad : 300,
	zipCode: '94607',

	annUsage : function() {

		return this.servers * this.avgServerLoad * 24 * 365 / 1000

	},

	totalEmissions : function() {

		// return this.annUsage() * this.factor * .001
		return this.annUsage() * this.c.egridSubregionGas[zipSubregion[this.zipCode].egridSubregion].CO2e * .001

	}

}

module.exports = server;

// console.log('\nSERVER');
// console.log('1.server',server);
// server.zipCode = '94111';
// server.servers = 1;
// console.log('2.server',server);
// console.log('server.totalEmissions()',server.totalEmissions());