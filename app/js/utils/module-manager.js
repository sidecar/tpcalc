"use strict";
var Marionette = require('backbone.marionette'),
	App = require('../app');

module.exports = Marionette.Controller.extend({
  startAppModule: function(name, args) {
    var newCalc = App.module(name);
    if (App.currentCalc && App.currentCalc !== newCalc) {
      App.currentCalc.stopListening();
      App.currentCalc.stop();
    }
    App.currentCalc = newCalc;
    App.currentCalcName = name;

    App.currentCalc.start(args);

    App.currentCalc.initCalcLayout = require('../init-calc-layout');
    App.currentCalc.initCalcLayout(App.currentCalc);
    App.currentCalc.initGlobalEvents = require('../init-global-calc-events');
    App.currentCalc.initGlobalEvents(App.currentCalc);
    App.currentCalc.initRouter = require('../init-calc-router');
    App.currentCalc.initRouter(App.currentCalc);

    App.currentCalc.on('stop', function() {
      App.currentCalc.controller.hide();
      App.currentCalc.stopListening();
    });
  }
});
