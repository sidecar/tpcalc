"use strict";
var _ = require('underscore'), 
  $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../app'),
  MainLayout = require('../views/main-layout'),
  HeaderView = require('../views/header-view'),
  FooterView = require('../views/footer-view'),
  MenuLayout = require('../views/menu-layout'),
  MenuIconView = require('../views/menu-icon-view'),
  inputViewManager = require('../views/input-view-manager');

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
    goToCategory: function(category) {
      // get the last view shown for the chosen cateogory
      var currentView = category.get('currentView');
      if (currentView == undefined) {
        var viewObjects = category.get('views');
        currentView = viewObjects[0]['view']
      }
      Calc.model.set({currentCategory: category});
      Calc.mainLayout.inputRegion.show(currentView);
    },
    showInputView: function(view) {
      var currentCategory = Calc.model.get('currentCategory');
      currentCategory.set({currentView: view});
      Calc.mainLayout.inputRegion.show(view);
    },
    getCategoryBySlug: function(categorySlug) {
      // find the chosen category within the calculators category models
      var categoryModels = Calc.model.get('categories');
      var category = _.find(categoryModels, function(model) {
        return model.get('slug') === categorySlug;
      });
      return category;
    },
    getViewBySlug: function(viewSlug) {
      var views = Calc.currentCategory.get('views');
      var viewObj = _.findWhere(views, {name: viewSlug});
      return viewObj .view;
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

  Calc.controller = new Controller();
  Calc.router = new Router({controller: Calc.controller});

  Calc.initializeModels = function(options) {
    // set up the calculator model that contains category models
    var CalcModel = Backbone.Model.extend({
      initialize: function(){}
    });
    var calcModel = Calc.model = new CalcModel({displayName: options.displayName, slug: options.slug});
    Calc.categoryModels = [];

    // Set up models for each category
    var Category = Backbone.Model.extend({
      initialize: function(){}
    });

    _.each(options.categories, function(category) {
      var catModel = new Category(category);
      Calc.categoryModels.push(catModel);
    });
    calcModel.set({categories: Calc.categoryModels});
  };

  Calc.intializeViews = function() {
    Calc.mainLayout = new MainLayout();
    var calcModel = Calc.model;
    var categoryModels = Calc.categoryModels;
    var mainLayout = Calc.mainLayout;
    var menuLayout = new MenuLayout();
     // Set up the first page with the correct calculator category and that categories default view
    App.body.show(Calc.mainLayout);
    mainLayout.headerRegion.show(new HeaderView({model: calcModel}));
    mainLayout.footerRegion.show(new FooterView({model: calcModel}));
    //pretty sure you have to render the layout before showing it
    menuLayout.render();
    // have to call show on the menuLayout before it can do anything else
    mainLayout.menuRegion.show(menuLayout);
    //add views to each catgory model
    _.each(categoryModels, function(categoryModel) {
      var calculatorSlug = calcModel.get('slug');
      var displayName = categoryModel.get('displayName');
      var categorySlug = categoryModel.get('slug');
      $('.main-menu').append('<li class='+categorySlug+'>'+displayName+'</li>');
      menuLayout.addRegion(categorySlug, '.'+categorySlug);
      menuLayout[categorySlug].show(new MenuIconView({model: categoryModel}));
      categoryModel.set({views: inputViewManager[calculatorSlug][categorySlug]});
    });
    //get first category set it on the calc model
    var currentCategory = categoryModels[0];
    calcModel.set({currentCategory: currentCategory}); 
    // get the first view from this categories input views and set it as the current input view for the category model
    var currentInputViews = currentCategory.get('views');
    var currentInputView = currentInputViews[0].view;
    currentCategory.set({currentInputView: currentInputView});
    // show the input view
    Calc.controller.showInputView(currentInputView);
  };

  Calc.initializeEventListeners = function() {
    App.vent.on('next', function(event) {
      var currentCategory = Calc.model.get('currentCategory');
      var currentView = currentCategory.get('currentView');
      var nextViewSlug = currentView.getNextViewSlug();
      var nextView = Calc.controller.getViewBySlug(nextViewSlug);
      Calc.controller.showInputView(nextView);
    });
    
    App.vent.on('prev', function(event) {
      controller.loadPrevInputView();
    });

    App.vent.on('category', function(event) {
      var newCategorySlug = $(event.target).data('category');
      var oldCategory = Calc.model.get('currentCategory');
      var oldCategorySlug = oldCategory.get('slug');
      if(newCategorySlug === oldCategorySlug) return; 
      var newCategory = Calc.controller.getCategoryBySlug(newCategorySlug);
      Calc.controller.goToCategory(newCategory);
    });
  };

  Calc.addInitializer(function(options){
    console.log('Calc.addInitializer');
    Calc.initializeModels(options);
    Calc.intializeViews();
    Calc.initializeEventListeners();
  });

  Calc.on('start', function(options) {
    console.log('Calc.on start');
  });

  Calc.addFinalizer(function(){
    console.log('Calc.addFinalizer');
    controller.hide();
    Calc.stopListening();
  }); 
});