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
  inputViewManager = require('../views/input-view-manager');
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
      ':categoriesCodes/:calculator/:category': 'goToCategory'//,
      //':categoriesCodes/:calculator/:category/:view': 'goToView',
    }
  }); 

  var Controller = Marionette.Controller.extend({
    loadNextInputView: function() {
      var nextViewName = Calc.currentView.getNextView();
      var nextViewObj = _.findWhere(Calc.currentCategoryViews, {name: nextViewName});
      this.showInputView(nextViewObj.view);
    },
    loadPrevInputView: function() {
      console.log('Calc.controller loadPrevView');
      //this.showInputView(prevView);
    },
    goToCategory: function(calculator, category) {
      Calc.currentCategory = category;
      Calc.currentCategoryViews = inputViewManager[calculator][category];
      console.log('Calc.currentCategoryViews');
      console.log(Calc.currentCategoryViews);
      this.showInputView(Calc.currentCategoryViews[0]['view']);
    },
    showInputView: function(view) {
      desktopLayout.inputRegion.show(new view({model: Calc.calcModel}));
    },
    // When the module stops, we need to clean up our views
    hide: function() {
      App.body.close();
      this.data = this.view = null;
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

    var CalcModel = Backbone.Model.extend({
        initialize: function(){
            console.log("New Calc Model");
        }
    });
    
    Calc.calcModel = new CalcModel(options);

    Calc.categories = _.pluck(options.categories, 'slug');
    Calc.currentCategory = Calc.categories[0];
    Calc.currentCategoryViews = inputViewManager[options.slug][Calc.currentCategory];
    App.body.show(desktopLayout);
    desktopLayout.headerRegion.show(new HeaderView({model: Calc.calcModel}));
    desktopLayout.menuRegion.show(new MenuView({model: Calc.calcModel}));
    desktopLayout.footerRegion.show(new FooterView({model: Calc.calcModel}));

    desktopLayout.inputRegion.show(Calc.currentView = new Calc.currentCategoryViews[0]['view']({model: Calc.calcModel}));

    App.vent.on('next', function(event) {
      controller.loadNextInputView();
    });
    
    App.vent.on('prev', function(event) {
      controller.loadPrevInputView();
    });

    App.vent.on('category', function(event) {
      var category = $(event.target).data('category');
      if(category === Calc.currentCategory) return; 
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
