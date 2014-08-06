/* ----------------------------------------------------
 * INDIVIDUAL CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */


/* -------------------------------------
 * Vehicle Transportation
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var vehicle = {
  
  c :       constants,
  vehicleClass : 'car',
  year :      '2000',

  car : {
    annMiles : {
      gasoline :      10000,
      diesel :      10000,
      bioDieselB20 :    10000,
      bioDieselB100 :   10000,
      cng :         10000,
      e85 :         10000
    },

    fuelEconomy : {
      gasoline :      23.5,
      diesel :      23.5,
      bioDieselB20 :    23.5,
      bioDieselB100 :   23.5,
      cng :         23.5,
      e85 :         23.5
    }
  },

  boat : {
    annGallons :  500,
    fuel :      'diesel'
  },

  ecar : {
    annMiles :    5000,
    mpge :      95,
    zipCode :     94710
  },

  factors : function() {

    var that =      this;
    var year =      that.year;
    var vehicleClass =  that.vehicleClass;

    gCH4permile_gasoline = that.gasolineFactors.gCH4permile(year,vehicleClass);
    gN2Opermile_gasoline = that.gasolineFactors.gN2Opermile(year,vehicleClass);
    gCH4permile_diesel = that.dieselFactors.gCH4permile(year,vehicleClass);
    gN2Opermile_diesel = that.dieselFactors.gN2Opermile(year,vehicleClass);

    return {
      kgCO2pergal : {
        gasoline :      8.81,
        diesel :      10.15,
        bioDieselB20 :    8.12,
        bioDieselB100 :   0,
        cng :         5.99,
        e85 :         1.3215,
        residualFuelOil :   0.3
      },
      gCH4permile : {
        // gasoline :       0.0704,
        gasoline :      gCH4permile_gasoline,
        diesel :      gCH4permile_diesel,
        bioDieselB20 :    gCH4permile_diesel,
        bioDieselB100 :   gCH4permile_diesel,
        cng :         0.737,
        // e85 :        0.0704
        e85 :         gCH4permile_gasoline
      },
      gN2Opermile : {
        // gasoline :       0.0647,
        gasoline :      gN2Opermile_gasoline,
        diesel :      gN2Opermile_diesel,
        bioDieselB20 :    gN2Opermile_diesel,
        bioDieselB100 :   gN2Opermile_diesel,
        cng :         0.05,
        // e85 :        0.0647
        e85 :         gN2Opermile_gasoline
      },
      gCH4pergal : {
        gasoline :      0.64,
        diesel :      0.74,
        residualFuelOil :   0.86
      },
      gN2Opergal : {
        gasoline :      0.22,
        diesel :      0.26,
        residualFuelOil :   0.3
      }
    }
  },

  gasolineFactors : {
    
    gCH4permile : function(year,vehicleClass) {

      vehicleClass = ( vehicleClass == undefined ) ? 'car' : vehicleClass;
      year = ( year * 1 < 1993 ) ? '1993' : year;
      year = ( year * 1 > 2005 ) ? '2005' : year;

      switch(vehicleClass.toLowerCase()) {

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

        case 'motorcycle' :

          return .07;
          break;

      }

      return false;

    },

    gN2Opermile : function(year,vehicleClass) {

      vehicleClass = ( vehicleClass == undefined ) ? 'car' : vehicleClass;
      year = ( year * 1 < 1993 ) ? '1993' : year;
      year = ( year * 1 > 2005 ) ? '2005' : year;

      switch(vehicleClass.toLowerCase()) {

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

        case 'motorcycle' :

          return .007;
          break;

      }

      return false;

    }

  },

  dieselFactors : {
    
    gCH4permile : function(year,vehicleClass) {

      vehicleClass = ( vehicleClass == undefined ) ? 'car' : vehicleClass;

      if ( year * 1 < 1983 ) {
        year = 'early';
      } else if ( year * 1 >= 1983 && year * 1 > 1996  ) {
        year = 'middle';
      } else if ( year >= 1996 ) {
        year = 'recent';
      }

      switch(vehicleClass.toLowerCase()) {

        case 'car' :
          CH4 = {
            early : .0006,
            middle : .0005,
            recent : .0005,
          }
          return CH4[year];
          break;

        case 'truck' :
        case 'van' :
        case 'suv' :
        case 'motorcycle' :
          CH4 = {
            early : .0011,
            middle : .0009,
            recent : .001,
          }
          return CH4[year];
          break;

      }

      return false;

    },
    
    gN2Opermile : function(year,vehicleClass) {

      vehicleClass = ( vehicleClass == undefined ) ? 'car' : vehicleClass;

      if ( year * 1 < 1983 ) {
        year = 'early';
      } else if ( year * 1 >= 1983 && year * 1 > 1996  ) {
        year = 'middle';
      } else if ( year >= 1996 ) {
        year = 'recent';
      }

      switch(vehicleClass.toLowerCase()) {

        case 'car' :
          N2O = {
            early : .0012,
            middle : .001,
            recent : .001,
          }
          return N2O[year];
          break;

        case 'truck' :
        case 'van' :
        case 'suv' :
        case 'motorcycle' :
          N2O = {
            early : .0017,
            middle : .0014,
            recent : .0015,
          }
          return N2O[year];
          break;

      }

      return false;

    }

  },

  carGallonsUsed : function() {
    var gallons = {
      gasoline :      this.car.annMiles.gasoline/this.car.fuelEconomy.gasoline,
      diesel :      this.car.annMiles.diesel/this.car.fuelEconomy.diesel,
      bioDieselB20 :    this.car.annMiles.bioDieselB20/this.car.fuelEconomy.bioDieselB20,
      bioDieselB100 :   this.car.annMiles.bioDieselB100/this.car.fuelEconomy.bioDieselB100,
      cng :         this.car.annMiles.cng/this.car.fuelEconomy.cng,
      e85 :         this.car.annMiles.e85/this.car.fuelEconomy.e85,
    }
    return gallons;
  },

  carEmissionsByGas : function(gas) {

    var gallonsUsed = this.carGallonsUsed();
    var factors   = this.factors();
    var kgCO2pergal = factors.kgCO2pergal;
    var gCH4permile = factors.gCH4permile;
    var gN2Opermile = factors.gN2Opermile;
    var annMiles  = this.car.annMiles;

    switch(gas.toLowerCase()) { 
      case 'co2': // Metric tons of CO2
 
        var mtCO2 = {
          gasoline :      gallonsUsed.gasoline * kgCO2pergal.gasoline * 0.001,
          diesel :      gallonsUsed.diesel * kgCO2pergal.diesel * 0.001,
          bioDieselB20 :    gallonsUsed.bioDieselB20 * kgCO2pergal.bioDieselB20 * 0.001,
          bioDieselB100 :   gallonsUsed.bioDieselB100 * kgCO2pergal.bioDieselB100 * 0.001,
          cng :         gallonsUsed.cng * kgCO2pergal.cng * 0.001,
          e85 :         gallonsUsed.e85 * kgCO2pergal.e85 * 0.001
        }
      
        return mtCO2;
        break;

      case 'ch4': // grams of CH4 (methane)

        var gCH4 = {
          gasoline :      annMiles.gasoline * gCH4permile.gasoline * 0.001,
          diesel :      annMiles.diesel * gCH4permile.diesel * 0.001,
          bioDieselB20 :    annMiles.bioDieselB20 * gCH4permile.bioDieselB20 * 0.001,
          bioDieselB100 :   annMiles.bioDieselB100 * gCH4permile.bioDieselB100 * 0.001,
          cng :         annMiles.cng * gCH4permile.cng * 0.001,
          e85 :         annMiles.e85 * gCH4permile.e85 * 0.001
        }
      
        return gCH4;
        break;

      case 'n2o': // grams of N2O (nitrous oxide)

        var gN2O = {
          gasoline :      annMiles.gasoline * gN2Opermile.gasoline * 0.001,
          diesel :      annMiles.diesel * gN2Opermile.diesel * 0.001,
          bioDieselB20 :    annMiles.bioDieselB20 * gN2Opermile.bioDieselB20 * 0.001,
          bioDieselB100 :   annMiles.bioDieselB100 * gN2Opermile.bioDieselB100 * 0.001,
          cng :         annMiles.cng * gN2Opermile.cng * 0.001,
          e85 :         annMiles.e85 * gN2Opermile.e85 * 0.001
        }
      
        return gN2O;
        break;

      default:
        return false;
    }
  },

  boatEmissionsByGas : function(gas) {

    var boat    = this.boat;
    var fuel    = boat.fuel;
    var factors   = this.factors();
    var kgCO2pergal = factors.kgCO2pergal;
    var gCH4pergal  = factors.gCH4pergal;
    var gN2Opergal  = factors.gN2Opergal;

    switch(gas.toLowerCase()) { 
      case 'co2': // Metric tons of CO2
 
        var mtCO2 = {
          gasoline :      boat.annGallons * kgCO2pergal.gasoline/1000,
          diesel :      boat.annGallons * kgCO2pergal.diesel/1000,
          residualFuelOil :   boat.annGallons * kgCO2pergal.residualFuelOil/1000
        }
      
        return mtCO2;
        break;

      case 'ch4': // Metric tons CH4

        var gCH4 = {
          gasoline :      boat.annGallons * gCH4pergal.gasoline,
          diesel :      boat.annGallons * gCH4pergal.diesel,
          residualFuelOil :   boat.annGallons * gCH4pergal.residualFuelOil
        }
      
        return gCH4
        break;

      case 'n2o': // Metric tons N2O

        var gN2O = {
          gasoline :      boat.annGallons * gN2Opergal.gasoline,
          diesel :      boat.annGallons * gN2Opergal.diesel,
          residualFuelOil :   boat.annGallons * gN2Opergal.residualFuelOil
        }
      
        return gN2O
        break;

      default:
        return false;

    }

  },

  totalEmissions : function(fuel) {
    var CO2e;
    var vehicleClass  = ( !(this.vehicleClass != undefined  && this.vehicleClass != '' ) ) ? "car" : this.vehicleClass;
    var fuel      = ( typeof(fuel) != undefined ) ? fuel : '';

    switch ( vehicleClass.toLowerCase() ) {

      case 'car':
        CO2e = this.totalCarEmissions(fuel);
        break;

      case 'truck':
      case 'suv':
      case 'van':
        CO2e = this.totalTruckEmissions(fuel,vehicleClass);
        break;

      case 'boat':
        CO2e = this.totalBoatEmissions(fuel);
        break;

      case 'ecar':
        CO2e = this.totalEcarEmissions(fuel);
        break;

      case 'motorcycle':
        CO2e = this.totalMotorcycleEmissions(fuel);
        break;

      default:
        CO2e = this.totalCarEmissions(fuel);
    }

    return CO2e;

  },

  totalCarEmissions : function(fuel) {

    var mtCO2   = this.carEmissionsByGas('CO2');
    var gCH4  = this.carEmissionsByGas('CH4');
    var gN2O  = this.carEmissionsByGas('N2O');
    var CO2e  = {
      gasoline :      mtCO2.gasoline + ( gCH4.gasoline*this.c.mtCH4toCO2e + gN2O.gasoline*this.c.mtN2OtoCO2e )/1000,
      diesel :      mtCO2.diesel + ( gCH4.diesel*this.c.mtCH4toCO2e + gN2O.diesel*this.c.mtN2OtoCO2e )/1000,
      bioDieselB20 :    mtCO2.bioDieselB20 + ( gCH4.bioDieselB20*this.c.mtCH4toCO2e + gN2O.bioDieselB20*this.c.mtN2OtoCO2e )/1000,
      bioDieselB100 :   mtCO2.bioDieselB100 + ( gCH4.bioDieselB100*this.c.mtCH4toCO2e + gN2O.bioDieselB100*this.c.mtN2OtoCO2e )/1000,
      cng :         mtCO2.cng + ( gCH4.cng*this.c.mtCH4toCO2e + gN2O.cng*this.c.mtN2OtoCO2e )/1000,
      e85 :         mtCO2.e85 + ( gCH4.e85*this.c.mtCH4toCO2e + gN2O.e85*this.c.mtN2OtoCO2e )/1000,
    }
    console.log('totalCarEmissions CO2e',CO2e);

    return ( typeof(fuel) != 'undefined' && fuel != '' ) ? CO2e[fuel.toLowerCase()] : CO2e;

  },

  totalBoatEmissions : function(fuel) {

    var mtCO2     = this.boatEmissionsByGas('CO2');
    var gCH4    = this.boatEmissionsByGas('CH4');
    var gN2O    = this.boatEmissionsByGas('N2O');
    var boatFuel  = this.boat.fuel;
    var CO2e = {
      gasoline :      mtCO2.gasoline + ( gCH4.gasoline*this.c.mtCH4toCO2e + gN2O.gasoline*this.c.mtN2OtoCO2e )/1000/1000,
      diesel :      mtCO2.diesel + ( gCH4.diesel*this.c.mtCH4toCO2e + gN2O.diesel*this.c.mtN2OtoCO2e )/1000/1000,
      residualFuelOil :   mtCO2.residualFuelOil + ( gCH4.residualFuelOil*this.c.mtCH4toCO2e + gN2O.residualFuelOil*this.c.mtN2OtoCO2e )/1000/1000
    }
    if ( typeof(fuel) != 'undefined' && fuel != '' ) {
      return CO2e[fuel.toLowerCase()];
    }
    if ( typeof(boatFuel) != 'undefined' && boatFuel != '' ) {
      return CO2e[boatFuel.toLowerCase()];
    } 
    return CO2e;

  },

  totalEcarEmissions : function() {

    var annMiles = this.ecar.annMiles;
    var mpge = this.ecar.mpge;
    var zipCode = this.ecar.zipCode;
    var total = (annMiles/mpge) * this.c.gasGallonEquiv * this.c.egridSubregionGas[zipSubregion[zipCode].egridSubregion].CO2e/1000;
  console.log('totalEcarEmissions annMiles',annMiles);
  console.log('totalEcarEmissions mpge',mpge);
  console.log('totalEcarEmissions this.c.gasGallonEquiv',this.c.gasGallonEquiv);
  console.log('totalEcarEmissions this.c.egridSubregionGas',this.c.egridSubregionGas);
  console.log('totalEcarEmissions zipSubregion[zipCode].egridSubregion',zipSubregion[zipCode].egridSubregion);
  console.log('totalEcarEmissions this.c.egridSubregionGas[CAMX]',this.c.egridSubregionGas['CAMX']);
    return total;

  }

};

console.log('\nVEHICLE');
console.log('vehicle.car.annMiles',vehicle.car.annMiles);
console.log('vehicle.car.annMiles.gasoline',vehicle.car.annMiles.gasoline);
console.log('vehicle.carGallonsUsed()',vehicle.carGallonsUsed());
console.log('vehicle.totalEmissions()',vehicle.totalEmissions());
console.log('vehicle.totalEmissions(gasoline)',vehicle.totalEmissions('gasoline'))


vehicle.vehicleClass = "boat";
console.log('vehicle.totalEmissions()',vehicle.totalEmissions());
console.log('vehicle.totalEmissions(gasoline)',vehicle.totalEmissions('gasoline'));

vehicle.vehicleClass = "ecar";
vehicle.ecar.annMiles = 5000;
vehicle.ecar.zipCode = 94710;
console.log('vehicle.totalEmissions()',vehicle.totalEmissions());

module.exports = vehicle;