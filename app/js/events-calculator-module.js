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

    var defaultTravelView = require('./views/events/evt-travel-views').default
    , flightAverageTravelView = require('./views/events/evt-travel-views').flightAverage
    , flightLengthTravelView = require('./views/events/evt-travel-views').flightLength
    , groundTravelView = require('./views/events/evt-travel-views').ground
    , hotelTravelView = require('./views/events/evt-travel-views').hotel;

    var defaultVenueView = require('./views/events/evt-venue-views').default;

    var defaultWaterView = require('./views/events/evt-water-views').default;

    var defaultMealsView = require('./views/events/evt-meals-views').default;
    // Thank You View
    var evtThankYouView = require('./views/events/evt-thankyou-view');

    Calc.model = new Calculator({
      displayName: 'Business',
      slug: 'events',
      catCodes: catCodes,
      categories: new Categories([
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Travel',
          slug: 'travel',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTravelView()},
            {name: 'flightAverage',  view: new flightAverageTravelView()}, 
            {name: 'flightLength',  view: new flightLengthTravelView()}, 
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
    Calc.initCalcLayout = require('./init-calc-layout');
    Calc.initCalcLayout(Calc);
    Calc.initGlobalEvents = require('./init-global-calc-events');
    Calc.initGlobalEvents(Calc);
    Calc.initRouter = require('./init-calc-router');
    Calc.initRouter(Calc);
  });
  Calc.addFinalizer(function(){
    Calc.controller.hide();
    Calc.stopListening();
  });
}); 
