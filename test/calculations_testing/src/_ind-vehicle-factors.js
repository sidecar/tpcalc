factors : {
	
	gCH4permile : function(year,vehicleType) {

		year = ( year * 1 < 1993 ) ? '1993' : year;
		year = ( year * 1 > 2005 ) ? '2005' : year;

		switch(vehicleType.toLowerCase()) {

			case 'car':

				var CH4 = {
					'1900' : 0.0704,
					'1993' : 0.0704,
					'1994' : 0.0531,
					'1995' : 0.0358,
					'1996' : 0.0272,
					'1997' : 0.0268,
					'1998' : 0.0249,
					'1999' : 0.0216,
					'2000' : 0.0178,
					'2001' : 0.011,
					'2002' : 0.0107,
					'2003' : 0.0114,
					'2004' : 0.0145,
					'2005' : 0.0147,
				}

				return CH4[year];
				break;

			case 'truck' :
			case 'van' :
			case 'suv' :

				var CH4 = {
					'1900' : 0.0813,
					'1993' : 0.0813,
					'1994' : 0.0646,
					'1995' : 0.0517,
					'1996' : 0.0452,
					'1997' : 0.0452,
					'1998' : 0.0391,
					'1999' : 0.0321,
					'2000' : 0.0346,
					'2001' : 0.0151,
					'2002' : 0.0178,
					'2003' : 0.0155,
					'2004' : 0.0152,
					'2005' : 0.0157,
				}
				
				return CH4[year];
				break;

		}

		return false;

	},

	gN2Opermile : function(year,vehicleType) {

		switch(vehicleType.toLowerCase()) {

			case 'car':

				var CH4 = {
					'1900' : 0.0647,
					'1993' : 0.0647,
					'1994' : 0.056,
					'1995' : 0.0473,
					'1996' : 0.0426,
					'1997' : 0.0422,
					'1998' : 0.0393,
					'1999' : 0.0337,
					'2000' : 0.0273,
					'2001' : 0.0158,
					'2002' : 0.0153,
					'2003' : 0.0135,
					'2004' : 0.0083,
					'2005' : 0.0079
				}

				return CH4[year];
				break;

			case 'truck' :
			case 'van' :
			case 'suv' :

				var CH4 = {
					'1900' : 0.1035,
					'1993' : 0.1035,
					'1994' : 0.0982,
					'1995' : 0.0908,
					'1996' : 0.0871,
					'1997' : 0.0871,
					'1998' : 0.0728,
					'1999' : 0.0564,
					'2000' : 0.0621,
					'2001' : 0.0164,
					'2002' : 0.0228,
					'2003' : 0.0114,
					'2004' : 0.0132,
					'2005' : 0.0101
				}
				
				return CH4[year];
				break;

		}

		return false;

	},

	kgCO2pergal : {
		gasoline : 			8.81,
		diesel : 			10.15,
		bioDieselB20 : 		8.12,
		bioDieselB100 : 	0,
		cng : 				5.99,
		e85 : 				1.3215,
		residualFuelOil : 	0.3
	},
	gCH4permile : {
		gasoline : 			0.0704,
		diesel : 			0.0006,
		bioDieselB20 : 		0.0006,
		bioDieselB100 : 	0.0006,
		cng : 				0.737,
		e85 : 				0.0704
	},
	gN2Opermile : {
		gasoline : 			0.0647,
		diesel : 			0.0012,
		bioDieselB20 : 		0.0012,
		bioDieselB100 : 	0.0012,
		cng : 				0.05,
		e85 : 				0.0647
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
	},

}