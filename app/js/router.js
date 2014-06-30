'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('./app')
, WelcomeView = require('./views/welcome-view');

var config = {defaultUrlCode: 'd'};
config.individual = require('./ind-calc-config');
config.business = require('./biz-calc-config');
config.events = require('./evt-calc-config');


module.exports.router = Marionette.AppRouter.extend({
  appRoutes: {
    ':calculator': 'showDefaultCalculator',
    ':categories/:calculator': 'showSelectCateogries',
    //TODO add the possiblity of starting category specific calculators
    '': 'defaultRoute'    
  }
});

//TODO this needs to deal with edge case URLS like a mix of number and alphas
module.exports.controller = Marionette.Controller.extend({
  showSelectCateogries: function(catCodes, calculator) {
    if(!config[calculator]) return;

    var initObj = config[calculator],
      orderedCatSlugList = _.pluck(initObj.categories, 'slug'),
      requestedCatSlugList = [];

    // if the requested url includes the code for showing default calculator
    if(catCodes === config.defaultUrlCode) {
      //App.execute('appModule:start', 'Calc', config[calculator]);
      initObj.categoryCodes = config.defaultUrlCode;
      // start up the calulator with the init data based on the request codes
      App.execute('appModule:start', 'Calc', initObj);
      return;
    } 

    // strip out duplicates
    catCodes = _.uniq(catCodes, false);
    // order ascending
    catCodes = _.sortBy(catCodes, function(num) {return num});
    // pass the category codes on to be used in the base route of the calc
    initObj.categoryCodes = catCodes;
    // construct a list of requested cats based on codes
    _.each(catCodes, function(catCode, index) {
       requestedCatSlugList.push(orderedCatSlugList[catCode -1]);
    })
    // construct a new array of cat objects based on slugs
    var requestedCatData = _.filter(initObj.categories, function(cat) {
      return _.contains(requestedCatSlugList, cat.slug); 
    });
    // replace the default array of cats with a newly constructed array based on the request codes
    initObj.categories = requestedCatData;
    // start up the calulator with the init data based on the request codes
    App.execute('appModule:start', 'Calc', initObj);
  },
  showDefaultCalculator: function(calculator) {
    if(!config[calculator]) return;
    var initObj = config[calculator];
    App.execute('appModule:start', 'Calc', initObj);
  },
  defaultRoute: function() {
    var welcomeView = new WelcomeView();
    App.body.show(welcomeView);
  }
});


 