/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Constants and Tables
 * ==================================================== */

var mtCH4toCO2e = 21; 		// 1 mt CH4 = 21 mt CO2e
var mtN2OtoCO2e = 310;		// 1 mt N2O = 310 mt CO2e
var gasGallonEquiv = 33.4; 	// 1 gas gallon = 33.4 kWh
var miletokm = 0.621371;  	// 1 mile = 0.621371 km
var rfi = 2.7;				// The refractive forcing index. Used with flight calculations

var egridSubregion = {  // Use the zipSubregion.js file and zipSubregion to cross-reference against zip codes.
	AKGD : 0.571,
	AKMS : 0.204,
	ERCT : 0.555,
	FRCC : 0.545,
	HIMS : 0.606,
	HIOA : 0.74,
	MROE : 0.735,
	MROW : 0.701,
	NYLI : 0.608,
	NEWE : 0.328,
	NYCW : 0.285,
	NYUP : 0.249,
	RFCE : 0.457,
	RFCM : 0.743,
	RFCW : 0.686,
	SRMW : 0.826,
	SRMV : 0.469,
	SRSO : 0.617,
	SRTV : 0.633,
	SRVC : 0.49,
	SPNO : 0.82,
	SPSO : 0.72,
	CAMX : 0.278,
	NWPP : 0.384,
	RMPA : 0.865,
	AZNM : 0.537,
	notSpecified : 0.562
}

var transportFactors = {

	/* ----------------------------
	 * Public Transit
	 * ---------------------------- */
	train : {	// Average (Light Rail and Tram) 	
				// Units: kg/Passgener Mile
				kgCO2perPassMi : 	0.163, 
				gCH4perPassMi : 	0.004,
				gN2OperPassMi : 	0.002
	},

	bus : 	{	// Bus - Type Unknown 				
				// Units: kg/Passenger Mile
				kgCO2perPassMi : 	0.107, 
				gCH4perPassMi : 	0.0006,
				gN2OperPassMi : 	0.0005
	},

	taxi : 	{	// Taxi 							
				// Units: kg/Passenger Mile
				kgCO2perPassMi : 	0.23,
				gCH4perPassMi : 	0.02,
				gN2OperPassMi : 	0.021
	},

	ferry : {	// Large RoPax Ferry 				
				// Units: kg/Passenger Kilometer
				kgCO2perPassMi : 	0.11516/miletokm,
				gCH4perPassMi : 	0,
				gN2OperPassMi : 	0
	},
	

	/* ----------------------------
	 * Air Travel - Distance 						
	 * Units: kg/Passenger Kilometer
	 * ---------------------------- */
	shortHaul : 	0.17147, 			// Domestic
	medEcon : 		0.09245,			// Short Haul - Economy Class
	medFirst : 		0.13867,			// Short Haul - First/Business Class
	longEcon : 		0.08263,			// Long Haul - Economy Class
	longEconPlus : 	0.13221,			// Long Haul - Economy+ Class
	longBusiness : 	0.23963, 			// Long Haul - Business Class
	longFirst : 	0.33052, 			// Long Haul - First Class
	

	/* ----------------------------
	 * Air Travel - Fuel & Destination
	 * ---------------------------- */
	 jetFuel : 			9.57,
	 aviationGas : 		8.32,
	 defaultFactor : 	0.097			// Air - Short Haul - Seating Unknown

}
