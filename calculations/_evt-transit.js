/* ----------------------------------------------------
 * EVENT CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



 /* -------------------------------------
 * Travel
 * ------------------------------------- */

var eventTransit = {

	c : tpConstants,

	car : 	{
		attendees : 		0,
		oneWayMileage : 	0,
		type : 				'car'
	},

	train : 	{
		attendees : 		0,
		oneWayMileage : 	0,
		type : 				'train'
	},

	bus : 		{
		attendees : 		0,
		oneWayMileage : 	0,
		type : 				'bus'
	},

	taxi : 		{
		attendees : 		0,
		oneWayMileage : 	0,
		type : 				'taxi'
	},

	ferry : 	{
		attendees : 		0,
		oneWayMileage : 	0,
		type : 				'ferry'
	},

	methods : ['car','train','bus','taxi','ferry'],

	isValidMethod : function(method) {	

		if ( method == 'undefined' ) { return false; }	
		if ( this.methods.indexOf(method) == -1 ) { return false; }	
		return true;

	},

	mileage : function(method) {

		var oMethod = ( this.isValidMethod(method) ) ? this[method] : null;
	
		if ( oMethod == null ) { return false; }

		var miles = oMethod.attendees * oMethod.oneWayMileage * 2;
		return miles;

	},

	emissionsByGas : function(gas) {

		var fCar = 		this.c.transportFactors.car;
		var fTrain = 	this.c.transportFactors.train;
		var fBus = 		this.c.transportFactors.bus;
		var fTaxi = 	this.c.transportFactors.taxi;
		var fFerry = 	this.c.transportFactors.ferry;


		switch(gas.toLowerCase()) {

			case 'co2':
 
				var mtCO2 = {
					car : 		this.mileage('car') * fCar.kgCO2perPassMi * .001,
					train : 	this.mileage('train') * fTrain.kgCO2perPassMi * .001,
					bus : 		this.mileage('bus') * fBus.kgCO2perPassMi * .001,
					taxi : 		this.mileage('taxi') * fTaxi.kgCO2perPassMi * .001,
					ferry : 	this.mileage('ferry') * fFerry.kgCO2perPassMi * .001,
				}
			
				return mtCO2;
				break;

			case 'ch4':
				var gCH4 = {
					car : 		this.mileage('car') * fCar.gCH4perPassMi,
					train : 	this.mileage('train') * fTrain.gCH4perPassMi,
					bus : 		this.mileage('bus') * fBus.gCH4perPassMi,
					taxi : 		this.mileage('taxi') * fTaxi.gCH4perPassMi,
					ferry : 	this.mileage('ferry') * fFerry.gCH4perPassMi,
				}
			
				return gCH4;
				break;

			case 'n2o':
				var gN2O = {
					car : 		this.mileage('car') * fCar.gN2OperPassMi,
					train : 	this.mileage('train') * fTrain.gN2OperPassMi,
					bus : 		this.mileage('bus') * fBus.gN2OperPassMi,
					taxi : 		this.mileage('taxi') * fTaxi.gN2OperPassMi,
					ferry : 	this.mileage('ferry') * fFerry.gN2OperPassMi,
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
			car : 		mtCO2.car + (gCH4.car * this.c.mtCH4toCO2e + gN2O.car * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			train : 	mtCO2.train + (gCH4.train * this.c.mtCH4toCO2e + gN2O.train * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			bus : 		mtCO2.bus + (gCH4.bus * this.c.mtCH4toCO2e + gN2O.bus * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			taxi : 		mtCO2.taxi + (gCH4.taxi * this.c.mtCH4toCO2e + gN2O.taxi * this.c.mtN2OtoCO2e ) / 1000 / 1000,
			ferry : 	mtCO2.ferry + (gCH4.ferry * this.c.mtCH4toCO2e + gN2O.ferry * this.c.mtN2OtoCO2e ) / 1000 / 1000
		}

		return ( oMethod != '' ) ? CO2e[method] : CO2e;

	}

}

console.log('\nEVENT TRANSIT');
console.log('eventTransit.methods',eventTransit.methods);

eventTransit.car.oneWayMileage = 50;
eventTransit.car.attendees = 25;
console.log('eventTransit.mileage(car)',eventTransit.mileage('car'));
console.log('eventTransit.emissionsByGas(CO2)',eventTransit.emissionsByGas('CO2'));
console.log('eventTransit.totalEmissions(car)',eventTransit.totalEmissions('car'));

eventTransit.train.oneWayMileage = 50;
eventTransit.train.attendees = 25;
console.log('eventTransit.totalEmissions(train)',eventTransit.totalEmissions('train'));

eventTransit.bus.oneWayMileage = 50;
eventTransit.bus.attendees = 25;
console.log('eventTransit.totalEmissions(bus)',eventTransit.totalEmissions('bus'));

eventTransit.taxi.oneWayMileage = 50;
eventTransit.taxi.attendees = 25;
console.log('eventTransit.totalEmissions(taxi)',eventTransit.totalEmissions('taxi'));

eventTransit.ferry.oneWayMileage = 50;
eventTransit.ferry.attendees = 25;
console.log('eventTransit.totalEmissions(ferry)',eventTransit.totalEmissions('ferry'));
console.log('eventTransit.totalEmissions()',eventTransit.totalEmissions());