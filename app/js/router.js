'use strict';
var _ = require('underscore'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('./app'),
  WelcomeView = require('./views/welcome-view');

module.exports.router = Marionette.AppRouter.extend({
  appRoutes: {
    ':categories/:calculator': 'showCalculator',
    '*other': 'defaultRoute'    
  }
});

var calcInitData = require('./data/calc-init-data');

//TODO this needs to deal with edge case URLS like a mix of number and alphas
module.exports.controller = Marionette.Controller.extend({
  showCalculator: function(catCodes, calculator) {
    if(!calcInitData[calculator]) return;
    // if the requested url includes the code for showing default calculator
    if(catCodes === calcInitData.config.defaultUrlCode) {
      App.execute('appModule:start', 'Calc', calcInitData[calculator]);
      return;
    } 
    var initObj = calcInitData[calculator],
      orderedCatSlugList = _.pluck(initObj.categories, 'slug'),
      requestedCatSlugList = [];
    // strip out duplicates
    catCodes = _.uniq(catCodes, false);
    // order ascending
    catCodes = _.sortBy(catCodes, function(num) {return num});
    // construct a list of requested cats based on codes
    _.each(catCodes, function(catCode, index) {
       requestedCatSlugList.push(orderedCatSlugList[catCode -1]);
    })
    // construct a new array of cat objects based on slugs
    // order is always correct so far but is it garunteed?
    var requestedCatData = _.filter(initObj.categories, function(cat) {
      return _.contains(requestedCatSlugList, cat.slug); 
    });
    // replace the default array of cats with a newly constructed array based on the request codes
    initObj.categories = requestedCatData;
    // start up the calulator with the init data based on the request codes
    App.execute('appModule:start', 'Calc', initObj);
  },
  defaultRoute: function() {
    var welcomeView = new WelcomeView();
    App.body.show(welcomeView);
  }
});


 