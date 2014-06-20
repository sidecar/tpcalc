"use strict";
var _ = require('underscore'), 
  $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../app'),
  DesktopLayout = require('../views/desktop-layout'),
  HeaderView = require('../views/header-view'),
  FooterView = require('../views/footer-view'),
  MenuView = require('../views/menu-view'),
  viewManager = require('./view-manager');
  // InputViews = require('../views/ind-vehicle-views'),
  //IndividualCalcModel = require('../data/models/individual-calculator-model');

module.exports = App.module('Calc', function(Calc) {
  // Calculator must be manually started
  Calc.startWithParent = false;

  var currentView, lastView;
  var calcNameMap = {
    individual: 'ind',
    business: 'biz',
    events: 'evt'
  };

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      ':categoriesCodes/:calculator/:category': 'goToCategory',
      ':categoriesCodes/:calculator/:category/:view': 'goToView',
    }
  }); 

  var Controller = Marionette.Controller.extend({
    loadNextInputView: function() {
      console.log('Calc.controller loadNextView');
    },
    loadPrevInputView: function() {
      console.log('Calc.controller loadPrevView');
    },
    loadInputView: function(categoryCodes, calculator, view) {
    },
    // When the module starts, we need to make sure we have the correct view showing
    show: function() {

    },
    // When the module stops, we need to clean up our views
    hide: function() {
      App.body.close();
      this.data = this.view = null;
    },
    test: function() {
      this._ensureAppModuleIsRunning();
    },
    goToCategory: function(calculator, category) {
      Calc.currentCategoryViews = viewManager.getViewsForCategory(calculator, category);
      console.log(Calc.currentCategoryViews);
      desktopLayout.inputRegion.show( new Calc.currentCategoryViews[0]({model: Calc.calcModel}));
    },
    goToView: function(calculator, category, view) {

    },
    // Makes sure that this subapp is running so that we can perform everything we need to
    _ensureAppModuleIsRunning: function() {
      App.execute('appModule:start', 'Calc');
    }
  }); 

  var controller = new Controller();
  var router = new Router({controller: controller});
  var desktopLayout = new DesktopLayout();

  Calc.addInitializer(function(options){
    Calc.calcModel = new Backbone.Model(options);

    Calc.categories = _.pluck(options.categories, 'slug');
    Calc.currentCategory = Calc.categories[0];
    Calc.currentCategoryViews = viewManager.getViewsForCategory(options.slug, Calc.currentCategory);

    App.body.show(desktopLayout);
    desktopLayout.headerRegion.show(new HeaderView({model: Calc.calcModel}));
    desktopLayout.menuRegion.show(new MenuView({model: Calc.calcModel}));
    desktopLayout.footerRegion.show(new FooterView({model: Calc.calcModel}));

    desktopLayout.inputRegion.show( new Calc.currentCategoryViews[0]({model: Calc.calcModel}));

    App.vent.on('next', function() {
      controller.loadNextInputView();
    });
    
    App.vent.on('prev', function() {
      controller.loadPrevInputView();
    });

    App.vent.on('goToCategory', function(target) {
      event.preventDefault();
      var category = $(event.target).data('category');
      controller.goToCategory(options.slug, category);
    });

  });

  Calc.on('start', function(options) {
  });

  Calc.addFinalizer(function(){
      controller.hide();
      Calc.stopListening();
  }); 
});
