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

	annUsage : function() {

		return this.servers * this.avgServerLoad * 24 * 365 / 1000

	},

	totalEmissions : function() {

		return this.annUsage() * this.factor * .001

	}

}

console.log('\nSERVER');
console.log('1.server',server);
server.servers = 1;
console.log('2.server',server);
console.log('server.totalEmissions()',server.totalEmissions());