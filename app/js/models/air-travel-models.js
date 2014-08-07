'use strict';
var _ = require('underscore')
, Backbone = require('backbone');

var Flight = Backbone.Model.extend({
  defaults: {
    roundTrip: true,
  },
  calculateDistance: function(event) {
    var fromIATA = this.get('from').slice(0,3);
    var toIATA = this.get('to').slice(0,3);
    var airports = require('../utils/airports');
    var fromAirport = _.findWhere(airports, {iata: fromIATA});
    var toAirport = _.findWhere(airports, {iata: toIATA});
    var getGeoDistance = require('geodist');
    var between = getGeoDistance(
      {lon: fromAirport.longitude, lat: fromAirport.latitude},
      {lon: toAirport.longitude, lat: toAirport.latitude},
      {unit: 'mi'}
    );
    var multiplier = (this.get('roundTrip') === 'true') ? 2 : 1; 
    var distance = between*multiplier;

    this.set({fromIATA: fromIATA});
    this.set({toIATA: toIATA});
    this.set({distance: distance});
    // console.log('The distance traveled on a ');
    // console.log((this.get('roundTrip') === 'true') ? 'round-trip':'one-way');
    // console.log('flight from ');
    // console.log(this.get('from'));
    // console.log('to ');
    // console.log(this.get('to'));
    // console.log('is: '+this.get('distance')+' miles');
    // console.log('');
  }, // end caculateDistance
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    return json;
  }
}); // end Flight

module.exports.flight = Flight;

var Flights = Backbone.Collection.extend({
  model: Flight,
  totalEmissions: 0,
    initialize: function() {
        this.bind('add', this.calculateTotalDistance, this);
        this.bind('remove', this.calculateTotalDistance, this);
    },
    calculateTotalDistance: function() {
        var distance = 0;
        this.models.forEach(function(item){
            distance += item.get('distance'); 
        });
        this.distance = distance;
    },
    getTotalDistance: function() {
        return this.distance;
    }
});
module.exports.flights = Flights;

    // var utils = require('../utils/utility');
    // console.log('fromIATA');
    // console.log(fromIATA);
    // utils.getJSON('/airport/icao/'+fromIATA , function(response) {
    //   if(typeof response !== 'string') {
    //     var fromICAO = response.ICAO;
    //     console.log('fromICAO');
    //     console.log(fromICAO);
    //     var me = self;
    //     var toIATA = self.get('to').slice(0,4);
    //     console.log('toIATA');
    //     console.log(toIATA);        
    //     me.set({toIATA: toIATA});
    //     utils.getJSON('/airport/icao/'+toIATA , function(response) {
    //       if(typeof response !== 'string') {
    //         var toICAO =  response.ICAO;
    //         console.log('toICAO');
    //         console.log(toICAO);
    //         var icao = require('icao')
    //         var getGeoDistance = require('geodist');
    //         var between = getGeoDistance(
    //           {lon: icao[fromICAO][1], lat: icao[fromICAO][0]},
    //           {lon: icao[toICAO][1], lat: icao[toICAO][0]},
    //           {unit: 'mi'}
    //         );
    //         var multiplier = (me.get('roundTrip') === 'true') ? 2 : 1; 
    //         var distance = between*multiplier;
    //         me.set({distance: distance});
    //         console.log('The distance traveled on a ');
    //         console.log((me.get('roundTrip') === 'true') ? 'round-trip':'one-way');
    //         console.log('flight from ');
    //         console.log(me.get('from'));
    //         console.log('to ');
    //         console.log(me.get('to'));
    //         console.log('is: '+me.get('distance')+' miles');
    //         console.log('');
    //       } // end if
    //     }); // end utils.getJSON
    //   } // end if 
    // }); // end utils .getJSON