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

    var defaultSiteView = require('./views/biz-site-views').default
    , energySiteView = require('./views/biz-site-views').energy;

    var defaultFleetView = require('./views/biz-fleet-views').default
    , carFleetView = require('./views/biz-fleet-views').car
    , ecarFleetView = require('./views/biz-fleet-views').ecar
    , boatFleetView = require('./views/biz-fleet-views').boat
    , planeFleetView = require('./views/biz-fleet-views').plane
    , listFleetView = require('./views/biz-fleet-views').list;

    var defaultTravelView = require('./views/biz-travel-views').default
    , employeeTravelView = require('./views/biz-travel-views').employee
    , milesTravelView = require('./views/biz-travel-views').miles;

    var defaultCommuteView = require('./views/biz-commute-views').default;

    var defaultShippingView = require('./views/biz-shipping-views').default;

    var defaultServerView = require('./views/biz-server-views').default;
    // Thank You View
    var bizThankYouView = require('./views/biz-thankyou-view');

    Calc.model = new Calculator({
      displayName: 'Business',
      slug: 'business',
      catCodes: catCodes,
      categories: new Categories([
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Site',
          slug: 'site',
          viewList: new ViewList([
            {name: 'default',  view: new defaultSiteView()},
            {name: 'energy',  view: new energySiteView()}
          ]),
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
            {name: 'list',  view: new listFleetView()}
          ]),
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
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Commute',
          slug: 'commute',
          viewList: new ViewList([
            {name: 'default',  view: new defaultCommuteView()}
          ]),
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Shipping',
          slug: 'shipping',
          viewList: new ViewList([
            {name: 'default',  view: new defaultShippingView()}
          ]),
          completed: false
        }),
        ////////////////////////////////////////////////////////
        new Category({
          displayName: 'Server',
          slug: 'server',
          viewList: new ViewList([
            {name: 'default',  view: new defaultServerView()}
          ]),
          completed: false
        })
      ]), //end categories
      thankYouView: new bizThankYouView()
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
