/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */



/* -------------------------------------
 * Home Energy
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');
var homeEnergyPrices = require('./home-energy-prices');

var home = {

	c : constants,
	zipCode : '93551',
	defaultZip: '93551',

	egridSubregion : function(zip) {

		zip = ( zip === 'undefined' || zip === undefined ) ? this.defaultZip : zip;
		zip = ( zipSubregion[zip] === 'undefined' || zipSubregion[zip] === undefined ) ? this.defaultZip : zip;

		return zipSubregion[zip]['egridSubregion'];
	},

	state : function(zip) {
		zip = ( zip === 'undefined' || zip === undefined ) ? this.defaultZip : zip;
		zip = ( zipSubregion[zip] === 'undefined' || zipSubregion[zip] === undefined ) ? this.defaultZip : zip;
		return zipSubregion[zip]['state'];
	},

	fuel : {

		electricity : {

			amount : 	0,
			units : 	'kwh',
			interval : 	'month',
			method : 	'energy'

		},

		naturalGas : {

			amount : 	0,
			units : 	'kcf',
			interval : 	'month',
			method : 	'energy'

		},

		heatingOil : {

			amount : 	0,
			units : 	'gallons',
			interval : 	'month',
			method : 	'energy'

		},

		propane : {

			amount : 	0,
			units : 	'gallons',
			interval : 	'month',
			method : 	'energy'

		},

		gasoline : {

			amount : 	0,
			units : 	'gallons',
			interval : 	'month',
			method : 	'energy'

		},

		diesel : {

			amount : 	0,
			units : 	'gallons',
			interval : 	'month',
			method : 	'energy'

		},

	},

	methodTypes : [
			'energy',  	// When the user uses an energy unit
			'dollars'	// When the user uses money as a measurement
		],

	fuelTypes : [
			'electricity',
			'naturalgas',
			'heatingoil',
			'propane',
			'gasoline',
			'diesel'
		],

	unitTypes : [
			'kwh',
			'therms',
			'mcf',
			'ccf',
			'mmbtu',
			'gallons',
			'lbs'
		],

	residentialCost : function(fuelType) {

		if ( fuelType != undefined ) {

			if ( !this.isValidFuelType(fuelType) ) { return false; }


		}

		cost = {

			electricity : 	homeEnergyPrices.electricity[this.state(this.zipCode)]/100,
			naturalGas : 	homeEnergyPrices.naturalGas[this.state(this.zipCode)],
			heatingOil : 	homeEnergyPrices.heatingOil,
			propane : 		homeEnergyPrices.propane,
			gasoline : 		homeEnergyPrices.gasoline,
			diesel : 	  	homeEnergyPrices.diesel

		}
		return ( fuelType == undefined ) ? cost : cost[fuelType];

	},

	isValidFuelType : function(fuelType) {

		if ( fuelType == undefined ) { return false; }

		if ( this.fuelTypes.indexOf(fuelType.toLowerCase()) == -1 ) { return false; }
		return true;

	},

	validatedFuelType : function(fuelType) {

		return ( this.isValidFuelType() ) ? undefined : fuelType;

	},

	annualUsage : function(fuelType) {

		if ( !this.isValidFuelType(fuelType) ) { return false; }

		var fuel = this.fuel[fuelType];
		var usage = ( fuel.method == 'dollars' ) ? this.annualUsageByDollars(fuelType) : this.annualUsageByEnergy(fuelType);
		return usage;

	},

	annualUsageByEnergy : function(fuelType) {

		if ( !this.isValidFuelType(fuelType) ) { return false; }
		var fuel = this.fuel[fuelType];
		var amount = fuel.amount;
		var monthMultiplier = ( fuel.interval = 'year' ) ? 1 : 12;
		var units;

		switch(fuelType.toLowerCase()) {

			case 'electricity':
				usage = (fuel.amount * monthMultiplier);
				break;

			case 'naturalgas':
				usage = fuel.amount * monthMultiplier * this.c.standardCubicFeet[fuel.units]/1000; // Convert to kcf from scf
				console.log('fuel.units = ' +fuel.units);
				break;

			case 'heatingoil':
				usage = (fuel.amount * monthMultiplier);
				break;

			case 'propane':
				usage = (fuel.amount * monthMultiplier);
				break;

			case 'gasoline':
				usage = (fuel.amount * monthMultiplier);
				break;

			case 'diesel':
				usage = (fuel.amount * monthMultiplier);
				break;

			default:
				usage = 0;

		}
		return usage;

	},

	annualUsageByDollars : function(fuelType) {
		if ( !this.isValidFuelType(fuelType) ) { return false; }
		fuelType = this.validatedFuelType(fuelType);
		var fuel = this.fuel[fuelType];
		var amount = fuel.amount;
		var cost = this.residentialCost();
		var monthMultiplier = ( fuel.interval == 'year' ) ? 1 : 12;

		return amount / cost[fuelType] * monthMultiplier;

	},

	homeEnergyFactors : function() {

		var subregion = this.egridSubregion();
		var oSubregion = this.c.egridSubregionGas[subregion];

		electricity = {
			CO2 : 	oSubregion.CO2/2.20462/1000,
			CH4 : 	oSubregion.CH4/2.20462,
			N2O : 	oSubregion.N2O/2.20462
		}

		return {

			electricity : { // lb/MWh
				CO2 : 	oSubregion.CO2/2.20462/1000,
				CH4 : 	oSubregion.CH4/2.20462,
				N2O : 	oSubregion.N2O/2.20462
			},

			naturalGas : {
				CO2 : 	53.38, 	// kg/kcf
				CH4 : 	4.76,	// g/kcf
				N2O : 	.10 	// g/kcf
			},

			heatingOil : {
				CO2 : 	10.15, 	// kg/gal
				CH4 : 	1.46, 	// g/gal
				N2O : 	.09		// g/gal
			},

			propane : {
				CO2 : 	5.79, 	// kg/gal
				CH4 : 	.48,	// g/gal
				N2O : 	.01 	// g/gal
			},

			gasoline : {
				CO2 : 	8.81, 	// kg/gal
				CH4 : 	1.20, 	// g/gal
				N2O : 	.07 	// g/gal
			},

			diesel : {
				CO2 : 	10.15, 	// kg/gal
				CH4 : 	1.46, 	// g/gal
				N2O : 	.09		// g/gal
			}
		}

	},

	homeEmissionsByGas : function(fuelType) {

		var factors = this.homeEnergyFactors();
		var annualUsage = this.annualUsage();
		var oFuelType;


		if ( fuelType != undefined ) {


			if ( !this.isValidFuelType(fuelType) ) { return false; }
			oFuelType = this.fuel[fuelType];

		} else {


			fuelType = this.validatedFuelType(fuelType);
			oFuelType = '';
		}


		emissionsByGas = {

			electricity : {
				CO2 : factors.electricity.CO2 * this.annualUsage('electricity')/1000,
				CH4 : factors.electricity.CH4 * this.annualUsage('electricity'),
				N2O : factors.electricity.N2O * this.annualUsage('electricity'),
			},

			naturalGas : {
				CO2 : factors.naturalGas.CO2 * this.annualUsage('naturalGas')/1000,
				CH4 : factors.naturalGas.CH4 * this.annualUsage('naturalGas'),
				N2O : factors.naturalGas.N2O * this.annualUsage('naturalGas'),
			},

			heatingOil : {
				CO2 : factors.heatingOil.CO2 * this.annualUsage('heatingOil')/1000,
				CH4 : factors.heatingOil.CH4 * this.annualUsage('heatingOil'),
				N2O : factors.heatingOil.N2O * this.annualUsage('heatingOil'),
			},

			propane : {
				CO2 : factors.propane.CO2 * this.annualUsage('propane')/1000,
				CH4 : factors.propane.CH4 * this.annualUsage('propane'),
				N2O : factors.propane.N2O * this.annualUsage('propane'),
			},

			gasoline : {
				CO2 : factors.gasoline.CO2 * this.annualUsage('gasoline')/1000,
				CH4 : factors.gasoline.CH4 * this.annualUsage('gasoline'),
				N2O : factors.gasoline.N2O * this.annualUsage('gasoline'),
			},

			diesel : {
				CO2 : factors.diesel.CO2 * this.annualUsage('diesel')/1000,
				CH4 : factors.diesel.CH4 * this.annualUsage('diesel'),
				N2O : factors.diesel.N2O * this.annualUsage('diesel'),
			},

		}


		return ( fuelType == undefined ) ? emissionsByGas : emissionsByGas[fuelType];

	},

	totalEmissions : function(fuelType) {

		var oFuelType;
		var CO2e;

		var homeEmissions = 	this.homeEmissionsByGas();

		var eElectricity = 		homeEmissions.electricity;
		var eNaturalGas = 		homeEmissions.naturalGas;
		var eHeatingOil = 		homeEmissions.heatingOil;
		var ePropane = 			homeEmissions.propane;
		var eGasoline = 		homeEmissions.gasoline;
		var eDiesel = 			homeEmissions.diesel;

		if ( fuelType != undefined ) {

			if ( !this.isValidFuelType(fuelType) ) { return false; }
			oFuelType = this.fuel[fuelType];

		} else {

			fuelType = this.validatedFuelType(fuelType);
			oFuelType = '';

		}

		CO2e = {

			electricity : eElectricity.CO2 + ( eElectricity.CH4 * this.c.mtCH4toCO2e + eElectricity.N2O * this.c.mtN2OtoCO2e )/1000/1000,
			naturalGas : eNaturalGas.CO2 + ( eNaturalGas.CH4 * this.c.mtCH4toCO2e + eNaturalGas.N2O * this.c.mtN2OtoCO2e )/1000/1000,
			heatingOil : eHeatingOil.CO2 + ( eHeatingOil.CH4 * this.c.mtCH4toCO2e + eHeatingOil.N2O * this.c.mtN2OtoCO2e )/1000/1000,
			propane : ePropane.CO2 + ( ePropane.CH4 * this.c.mtCH4toCO2e + ePropane.N2O * this.c.mtN2OtoCO2e )/1000/1000,
			gasoline : eGasoline.CO2 + ( eGasoline.CH4 * this.c.mtCH4toCO2e + eGasoline.N2O * this.c.mtN2OtoCO2e )/1000/1000,
			diesel : eDiesel.CO2 + ( eDiesel.CH4 * this.c.mtCH4toCO2e + eDiesel.N2O * this.c.mtN2OtoCO2e )/1000/1000

		}

		return ( fuelType == undefined ) ? CO2e : CO2e[fuelType];

	}

}

module.exports = home;

// home.zipCode = 94105;

// home.fuel.electricity.method = 'dollars';
// home.fuel.electricity.amount = 40;

// home.fuel.naturalGas.method = 'dollars';
// home.fuel.naturalGas.amount = 40;

// home.fuel.heatingOil.method = 'dollars';
// home.fuel.heatingOil.amount = 10;

// home.fuel.propane.method = 'energy';
// home.fuel.propane.amount = 55;

// home.fuel.gasoline.method = 'energy';
// home.fuel.gasoline.amount = 50;

// home.fuel.diesel.method = 'energy';
// home.fuel.diesel.amount = 50;

// console.log('\nHOME');
// console.log('homeEnergyPrices',homeEnergyPrices);
// console.log('home.fuel',home.fuel);
// console.log('home.homeEnergyFactors',home.homeEnergyFactors());
// console.log('home.totalEmissions',home.totalEmissions());

