/* ----------------------------------------------------
 * EVENTS CALCULATOR - Spreadsheet Calculation Conversions
 * ==================================================== */

/* -------------------------------------
 * Event Venue
 * ------------------------------------- */

var constants = require('./emissions-constants');
var zipSubregion = require('./zip-subregions');

var venue = {

  c :         constants,
  zipCode :       94111,
  venueSize :     500,  // square feet
  days :        2,
  CBECSGreenE: 0.049,

  egridSubregion : function(zip) {
    
    var zip = ( zip == undefined ) ? this.zipCode : zip;
    return zipSubregion[zip]['egridSubregion'];

  },
  
  electricityFactor : function(zip) {

    var factor = this.c.egridSubregionGas[this.egridSubregion(zip)];
    return factor;

  },

  gasFactor :   0.055,

  totalEmissions : function() {
    
    var CO2e = (this.venueSize * this.days * this.electricityFactor(this.zipCode).CO2e * this.CBECSGreenE) / 2204.6;
    console.log('CO2e', CO2e);
    return CO2e;

  }

}

module.exports = venue;

