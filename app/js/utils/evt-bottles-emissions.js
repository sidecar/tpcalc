/* ----------------------------------------------------
 * EVENT CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */

 /* -------------------------------------
  * Water Bottles
  * ------------------------------------- */

var constants = require('./emissions-constants');


bottles = {

	c : 		constants,
	count : 	1,
	factor : 	82.8, // g CO2/water bottlke
	totalEmissions : function() {

		var CO2e = this.count * this.factor / 1000 / 1000;
		return CO2e;

	}

}

module.exports = bottles;

// console.log('\nBOTTLES');
// bottles.count = 10;
// console.log('bottles.totalEmissions()',bottles.totalEmissions());