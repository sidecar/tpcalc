"use strict";
var _ = require('underscore'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../app'),
  Calc = require('./calculator'),
  DesktopLayout = require('../views/desktop-layout'),
  IndividualVehicleViews = require('../views/ind-vehicle-views');


module.exports = App.module('ViewManager', function(ViewManager) {

 var views = {
  individual: {
    vehicle: {},
    transport: {},
    air: {},
    home: {},
  },
  business: {},
  events: {}
 }

views.individual.vehicle.defaultView = (function(){
  var View = require('../views/ind-vehicle-views').default;
  return View;
}())
 
views.individual.vehicle.carView = (function(){
  var View = require('../views/ind-vehicle-views').car;
  return View;
}())
 
views.individual.vehicle.boatView = (function(){
  var View = require('../views/ind-vehicle-views').boat;
  return View;
}())
 
views.individual.vehicle.ecarView = (function(){
  var View = require('../views/ind-vehicle-views').ecar;
  return View;
}())
 
views.individual.vehicle.motorcycleView = (function(){
  var View = require('../views/ind-vehicle-views').motorcycle;
  return View;
}())



views.individual.transport.defaultView = (function(){
  var View = require('../views/ind-transport-views');
  return View;
}())
 


this.getViewsForCategory = function(calculator, category) {
    // if(category === 'vehicle') {
    //   console.log('view manager: category === vehicle');
    //   return _.toArray(views.individual.vehicle);
    // } else if () {
    // }
    var viewArray;
    switch (category) {
      case 'vehicle':
        viewArray =  _.toArray(views.individual.vehicle);
        break;
      case 'transport':
        viewArray = _.toArray(views.individual.transport);
        break;
    }
    return viewArray;
  }
});