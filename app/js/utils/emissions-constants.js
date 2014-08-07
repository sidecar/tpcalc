/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Constants and Tables
 * ==================================================== */

module.exports = {

	mtCH4toCO2e 	: 21, 			// 1 mt CH4 = 21 mt CO2e
	mtN2OtoCO2e 	: 310,			// 1 mt N2O = 310 mt CO2e
	kwhtobtu 		: 3412,			// 1 kWh = 3412 Btu
	gasGallonEquiv 	: 33.4, 		// 1 gas gallon = 33.4 kWh
	miletokm 		: 0.621371,  	// 1 mile = 0.621371 km
	rfi 			: 2.7,			// The refractive forcing index. Used with flight calculations

	egridSubregion : {  // Use the zipSubregion.js file and zipSubregion to cross-reference against zip codes.
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
	},


	egridSubregionGas : { // All units, except CO2e are in lb/MWh. CO2e is converted to kg/kWh

		AKGD :  {
			CO2 : 1256.87,
			CH4 : 0.02608,
			N2O : 0.00718, 
			CO2e : 0.571
		},

		AKMS :  {
			CO2 : 448.57,
			CH4 : 0.01874,
			N2O : 0.00368, 
			CO2e : 0.204
		},

		ERCT :  {
			
			CO2 : 1218.17,
			CH4 : 0.01685,
			N2O : 0.01407, 
			CO2e : 0.555
		},

		FRCC :  {
			CO2 : 1196.71,
			CH4 : 0.03891,
			N2O : 0.01375, 
			CO2e : 0.545
		},

		HIMS :  {
			CO2 : 1330.16,
			CH4 : 0.07398,
			N2O : 0.01388, 
			CO2e : 0.606
		},

		HIOA :  {
			CO2 : 1621.86,
			CH4 : 0.0993,
			N2O : 0.02241, 
			CO2e : 0.74
		},

		MROE :  {
			CO2 : 1610.8,
			CH4 : 0.02429,
			N2O : 0.02752, 
			CO2e : 0.735
		},

		MROW :  {
			CO2 : 1536.36,
			CH4 : 0.02853,
			N2O : 0.02629, 
			CO2e : 0.701
		},

		NYLI :  {
			CO2 : 1336.11,
			CH4 : 0.08149,
			N2O : 0.01028, 
			CO2e : 0.608
		},

		NEWE :  {
			CO2 : 722.07,
			CH4 : 0.02381,
			N2O : 0.0028, 
			CO2e : 0.328
		},

		NYCW :  {
			CO2 : 622.42,
			CH4 : 0.07176,
			N2O : 0.01298, 
			CO2e : 0.285
		},

		NYUP :  {
			CO2 : 545.79,
			CH4 : 0.0163,
			N2O : 0.00724, 
			CO2e : 0.249
		},

		RFCE :  {
			CO2 : 1001.72,
			CH4 : 0.02707,
			N2O : 0.01533, 
			CO2e : 0.457
		},

		RFCM :  {
			CO2 : 1629.38,
			CH4 : 0.03046,
			N2O : 0.02684, 
			CO2e : 0.743
		},

		RFCW :  {
			CO2 : 1503.47,
			CH4 : 0.0182,
			N2O : 0.02475, 
			CO2e : 0.686
		},

		SRMW :  {
			CO2 : 1810.83,
			CH4 : 0.02048,
			N2O : 0.02957, 
			CO2e : 0.826
		},

		SRMV :  {
			CO2 : 1029.82,
			CH4 : 0.02066,
			N2O : 0.01076, 
			CO2e : 0.469
		},

		SRSO :  {
			CO2 : 1354.09,
			CH4 : 0.02282,
			N2O : 0.02089, 
			CO2e : 0.617
		},

		SRTV :  {
			CO2 : 1389.2,
			CH4 : 0.0177,
			N2O : 0.02241, 
			CO2e : 0.633
		},

		SRVC :  {
			CO2 : 1073.65,
			CH4 : 0.02169,
			N2O : 0.01764, 
			CO2e : 0.49
		},

		SPNO :  {
			CO2 : 1799.45,
			CH4 : 0.02081,
			N2O : 0.02862, 
			CO2e : 0.82
		},

		SPSO :  {
			CO2 : 1580.6,
			CH4 : 0.0232,
			N2O : 0.02085, 
			CO2e : 0.72
		},

		CAMX :  {
			CO2 : 610.82,
			CH4 : 0.02849,
			N2O : 0.00603, 
			CO2e : 0.278
		},

		NWPP :  {
			CO2 : 842.58,
			CH4 : 0.01605,
			N2O : 0.01307, 
			CO2e : 0.384
		},

		RMPA :  {
			CO2 : 1896.74,
			CH4 : 0.02266,
			N2O : 0.02921, 
			CO2e : 0.865
		},

		AZNM :  {
			CO2 : 1177.61,
			CH4 : 0.01921,
			N2O : 0.01572, 
			CO2e : 0.537
		},

		notSpecified :  {
			CO2 : 1232.35,
			CH4 : 0.024,
			N2O : 0.01826, 
			CO2e : 0.562
		},

	},


	transportFactors : {

		/* ----------------------------
		 * Public Transit / Commute
		 * ---------------------------- */
		car : {		// Passenger Car - Gasoline - Year 2005-present			
					// Units: g/Mile
					kgCO2perPassMi : 	0.391555556,
					gCH4perPassMi : 	0.0147,
					gN2OperPassMi : 	0.0079
		},

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

		walk : {	// Large RoPax Ferry 				
					// Units: kg/Passenger Kilometer
					kgCO2perPassMi : 	0,
					gCH4perPassMi : 	0,
					gN2OperPassMi : 	0
		},

		ferry : {	// Large RoPax Ferry 				
					// Units: kg/Passenger Kilometer
					kgCO2perPassMi : 	0.11516/0.621371, // /miletokm
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
		 * Air Travel - Distance 						
		 * Units: kg/Passenger Mile
		 * ---------------------------- */
		 shortHaulPassMi :  0.27594301,
		 medHaulPassMi : 	0.156106416,
		 longHaulPassMi : 	0.182161704,


		/* ----------------------------
		 * Air Travel - Fuel & Destination
		 * ---------------------------- */
		 jetFuel : 			9.57,
		 aviationGas : 		8.32,
		 defaultFactor : 	0.097			// Air - Short Haul - Seating Unknown

	},


	fleetFactors : {

		kgCO2pergal : {
			gasoline : 			8.81,
			diesel : 			10.15,
			bioDieselB20 : 		8.12,
			bioDieselB100 : 	0,
			cng : 				5.99,
			e85 : 				1.3215,
			residualFuelOil : 	11.8 // This value is 0.3 in the Individual Calculator. 11.8 may be wrong/incorrect
		},

		gCH4permile : {

			car : { 
				gasoline : 0.0147,
				diesel : 0.0005,
				cng : 0.737,
				e85 : 0.0147,
				bioDieselB20 : 0.0005,
				bioDieselB100 : 0.0005 
			},

			truck : { 
				gasoline : 0.0157,
				diesel : 0.001,
				cng : 0.737,
				e85 : 0.055,
				bioDieselB20 : 0.001,
				bioDieselB100 : 0.001 
			},

			deliveryTruck : { 
				gasoline : 0.0326,
				diesel : 0.0051,
				cng : 1.966,
				e85 : 0.197,
				bioDieselB20 : 0.0051,
				bioDieselB100 : 0.0051 
			},

			semi : { 
				gasoline : 0.0326,
				diesel : 0.0051,
				cng : 1.966,
				e85 : 0.197,
				bioDieselB20 : 0.0051,
				bioDieselB100 : 0.0051 
			}

		}, 

		gN2Opermile : {
		
			car : { 
				gasoline : 0.0079,
				diesel : 0.001,
				cng : 0.05,
				e85 : 0.0079,
				bioDieselB20 : 0.001,
				bioDieselB100 : 0.001 
			},

			truck : { 
				gasoline : 0.0101,
				diesel : 0.0015,
				cng : 0.05,
				e85 : 0.067,
				bioDieselB20 : 0.0015,
				bioDieselB100 : 0.0015 
			},

			deliveryTruck : { 
				gasoline : 0.0177,
				diesel : 0.0048,
				cng : 0.175,
				e85 : 0.175,
				bioDieselB20 : 0.0048,
				bioDieselB100 : 0.0048 
			},

			semi : { 
				gasoline : 0.0177,
				diesel : 0.0048,
				cng : 0.175,
				e85 : 0.175,
				bioDieselB20 : 0.0048,
				bioDieselB100 : 0.0048 
			}

		},

		gCH4pergal : {
			gasoline : 			0.64,
			diesel : 			0.74,
			residualFuelOil : 	0.86
		},

		gN2Opergal : {
			gasoline : 			0.22,
			diesel : 			0.26,
			residualFuelOil : 	0.3
		}

	},


	standardCubicFeet : {

		ccf : 		100,
		therms : 	97.371,
		mmbtu : 	973.710,
		mcf : 		1000000

	},


	gallonsPropane : {

		gallons : 	1,
		lbs : 		0.238,
		kg 	: 		0.238

	}

}
