'use strict';
// For some reason have to make jquery available maybe in order to assign the $ symbol within Marionette and Backbone
var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
// Have to assign the $ symbol in Marionette and Backbone to jquery
Marionette.$ = Backbone.$ = $;

var App = new Marionette.Application();

function isMobile() {
  var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
  //console.log("Success...Useragent=="+ua);
  return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
}
App.mobile = isMobile();



function startCalcModule(name, args) {
  var calc = App.currentCalc,
  newCalc = App.module(name);

  if (calc && calc !== newCalc) {
    calc.stop();
  }

  App.currentCalc = calc = newCalc;
  //calcName = name;

  calc.start(args);
  calc.on('stop', function() {
    console.log('App.vent before off', App.vent);
    App.vent.off();
    console.log('App.vent after off', App.vent);
  });

  calc.initCalcLayout = require('./init-calc-layout');
  calc.initCalcLayout(calc);
  calc.initGlobalEvents = require('./init-global-calc-events');
  calc.initGlobalEvents(calc);
  calc.initRouter = require('./init-calc-router');
  calc.initRouter(calc);

  var currentCategory = calc.model.get('currentCategory')
    , currentCategorySlug = currentCategory.get('slug')
    , currentViewModel = currentCategory.get('currentInputView');

  App.router.navigate(calc.baseRoute+'/'+currentCategorySlug+'/'+currentViewModel.get('name'), {trigger: true});
};

App.addInitializer(function(options) {
  var individualCalcModule = require('./individual-calculator-module');
  var businessCalcModule = require('./business-calculator-module');
  var eventsCalcModule = require('./events-calculator-module');

  // Set up a controller for the router to use
  var Controller = require('./app-initializing-router').controller;
  App.controller = new Controller();
  // Add the router to the app and pass it the controller
  var Router = require('./app-initializing-router').router;
  App.router = new Router({controller: App.controller});

  //var ModuleManager = require('./utils/module-manager');
  //var modManager = new ModuleManager();
  //App.commands.setHandler('calcModule:start', modManager.startAppModule, modManager);
  App.commands.setHandler('calcModule:start', startCalcModule);

});

App.addRegions({
  body: 'body'
});

//may need to be on 'initialize:after'
App.on('start', function(options) {
  if (Backbone.history) {
    Backbone.history.start();
  }
});

module.exports = App;