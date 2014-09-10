'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('./app')
, WelcomeView = require('./views/shared/welcome-view');

module.exports.router = Marionette.AppRouter.extend({
  appRoutes: {
    ':calculator': 'showDefaultCalculator',
    ':categories/:calculator': 'showSelectCateogries',
    '*any': 'defaultMarionetteRoute'    
  }
});

//TODO this needs to deal with edge case URLS like a mix of number and alphas
module.exports.controller = Marionette.Controller.extend({
  showDefaultCalculator: function(calculator) {
    if(calculator !== 'individual' && calculator !== 'business' && calculator !== 'events') {
      this.defaultRoute();
      return;
    } 
    App.router.navigate('' , {trigger: false});
    App.execute('calcModule:start', calculator, undefined);
  },
  showSelectCateogries: function(catCodes, calculator) {
    App.router.navigate('' , {trigger: false});
    App.execute('calcModule:start', calculator, catCodes);
  },
  defaultMarionetteRoute: function() {
    var welcomeView = new WelcomeView();
    App.body.show(welcomeView);
    App.router.navigate('' , {trigger: true});
  }
});


 