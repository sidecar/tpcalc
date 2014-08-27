'use strict';
var _ = require('underscore') 
, $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('./app');

module.exports = App.module('events', function(Calc) {
  Calc.startWithParent = false; // Calculator must be manually started
  Calc.addInitializer(function(catCodes){
    Calc.baseRoute = '#/events';

    var Calculator = require('./models/common-models').calculator
    , Category = require('./models/common-models').category
    , Categories = require('./models/common-models').categories
    , ViewModel = require('./models/common-models').viewModel
    , ViewList = require('./models/common-models').viewList
    , Vehicle = require('./models/common-models').vehicle
    , Vehicles = require('./models/common-models').vehicles;

    var defaultTravelView = require('./views/events/evt-travel-default-view')
    , flightAverageTravelView = require('./views/events/evt-travel-flight-average-view')
    , flightLengthTravelView = require('./views/events/evt-travel-flight-length-view')
    , groundTravelView = require('./views/events/evt-travel-ground-view')
    , hotelTravelView = require('./views/events/evt-travel-hotel-view');

    var defaultVenueView = require('./views/events/evt-venue-default-view');

    var defaultWaterView = require('./views/events/evt-water-default-view');

    var defaultMealsView = require('./views/events/evt-meals-default-view');
    // Thank You View
    var evtThankYouView = require('./views/events/evt-thankyou-view');

    var EventsTravelCategory = Category.extend({
        defaults: {
          averageEmissions: 0,
          lengthEmissions: 0,
          groundEmissions: 0,
          hotelEmissions: 0,
          totalEmissions: 0
        },
        initialize: function() {
          this.set({currentInputView: this.get('viewList').first()});
          this.bind('change', function(){this.get('calculator').trigger('change')})
          var sumEmissions = function() {
            var total = this.get('averageEmissions') + this.get('lengthEmissions') + this.get('groundEmissions') + this.get('hotelEmissions')
            this.set({totalEmissions: total});
          };
          this.bind('change:averageEmissions', sumEmissions);
          this.bind('change:lengthEmissions', sumEmissions);
          this.bind('change:groundEmissions', sumEmissions);
          this.bind('change:hotelEmissions', sumEmissions);
        }    
    });

    Calc.model = new Calculator({
      displayName: 'Events',
      slug: 'events',
      catCodes: catCodes,
      categories: new Categories([
        ////////////////////////////////////////////////////////
        new EventsTravelCategory({
          displayName: 'Travel',
          slug: 'travel',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTravelView()},
            {name: 'average',  view: new flightAverageTravelView()}, 
            {name: 'length',  view: new flightLengthTravelView()}, 
            {name: 'ground',  view: new groundTravelView()}, 
            {name: 'hotel',  view: new hotelTravelView()}
          ]),
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Venue',
          slug: 'venue',
          viewList: new ViewList([
            {name: 'default',  view: new defaultVenueView()}
          ]),
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Water',
          slug: 'water',
          viewList: new ViewList([
            {name: 'default',  view: new defaultWaterView()}
          ]),
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Meals',
          slug: 'meals',
          viewList: new ViewList([
            {name: 'default',  view: new defaultMealsView()}
          ]),
          completed: false
        })
      ]), //end categories
      thankYouView: new evtThankYouView()
    }); //end Calc.model
  });
}); 
