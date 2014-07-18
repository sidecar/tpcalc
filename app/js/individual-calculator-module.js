'use strict';
var _ = require('underscore') 
, $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('./app');

module.exports = App.module('individual', function(Calc) {
  Calc.startWithParent = false; // Calculator must be manually started
  Calc.addInitializer(function(catCodes){
    Calc.baseRoute = '#/individual';

    // Common models and collections
    var Calculator = require('./models/common-models').calculator
    , Category = require('./models/common-models').category
    , Categories = require('./models/common-models').categories
    , ViewModel = require('./models/common-models').viewModel
    , ViewList = require('./models/common-models').viewList;
    // Input views
    var defaultVehicleView = require('./views/ind-vehicle-views').default
    , carVehicleView = require('./views/ind-vehicle-views').car
    , ecarVehicleView = require('./views/ind-vehicle-views').ecar
    , boatVehicleView = require('./views/ind-vehicle-views').boat
    , motorcycleVehicleView = require('./views/ind-vehicle-views').motorcycle
    , classVehicleView = require('./views/ind-vehicle-views').class
    , optionsVehicleView = require('./views/ind-vehicle-views').options
    , typeVehicleView = require('./views/ind-vehicle-views').type
    , listVehicleView = require('./views/ind-vehicle-views').list;
    var defaultTransitView = require('./views/ind-transit-views').default;
    var defaultTravelView = require('./views/ind-travel-views').default
    , addTravelView = require('./views/ind-travel-views').add
    , averageTravelView = require('./views/ind-travel-views').average
    , lengthTravelView = require('./views/ind-travel-views').length
    , milesTravelView = require('./views/ind-travel-views').miles
    , fuelTravelView = require('./views/ind-travel-views').fuel
    , listTravelView = require('./views/ind-travel-views').list;
    var defaultHomeView = require('./views/ind-home-views').default
    , addHomeView = require('./views/ind-home-views').add;
    // Specific models and collections
    var Vehicles = require('./models/vehicle-related-models').vehicles;
    
    Calc.model = new Calculator({
      displayName: 'Individual',
      slug: 'individual',
      catCodes: catCodes,
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
            {name: 'type',  view: new typeVehicleView()},
            {name: 'list',  view: new listVehicleView()}
          ]),
          completed: false,
          vehicles: new Vehicles()
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Public Transit',
          slug: 'transit',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTransitView()}
          ]),
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Air Travel',
          slug: 'travel',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTravelView()}, 
            {name: 'add',  view: new addTravelView()}, 
            {name: 'average',  view: new averageTravelView()}, 
            {name: 'length',  view: new lengthTravelView()}, 
            {name: 'miles',  view: new milesTravelView()}, 
            {name: 'fuel',  view: new fuelTravelView()}, 
            {name: 'list',  view: new listTravelView()}
          ]),
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Home Energy',
          slug: 'home',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTransitView()}
          ]),
          completed: false
        })
      ]),
    });
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
