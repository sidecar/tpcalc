/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Public Transportation / Commuting
 * ------------------------------------- */
var transit = {
	
	c : tpConstants,

	train : 	{
		annMiles : 	0,
		interval : 	'week',
		milesPer : 	0,
		co2e : 		0,
		type : 		'train'
	},

	bus : 		{
		annMiles : 	0,
		interval : 	'week',
		milesPer : 	0,
		co2e : 		0,
		type : 		'bus'
	},

	taxi : 		{
		annMiles : 	0,
		interval : 	'week',
		milesPer : 	0,
		co2e : 		0,
		type : 		'taxi'
	},

	ferry : 	{
		annMiles : 	0,
		interval : 	'week',
		milesPer : 	0,
		co2e : 		0,
		type : 		'ferry'
	},

	methods : ['train','bus','taxi','ferry'],

	isValidMethod : function(method) {		

		if ( method == 'undefined' ) { return false; }
		if ( this.methods.indexOf(method) == -1 ) { return false; }
		return true;

	},

	annMiles : function(method) {

		var transitIntervals = 	['week','month','year'];
		var oMethod = 	( this.isValidMethod(method) ) ? this[method] : null;
	
		if ( oMethod == null ) { return false; }

		var interval = ( transitIntervals.indexOf(oMethod.interval) ) ? '' : oMethod.interval;

		switch(oMethod.interval.toLowerCase()){

			case 'week':
				oMethod.annMiles = 50 * oMethod.milesPer;
				break;

			case 'month':
				oMethod.annMiles = 12 * oMethod.milesPer;
				break;

			case 'year':
				oMethod.annMiles = oMethod.milesPer;
				break;

		}

		return oMethod.annMiles;

	},

	emissionsByGas : function(gas) {

		var fTrain = 	this.c.transportFactors.train;
		var fBus = 		this.c.transportFactors.bus;
		var fTaxi = 	this.c.transportFactors.taxi;
		var fFerry = 	this.c.transportFactors.ferry;


		switch(gas.toLowerCase()) {

			case 'co2':
 
				var mtCO2 = {
					train : 	transit.annMiles('train') * fTrain.kgCO2perPassMi * .001,
					bus : 		transit.annMiles('bus') * fBus.kgCO2perPassMi * .001,
					taxi : 		transit.annMiles('taxi') * fTaxi.kgCO2perPassMi * .001,
					ferry : 	transit.annMiles('ferry') * fFerry.kgCO2perPassMi * .001,
				}
			
				return mtCO2;
				break;

			case 'ch4':
				var gCH4 = {
					train : 	transit.annMiles('train') * fTrain.gCH4perPassMi,
					bus : 		transit.annMiles('bus') * fBus.gCH4perPassMi,
					taxi : 		transit.annMiles('taxi') * fTaxi.gCH4perPassMi,
					ferry : 	transit.annMiles('ferry') * fFerry.gCH4perPassMi,
				}
			
				return gCH4;
				break;

			case 'n2o':
				var gN2O = {
					train : 	transit.annMiles('train') * fTrain.gN2OperPassMi,
					bus : 		transit.annMiles('bus') * fBus.gN2OperPassMi,
					taxi : 		transit.annMiles('taxi') * fTaxi.gN2OperPassMi,
					ferry : 	transit.annMiles('ferry') * fFerry.gN2OperPassMi,
				}
			
				return gN2O;
				break;

			default:
				return false;

		}

	},

	totalEmissions : function(method) {
		var CO2e;
		var oMethod = ( this.isValidMethod(method) ) ? this[method] : '';
		var mtCO2 	= this.emissionsByGas('CO2');
		var gCH4 	= this.emissionsByGas('CH4');
		var gN2O 	= this.emissionsByGas('N2O');

		CO2e = {
			train : 	mtCO2.train + (gCH4.train * this.c.mtCH4toCO2e + gN2O.train * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			bus : 		mtCO2.bus + (gCH4.bus * this.c.mtCH4toCO2e + gN2O.bus * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			taxi : 		mtCO2.taxi + (gCH4.taxi * this.c.mtCH4toCO2e + gN2O.taxi * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			ferry : 	mtCO2.ferry + (gCH4.ferry * this.c.mtCH4toCO2e + gN2O.ferry * this.c.mtN2OtoCO2e ) / 1000 / 1000
		}

		return ( oMethod != '' ) ? CO2e[method] : CO2e;

	}

}

console.log('\nTRANSIT');
console.log('transit.methods',transit.methods);
transit.train.annMiles = 1250;
transit.train.interval = "";
console.log('transit.totalEmissions(train)',transit.totalEmissions('train'));

transit.bus.milesPer = 30;
transit.bus.interval = "week";
console.log('transit.totalEmissions(bus)',transit.totalEmissions('bus'));

transit.taxi.milesPer = 30;
transit.taxi.interval = "week";
console.log('transit.totalEmissions(taxi)',transit.totalEmissions('taxi'));

transit.ferry.milesPer = 30;
transit.ferry.interval = "week";
console.log('transit.totalEmissions(ferry)',transit.totalEmissions('ferry'));
console.log('transit.totalEmissions()',transit.totalEmissions());