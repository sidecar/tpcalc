"use strict";
var _ = require('underscore'), 
  $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../app'),
  DesktopLayout = require('../views/desktop-layout'),
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
    showInputView: function(categoryCodes, calculator, category, view) {
      var nextViewObj = _.findWhere(Calc.currentCategoryViews, {name: view});
      desktopLayout.inputRegion.show(new nextViewObj.view({model: Calc.calcModel}));
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
    console.log('Calc.addInitializer');

    //set up the calculator model that contains category models

    var CalcModel = Backbone.Model.extend({
      initialize: function(){}
    });
    var calcModel = Calc.calcModel = new CalcModel({displayName: options.displayName, slug: options.slug});
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
    desktopLayout.headerRegion.show(new HeaderView({model: Calc.calcModel}));
    desktopLayout.footerRegion.show(new FooterView({model: Calc.calcModel}));


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
      console.log('categoryModel = ');
      console.log(categoryModel);
    });

    // set up views for each cateogry


    // load the default input view for this category
    //desktopLayout.inputRegion.show(Calc.currentView = new Calc.currentCategoryViews[0]['view']({model: Calc.calcModel}));
    
    // var calcName =  calcModel.get('slug');
    // _.each(categories, function(category) {
    //   var category = calcModel.get()
    //   var views = inputViewManager.getViewsForCategory(calcName, category);
    //   calcModel.set({categories[category].views: views});
    // });

    // //Calc.calcModel.set({currentCategoryViews: Calc.currentCategoryViews})


    // var categorySlugs = _.pluck(options.categories, 'slug');
    // calcModel.set({currentCategory: categorySlugs[0]});
    // Calc.currentCategory = categorySlugs[0];
    // Calc.currentCategoryViews = inputViewManager[options.slug][Calc.currentCategory];
    



    App.vent.on('next', function(event) {
      // var categoryCodes = Calc.currentCategoryCodes();
      // var calculator = Calc.currentCalculator();
      // var category = Calc.currentCategory();
      // var nextViewName = Calc.currentView.getNextView();
      //console.log('/#'+categoryCodes+calculator+category+nextViewName);
      //router.navigate('/#'+categoryCodes+calculator+category+nextViewName, {trigger: true});
      // console.log('App.vent.on Calc.calcModel.currentCategoryViews = ');
      // console.log(Calc.calcModel.get('currentCategoryViews'));
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
