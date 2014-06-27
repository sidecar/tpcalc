"use strict";
var Marionette = require('backbone.marionette'),
	App = require('../app');

module.exports = Marionette.Controller.extend({
  startAppModule: function(name, args) {
    var newApp = App.module(name);
    // Taking this out because I need to stop the calc mod then restart with a new model
    // if (this.currentApp === newApp) {
    //     return;
    // }
    if (this.currentApp) {
        this.currentApp.stop();
        App.vent.trigger('appModule:stopped', this.currentAppName);
    }
    this.currentApp = newApp;
    this.currentAppName = name;
    newApp.start(args);
    App.vent.trigger('appModule:started', name);
  }
});