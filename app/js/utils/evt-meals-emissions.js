/* ----------------------------------------------------
 * EVENT CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */

 /* -------------------------------------
  * Meals
  * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

meals = {

	c : 			constants,
	guests : 		50,
	mealsPerDay : 	2,
	days : 			1,
	percentVeggie : 36,
	totalMeals: 0,

	factors : {  	// lb CO2e

		vegetarian : 3.54,
		omnivorous : 5.27

	},

	// totalMeals : function() {

	// 	var total = this.guests * this.mealsPerDay * days;
	// 	return total;

	// },

	totalEmissions : function() {

		// var totalMeals 	= this.totalMeals();
		var totalMeals 	= this.totalMeals;
		var veggie 		= totalMeals * this.percentVeggie/100 * this.factors.vegetarian;
		var omnivorous 	= totalMeals * (100 - this.percentVeggie)/100 * this.factors.omnivorous;
		var lbCO2e 		= veggie + omnivorous;
		var mtCO2e		= lbCO2e/2204.6;

		return mtCO2e;

	}

}

module.exports = meals;

// console.log('\nMEALS');
// meals.guests = 50;
// meals.mealsPerDay = 2;
// days = 1;
// percentVeggie = 36;
// console.log('meals.totalEmissions()',meals.totalEmissions());
