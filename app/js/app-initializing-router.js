'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, RouteFilter = require('barf')
, App = require('./app')
, WelcomeView = require('./views/shared/welcome-view');

module.exports.router = Marionette.AppRouter.extend({
  appRoutes: {
    ':calculator': 'showDefaultCalculator',
    ':categories/:calculator': 'showSelectCateogries',
    '*any': 'defaultRoute'    
  },
  before: {
    '*any': function (fragment, args, next) {
      //console.log('Attempting to load ' + fragment + ' with arguments: ', args);
      next();
    }
  },
});

//TODO this needs to deal with edge case URLS like a mix of number and alphas
module.exports.controller = Marionette.Controller.extend({
  showSelectCateogries: function(catCodes, calculator) {
    App.execute('calcModule:start', calculator, catCodes);
  },
  showDefaultCalculator: function(calculator) {
    if(calculator !== 'individual' && calculator !== 'business' && calculator !== 'events') {
      this.defaultRoute();
      return;
    } 
    App.execute('calcModule:start', calculator, undefined);
  },
  defaultRoute: function() {
    var welcomeView = new WelcomeView();
    App.body.show(welcomeView);
    App.router.navigate('' , {trigger: true});
  }
});


 