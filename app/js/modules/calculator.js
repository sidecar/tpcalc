"use strict";
var _ = require('underscore'), 
  $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../app'),
  DesktopLayout = require('../views/main-layout'),
  HeaderView = require('../views/header-view'),
  FooterView = require('../views/footer-view'),
  MenuLayout = require('../views/menu-layout'),
  MenuIconView = require('../views/menu-icon-view'),
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
      ':categoriesCodes/:calculator/:category': 'goToCategory',
      ':categoriesCodes/:calculator/:category/:view': 'showInputView'
    }
  }); 

  var Controller = Marionette.Controller.extend({
    loadNextInputView: function(viewSlug) {
      var nextViewName = Calc.currentView.getNextView();
      var nextViewObj = _.findWhere(Calc.currentCategoryViews, {name: nextViewName});
      this.showInputView(nextViewObj.view);
    },
    loadPrevInputView: function() {
      console.log('Calc.controller loadPrevView');
      //this.showInputView(prevView);
    },
    goToCategory: function(category) {
      // find the chosen category within the calculators category models
      var categoryModels = Calc.model.get('categories');
      Calc.currentCategory = _.find(categoryModels, function(model) {
        return model.get('slug') === category;
      });
      console.log(Calc.currentCategory);
      // get the last view shown for the chosen cateogory
      var currentView = Calc.currentCategory.get('currentView');

      // show the current input view
      if (currentView) {
        Calc.controller.showInputView(currentView);
      }  else {
        var views = Calc.currentCategory.get('views');
        Calc.controller.showInputView(views[0].view);
      }
    },
    showInputView: function(View) {
      //var nextViewObj = _.findWhere(Calc.currentCategoryViews, {name: view});
      var view = new View();
      Calc.currentCategory.set({currentView: view});
      desktopLayout.inputRegion.show(view);
    },
    // When the module stops, we need to clean up our views
    hide: function() {
      App.body.close();
      this.data = this.view = null;
    },
    getViewBySlug: function(viewSlug) {
      var views = Calc.currentCategory.get('views');
      var viewObj = _.findWhere(views, {name: viewSlug});
      return viewObj.view;
    },
    // Makes sure that this subapp is running so that we can perform everything we need to
    _ensureAppModuleIsRunning: function() {
      App.execute('appModule:start', 'Calc');
    }
  }); 

  Calc.controller = new Controller();
  Calc.router = new Router({controller: Calc.controller});
  var desktopLayout = new DesktopLayout();

  Calc.addInitializer(function(options){
    console.log('Calc.addInitializer');
    // set up the calculator model that contains category models
    var CalcModel = Backbone.Model.extend({
      initialize: function(){}
    });
    var calcModel = Calc.model = new CalcModel({displayName: options.displayName, slug: options.slug});
    var categoryModels = [];
    // Set up models for each category
    var Category = Backbone.Model.extend({
      initialize: function(){}
    });
    _.each(options.categories, function(category) {
      var catModel = new Category(category);
      categoryModels.push(catModel);
    });
    calcModel.set({categories: categoryModels});

    console.log('calcModel = ');
    console.log(calcModel);

    // Set up the first page with the correct calculator category and that categories default view
    App.body.show(desktopLayout);
    desktopLayout.headerRegion.show(new HeaderView({model: Calc.model}));
    desktopLayout.footerRegion.show(new FooterView({model: Calc.model}));

    // set up the main menu and add views to each catgory model 
    var menuLayout = new MenuLayout();
    menuLayout.render();
    // menuLayout has to be shown before it can do anything else
    desktopLayout.menuRegion.show(menuLayout);

    _.each(categoryModels, function(categoryModel) {
      var calculatorSlug = calcModel.get('slug');
      var displayName = categoryModel.get('displayName');
      var categorySlug = categoryModel.get('slug');
      $('.main-menu').append('<li class='+categorySlug+'>'+displayName+'</li>');
      menuLayout.addRegion(categorySlug, '.'+categorySlug);
      menuLayout[categorySlug].show(new MenuIconView({model: categoryModel}));
      categoryModel.set({views: inputViewManager[calculatorSlug][categorySlug]});
    });


    // load the default input view for the first category
    Calc.currentCategory = categoryModels[0];
    var currentInputViews = Calc.currentCategory.get('views');
    Calc.currentInputView = currentInputViews[0].view;
    Calc.controller.showInputView(Calc.currentInputView);

    App.vent.on('next', function(event) {
      var currentView = Calc.currentCategory.get('currentView');
      var nextViewSlug = currentView.getNextView();
      var nextView = Calc.controller.getViewBySlug(nextViewSlug);
      Calc.controller.showInputView(nextView);
      // var categoryCodes = Calc.currentCategoryCodes();
      // var calculator = Calc.currentCalculator();
      // var category = Calc.currentCategory();
      // var nextViewName = Calc.currentView.getNextView();
      // console.log('/#'+categoryCodes+calculator+category+nextViewName);
      // router.navigate('/#'+categoryCodes+calculator+category+nextViewName, {trigger: true});
      // console.log('App.vent.on Calc.model.currentCategoryViews = ');
      // console.log(Calc.model.get('currentCategoryViews'));
    });
    
    App.vent.on('prev', function(event) {
      controller.loadPrevInputView();
    });

    App.vent.on('category', function(event) {
      var newCategory = $(event.target).data('category');
      var oldCategory = Calc.currentCategory.get('slug');
      if(newCategory === oldCategory) return; 
      Calc.controller.goToCategory(newCategory);
    });

  });

  Calc.on('start', function(options) {
  });

  Calc.addFinalizer(function(){
    controller.hide();
    Calc.stopListening();
  }); 
});
