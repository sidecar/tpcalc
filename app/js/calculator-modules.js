'use strict';
var _ = require('underscore') 
, $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('./app');

var runExternalInitializationModules = function(Calc) {
    Calc.initCalcLayout = require('./init-calc-layout');
    Calc.initCalcLayout(Calc);
    Calc.initGlobalEvents = require('./init-global-calc-events');
    Calc.initGlobalEvents(Calc);
    Calc.initRouter = require('./init-calc-router');
    Calc.initRouter(Calc);
};  

var addFinalizer = function(Calc) {
  Calc.addFinalizer(function(){
    Calc.controller.hide();
    Calc.stopListening();
  });
};  

module.exports = App.calculator =  App.module('individual', function(Calc) {
  Calc.startWithParent = false; // Calculator must be manually started
  Calc.addInitializer(function(catCodes){
    Calc.baseRoute = '#/individual';
    var CalculatorModel = require('./individual-calc-model');
    Calc.model = new CalculatorModel({
      displayName: 'Individual',
      slug: 'individual',
      catCodes: catCodes
    });
    runExternalInitializationModules(Calc);
  });
  addFinalizer(Calc);
}); 

module.exports = App.calculator =  App.module('business', function(Calc) {
  Calc.startWithParent = false; // Calculator must be manually started
  Calc.addInitializer(function(catCodes){
    Calc.baseRoute = '#/business';
    var CalculatorModel = require('./business-calc-model');
    Calc.model = new CalculatorModel({
      displayName: 'Business',
      slug: 'business',
      catCodes: catCodes
    });
    runExternalInitializationModules(Calc);
  });
  addFinalizer(Calc);
}); 

module.exports = App.calculator =  App.module('events', function(Calc) {
  Calc.startWithParent = false; // Calculator must be manually started
  Calc.addInitializer(function(catCodes){
    Calc.baseRoute = '#/events';
    var CalculatorModel = require('./events-calc-model');
    Calc.model = new CalculatorModel({
      displayName: 'Events',
      slug: 'events',
      catCodes: catCodes
    });
    runExternalInitializationModules(Calc);
  });
  addFinalizer(Calc);
}); 