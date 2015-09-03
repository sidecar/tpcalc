'use strict';
var _ = require('underscore') 
, $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('./app');

module.exports = App.module('business', function(Calc) {
  Calc.startWithParent = false; // Calculator must be manually started
  Calc.addInitializer(function(catCodes){
    Calc.baseRoute = '#/business';

    var Calculator = require('./models/common-models').calculator
    , Category = require('./models/common-models').category
    , Categories = require('./models/common-models').categories
    , ViewModel = require('./models/common-models').viewModel
    , ViewList = require('./models/common-models').viewList
    , Vehicle = require('./models/common-models').vehicle
    , Vehicles = require('./models/common-models').vehicles;

    var siteDefaultView = require('./views/business/biz-site-default-view')
    , siteAddView = require('./views/business/biz-site-add-view');

    var defaultFleetView = require('./views/business/biz-fleet-default-view')
    , carFleetView = require('./views/business/biz-fleet-car-view')
    , ecarFleetView = require('./views/business/biz-fleet-ecar-view')
    , boatFleetView = require('./views/business/biz-fleet-boat-view')
    , planeFleetView = require('./views/business/biz-fleet-plane-view')
    , listFleetView = require('./views/business/biz-fleet-list-view');

    var defaultTravelView = require('./views/business/biz-travel-default-view')
    , employeeTravelView = require('./views/business/biz-travel-employee-view')
    , milesTravelView = require('./views/business/biz-travel-miles-view');

    var defaultCommuteView = require('./views/business/biz-commute-default-view');

    var defaultShippingView = require('./views/business/biz-shipping-default-view');

    var defaultServerView = require('./views/business/biz-server-default-view');
    // Thank You View
    var bizThankYouView = require('./views/business/biz-thankyou-view');

    //
    var FleetVehicles = require('./models/fleet-models').fleetVehicles;
    var fleetVehicles = new FleetVehicles();

    Calc.model = new Calculator({
      displayName: 'Business',
      slug: 'business',
      emissionsUnit : 'tonnes',
      catCodes: catCodes,
      categories: new Categories([
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Site',
          slug: 'site',
          viewList: new ViewList([
            {name: 'default',  view: new siteDefaultView()},
            {name: 'add',  view: new siteAddView()}
          ]),
          // defaults that show up in the view
          zip: '',
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
          dieselInterval: 'month',
          // end of defaults
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Fleet',
          slug: 'fleet',
          viewList: new ViewList([
            {name: 'default',  view: new defaultFleetView()},
            {name: 'car',  view: new carFleetView()},
            {name: 'ecar',  view: new ecarFleetView()},
            {name: 'boat',  view: new boatFleetView()},
            {name: 'plane',  view: new planeFleetView()},
            {name: 'list',  view: new listFleetView({collection: fleetVehicles})}
          ]),
          fleetVehicles: fleetVehicles,
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Air Travel',
          slug: 'travel',
          viewList: new ViewList([
            {name: 'default',  view: new defaultTravelView()}, 
            {name: 'employee',  view: new employeeTravelView()}, 
            {name: 'miles',  view: new milesTravelView()}
          ]),
          method: "employee",
          useRFI: false,
          numEmployeesTraveling: 0,
          shortHaulPerEmp: 0,
          medHaulPerEmp: 0,
          longHaulPerEmp: 0,
          totalAnnMiles: 0,
          percentShortHaulMiles: 0,
          percentMedHaulMiles: 0,
          percentLongHaulMiles: 0,
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Commute',
          slug: 'commute',
          viewList: new ViewList([
            {name: 'default',  view: new defaultCommuteView()}
          ]),
          busEmployees: 0,
          busMileage: 0,
          calculator: 0,
          carEmployees: 0,
          carMileage: 0,
          ferryEmployees: 0,
          ferryMileage: 0,
          taxiEmployees: 0,
          taxiMileage: 0,
          trainEmployees: 0,
          trainMileage: 0,
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Shipping',
          slug: 'shipping',
          viewList: new ViewList([
            {name: 'default',  view: new defaultShippingView()}
          ]),
          trainDistance: 0,
          trainShipments: 0,
          trainWeight: 0,
          truckDistance: 0,
          truckShipments: 0,
          truckWeight: 0,
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Server',
          slug: 'server',
          viewList: new ViewList([
            {name: 'default',  view: new defaultServerView()}
          ]),
          zip: '',
          numServers: 0,
          completed: false
        })
      ]), //end categories
      thankYouView: new bizThankYouView()
    }); //end Calc.model
  });

}); 
