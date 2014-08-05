'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, LocalStorage = require('backbone.Localstorage')

var Flight = Backbone.Model.extend({
  defaults: {
    roundTrip: true,
  },
  initialize: function() {
    this.on("change", this.calculateDistance, this)
  },
  calculateDistance: function(event) {
    var self = this;
    var fromIata = this.get('from').slice(0,4);
    var utils = require('../utils/utility');
    utils.getJSON('/airport/icao/'+fromIata , function(response) {
      if(typeof response !== 'string') {
        var fromICAO = response.ICAO;
        var me = self;
        var toIata = self.get('to').slice(0,4);
        utils.getJSON('/airport/icao/'+toIata , function(response) {
          if(typeof response !== 'string') {
            var toICAO =  response.ICAO;
            var icao = require('icao')
            var getGeoDistance = require('../utils/geodist');
            var between = getGeoDistance(
              {lon: icao[fromICAO][1], lat: icao[fromICAO][0]},
              {lon: icao[toICAO][1], lat: icao[toICAO][0]}
            );
            var distance = (me.get('roundTrip') === 'true') ? 2*between : between;
            me.set({distance: distance});

            console.log('The distance traveled on a ');
            console.log((me.get('roundTrip') === 'true') ? 'round-trip':'one-way');
            console.log('flight from ');
            console.log(me.get('from'));
            console.log('to ');
            console.log(me.get('to'));
            console.log('is: '+me.get('distance')+' meters');
          } // end if
        }); // end utils.getJSON
      } // end if 
    }); // end utils .getJSON
  } // end caculateDistance
}); // end Flight

module.exports.flight = Flight;

var Flights = Backbone.Collection.extend({
  model: Flight,
  localStorage: new LocalStorage("FlightssCollection")
});
module.exports.flights = Flights;