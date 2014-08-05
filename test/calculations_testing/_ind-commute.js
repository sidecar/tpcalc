/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Public Transportation / Commuting
 * ------------------------------------- */
var commute = {

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

		var commuteIntervals = 	['week','month','year'];
		var oMethod = 	( this.isValidMethod(method) ) ? this[method] : null;
	
		if ( oMethod == null ) { return false; }

		var interval = ( commuteIntervals.indexOf(oMethod.interval) ) ? '' : oMethod.interval;

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
					train : 	commute.annMiles('train') * fTrain.kgCO2perPassMi * .001,
					bus : 		commute.annMiles('bus') * fBus.kgCO2perPassMi * .001,
					taxi : 		commute.annMiles('taxi') * fTaxi.kgCO2perPassMi * .001,
					ferry : 	commute.annMiles('ferry') * fFerry.kgCO2perPassMi * .001,
				}
			
				return mtCO2;
				break;

			case 'ch4':
				var gCH4 = {
					train : 	commute.annMiles('train') * fTrain.gCH4perPassMi,
					bus : 		commute.annMiles('bus') * fBus.gCH4perPassMi,
					taxi : 		commute.annMiles('taxi') * fTaxi.gCH4perPassMi,
					ferry : 	commute.annMiles('ferry') * fFerry.gCH4perPassMi,
				}
			
				return gCH4;
				break;

			case 'n2o':
				var gN2O = {
					train : 	commute.annMiles('train') * fTrain.gN2OperPassMi,
					bus : 		commute.annMiles('bus') * fBus.gN2OperPassMi,
					taxi : 		commute.annMiles('taxi') * fTaxi.gN2OperPassMi,
					ferry : 	commute.annMiles('ferry') * fFerry.gN2OperPassMi,
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
			taxi : 		mtCO2.taxi + (gCH4.taxi * this.c.mtCH4toCO2e + gN2O.bus * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			ferry : 	mtCO2.ferry + (gCH4.ferry * this.c.mtCH4toCO2e + gN2O.bus * this.c.mtN2OtoCO2e ) / 1000 / 1000
		}

		return ( oMethod != '' ) ? CO2e[method] : CO2e;

	}

}

console.log('\nCOMMUTE');
console.log('commute.methods',commute.methods);
commute.train.annMiles = 1250;
commute.train.interval = "";
console.log('commute.totalEmissions(train)',commute.totalEmissions('train'));

commute.bus.milesPer = 30;
commute.bus.interval = "week";
console.log('commute.totalEmissions(bus)',commute.totalEmissions('bus'));

commute.taxi.milesPer = 30;
commute.taxi.interval = "week";
console.log('commute.totalEmissions(taxi)',commute.totalEmissions('taxi'));

commute.ferry.milesPer = 30;
commute.ferry.interval = "week";
console.log('commute.totalEmissions(ferry)',commute.totalEmissions('ferry'));
console.log('commute.totalEmissions()',commute.totalEmissions());