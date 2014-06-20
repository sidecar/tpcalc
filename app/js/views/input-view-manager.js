 var views = {
  individual: {},
  business: {},
  events: {}
 }

  var initIndvidualViews = function() {
    var views = {};
    var vehicleViews = function() {
      var defaultView = require('../views/ind-vehicle-views').default;
      var carView = require('../views/ind-vehicle-views').car;
      var ecarView = require('../views/ind-vehicle-views').ecar;
      var boatView = require('../views/ind-vehicle-views').boat;
      var motorcycleView = require('../views/ind-vehicle-views').motorcycle;
      var classView = require('../views/ind-vehicle-views').class;
      var optionsView = require('../views/ind-vehicle-views').options;
      return [defaultView, carView, ecarView, boatView, classView, optionsView];
    };
    var transportViews = function() {
      var defaultView = require('../views/ind-transport-views').default;
      return [defaultView];
    };
    var airViews = function() {
      var defaultView = require('../views/ind-air-views').default;
      var addView = require('../views/ind-air-views').add;
      var averageView = require('../views/ind-air-views').average;
      var listView = require('../views/ind-air-views').list;
      return [defaultView, addView, averageView, listView];
    };
    var homeViews = function() {
      var defaultView = require('../views/ind-home-views').default;
      var addView = require('../views/ind-home-views').add;
      return [defaultView, addView];
    };
    views.vehicle = vehicleViews();
    views.transport = transportViews();
    views.air = airViews();
    views.home = homeViews();
    return views;
  };

  var init = function() {
    views.individual = initIndvidualViews();
    //views.business = initBusienessViews();
    //views.events = initEventsViews();    
  }

  init();
  module.exports = views;