'use strict';
var _ = require('underscore') 
, $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('./app');

module.exports = App.module('individual', function(Calc) {
  var app = App;
  Calc.startWithParent = false; // Calculator must be manually started
  Calc.addInitializer(function(catCodes){
    Calc.baseRoute = '#/individual';

    // Common models and collections
    var Calculator = require('./models/common-models').calculator
    , Category = require('./models/common-models').category
    , Categories = require('./models/common-models').categories
    , ViewModel = require('./models/common-models').viewModel
    , ViewList = require('./models/common-models').viewList;
    
    // Vehicle Input views
    var defaultVehicleView = require('./views/individual/ind-vehicle-default-view')
    , carVehicleView = require('./views/individual/ind-vehicle-car-view')
    , ecarVehicleView = require('./views/individual/ind-vehicle-ecar-view')
    , boatVehicleView = require('./views/individual/ind-vehicle-boat-view')
    , motorcycleVehicleView = require('./views/individual/ind-vehicle-motorcycle-view')
    , classVehicleView = require('./views/individual/ind-vehicle-class-view')
    , optionsVehicleView = require('./views/individual/ind-vehicle-options-view')
    , listVehicleView = require('./views/individual/ind-vehicle-list-view');
    // Public Transit Input Views
    var defaultTransitView = require('./views/individual/ind-transit-default-view');
    // Air Travel Input Views
    var defaultTravelView = require('./views/individual/ind-travel-default-view')
    , flightsTravelView = require('./views/individual/ind-travel-flights-view')
    , lengthTravelView = require('./views/individual/ind-travel-length-view')
    , milesTravelView = require('./views/individual/ind-travel-miles-view')
    , fuelTravelView = require('./views/individual/ind-travel-fuel-view')
    , listTravelView = require('./views/individual/ind-travel-list-view');
    // Home Energy Input Views
    var defaultHomeView = require('./views/individual/ind-home-default-view')
    , addHomeView = require('./views/individual/ind-home-add-view');
    // Thank You View
    var indThankYouView = require('./views/individual/ind-thankyou-view');

    // Specific models and collections
    var Vehicles = require('./models/vehicle-models').vehicles;
    var vehicles = new Vehicles();

    var Flights = require('./models/air-travel-models').flights;
    var flights = new Flights();

    Calc.model = new Calculator({
      displayName: 'Individual',
      slug: 'individual',
      catCodes: catCodes,
      usAverageEmissions: 48,
      categories: new Categories([
        new Category({
          displayName: 'Vehicle',
          slug: 'vehicle',
          viewList: new ViewList([
            {name: 'default',  view: new defaultVehicleView()},
            {name: 'car',  view: new carVehicleView()}, 
            {name: 'ecar',  view: new ecarVehicleView()}, 
            {name: 'motorcycle',  view: new motorcycleVehicleView()}, 
            {name: 'boat',  view: new boatVehicleView()}, 
            {name: 'class',  view: new classVehicleView()}, 
            {name: 'options',  view: new optionsVehicleView()},
            {name: 'list',  view: new listVehicleView({collection: vehicles})}
          ]),
          completed: false,
          vehicles: vehicles
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Public Transit',
          slug: 'transit',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTransitView()}
          ]),
          completed: false,
          // defaults that show up in the view
          trainMileage: 0,
          trainInterval: 'week',
          busMileage: 0,
          busInterval: 'week',
          taxiMileage: 0,
          taxiInterval: 'week',
          ferryMileage: 0,
          ferryInterval: 'week'
          // end of defaults
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Air Travel',
          slug: 'travel',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTravelView()}, 
            {name: 'flights',  view: new flightsTravelView()}, 
            {name: 'length',  view: new lengthTravelView()}, 
            {name: 'miles',  view: new milesTravelView()}, 
            {name: 'fuel',  view: new fuelTravelView()}, 
            {name: 'list',  view: new listTravelView({collection: flights})}
          ]),
          completed: false,
          estimationMethod: "miles",
          useRFI: false,
          //
          numShortFlights: 0,
          numMedEconFlights: 0,
          numMedFirstClassFlights: 0,
          numLongEconFlights: 0,
          numLongEconPlusFlights: 0,
          numLongBizClassFlights: 0,
          numLongFirstClassFlights: 0,
          //
          milesShortFlights: 0,
          milesMedEconFlights: 0,
          milesMedFirstClassFlights: 0,
          milesLongEconFlights: 0,
          milesLongEconPlusFlights: 0,
          milesLongBizClassFlights: 0,
          milesLongFirstClassFlights: 0,
          //
          flights: flights
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Home Energy',
          slug: 'home',
          viewList: new ViewList([
            {name: 'default',  view: new defaultHomeView()},
            {name: 'add',  view: new addHomeView()}
          ]),
          completed: false,
          // defaults that show up in the view
          electricityAmount: 0,
          electricityUnit: 'dollars',
          electricityInterval: 'month',
          naturalGasAmount: 0,
          naturalGasUnit: 'dollars',
          naturalGasInterval: 'month',
          heatingOilAmount: 0,
          heatingOilUnit: 'dollars',
          heatingOilInterval: 'month',
          propaneAmount: 0,
          propaneUnit: 'dollars',
          propaneInterval: 'month',
          gasolineAmount: 0,
          gasolineUnit: 'dollars',
          gasolineInterval: 'month',
          dieselAmount: 0,
          dieselUnit: 'dollars',
          dieselInterval: 'month'
          // end of defaults
        })
      ]), //end categories
      thankYouView: new indThankYouView()
    }); //end Calc.model
    Calc.initCalcLayout = require('./init-calc-layout');
    Calc.initCalcLayout(Calc);
    Calc.initGlobalEvents = require('./init-global-calc-events');
    Calc.initGlobalEvents(Calc);
    Calc.initRouter = require('./init-calc-router');
    Calc.initRouter(Calc);
  });// end Calc.addIntializer

  Calc.addFinalizer(function(){
    Calc.controller.hide();
    Calc.stopListening();
  });
}); 
