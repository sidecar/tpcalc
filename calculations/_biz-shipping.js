/* ----------------------------------------------------
 * BUSINESS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Shipping
 * ------------------------------------- */

 var shipping = {

 	air : {

 		factor : 	1.527, 	// kg CO2 per ton-mile
 		shipments : 0,
 		miles : 	0,		// Miles
 		pounds : 	0		// Pounds

 	},

 	truck : {

 		factor : 	0.297, 	// kg CO2 per ton-mile
 		shipments : 0,
 		miles : 	0,	// Miles
 		pounds : 	0	// Pounds

 	},

 	train : {

 		factor : 	0.0252, 	// kg CO2 per ton-mile
 		shipments : 0,
 		miles : 	0,	// Miles
 		pounds : 	0	// Pounds

 	},

 	totalEmissions : function() {

 		var air = 		this.air;
 		var truck = 	this.truck;
 		var train = 	this.train;

 		var total = {

 			air : 		(air.factor * air.pounds/2000 * air.shipments * air.miles) / 1000 / 2204.6,
 			truck : 	(truck.factor * truck.pounds/2000 * truck.shipments * truck.miles) / 1000 / 2204.6,
 			train : 	(train.factor * train.pounds/2000 * train.shipments * train.miles) / 1000 / 2204.6

 		}

 		return total;

 	}

 }

console.log('\nSHIPPING');
console.log('shipping',shipping);
shipping.air.shipments = 92;
shipping.air.miles = 722;
shipping.air.pounds = 10000;
console.log('shipping.totalEmissions()',shipping.totalEmissions());
console.log('shipping.totalEmissions(air)',shipping.totalEmissions('air'));
shipping.truck.shipments = 4;
shipping.truck.miles = 50;
shipping.truck.pounds = 3000;
console.log('shipping.totalEmissions(truck)',shipping.totalEmissions('truck'));
shipping.train.shipments = 6;
shipping.train.miles = 30;
shipping.train.pounds = 3000;
console.log('shipping.totalEmissions(train)',shipping.totalEmissions('train'));
