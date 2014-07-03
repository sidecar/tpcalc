"use strict";
var _ = require('underscore') 
  ,$ = require('jquery')
  , Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('./app')
  , MainLayout = require('./views/main-layout')
  , HeaderView = require('./views/header-view')
  , FooterView = require('./views/footer-view')
  , MenuLayout = require('./views/menu-layout')
  , MenuIconView = require('./views/menu-icon-view')
  , SummaryView = require('./views/summary-view')
  , HelpView = require('./views/help-view')
  , Bootstrap = require('bootstrap')
  // , Popup = require('magnific-popup')
  , utils = require('./utils/utility');

module.exports = App.module('Calc', function(Calc) {
  // Calculator must be manually started
  Calc.startWithParent = false;

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      // ':categoriesCodes/:calculator/:category/:inputView': 'showInputView'
      ':calculator/:category/:inputView': 'showInputView'
    }
  }); 

  var Controller = Marionette.Controller.extend({
    // showInputView: function(catCodes, calculator, category, inputView) {
    showInputView: function(calculator, categorySlug, inputView) {
      var categoryModel = Calc.getCategoryBySlug(categorySlug);
      Calc.model.set({currentCategory: categoryModel});
      var inputViewObj = Calc.getViewObjBySlug(inputView);
      categoryModel.set({currentInputViewObj: inputViewObj});
      Calc.mainLayout.inputRegion.show(inputViewObj.view); 
      Calc.setFooterButtonStates(inputViewObj);
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

  Calc.getCategoryBySlug = function(categorySlug) {
    // find the chosen category within the calculators category models
    var categoryModels = Calc.model.get('categoryModels');
    var category = _.find(categoryModels, function(model) {
      var category = model.get('category');
      return category.slug === categorySlug;
    });

    return category;
  };

  Calc.getViewObjBySlug = function(viewSlug) {
    var currentCategoryModel = Calc.model.get('currentCategory');
    var viewObjects = currentCategoryModel.get('viewObjects');
    var viewObj = _.findWhere(viewObjects, {name: viewSlug});
    return viewObj;
  };

  Calc.goToNextCategory = function() {
    var categoryModels = Calc.model.get('categoryModels');
    var currentCategoryNum = _.indexOf(categoryModels, Calc.model.get('currentCategory'));
    var newCategoryNum = currentCategoryNum + 1;
    var newCategory = categoryModels[newCategoryNum];
    if(newCategory === undefined) {
      alert('this is the final category');
      return;
    }
    Calc.model.set({currentCategory: newCategory});
    var newCategorySlug = newCategory.getSlug();
    var inputViewToShow = newCategory.getCurrentInputView();
    App.router.navigate(Calc.baseRoute+'/'+newCategorySlug+'/'+inputViewToShow.name, {trigger: true});
  };

  Calc.goToPrevCategory = function() {
    var categoryModels = Calc.model.get('categoryModels');
    var currentCategoryNum = _.indexOf(categoryModels, Calc.model.get('currentCategory'));
    var prevCategoryNum = currentCategoryNum - 1;
    var prevCategory = categoryModels[prevCategoryNum];
    if(prevCategory === undefined) {
      alert('this is the first category');
      return;
    }
    Calc.model.set({currentCategory: prevCategory});
    var prevCategorySlug = prevCategory.getSlug();
    var inputViewToShow = prevCategory.getCurrentInputView();
    App.router.navigate(Calc.baseRoute+'/'+prevCategorySlug+'/'+inputViewToShow.name, {trigger: true});
  };

  Calc.setFooterButtonStates = function(currentInputViewObj) {
    var categoryModels = this.model.get('categoryModels');
    var initialCat = categoryModels[0].get('category');
    var currentCat = this.model.get('currentCategory').get('category');
    var initialViewObject = currentCat.views[0];
    if (currentInputViewObj.name === initialViewObject.name && currentCat.slug === initialCat.slug) {
      console.log('disablePrevBtn');
      Calc.footerView.disablePrevBtn();
    } else {
      console.log('activatePrevBtn');
      Calc.footerView.activatePrevBtn();
    }
  };

  Calc.initModels = function(options) {
    // set up the calculator model that contains category models
    var calcModel = Calc.model = new Backbone.Model({
      displayName: options.displayName, 
      slug: options.slug
    });

    var categoryModels = [];

    // Set up models for each category
    var Category = Backbone.Model.extend({
      initialize: function(options){
        var categoryObj = options.category;
        var viewObjects = categoryObj.views;
        this.set({viewObjects: viewObjects});
        var currentInputViewObj = _.findWhere(viewObjects, {name: 'default'});
        this.set({currentInputViewObj: currentInputViewObj});
      },
      getCurrentInputView: function() {
        var inputView = this.get('currentInputViewObj');
        if (inputView === undefined) {
          var viewObjects = this.get('viewObjects');
          return viewObjects[0];
        } else {
          return inputView;
        }
      },
      getDisplayName: function() {
        return this.get('category').displayName;
      },
      getSlug: function() {
        return this.get('category').slug;
      },
      isDisplayingInitialInputView: function() {

        var slug = this.get('category').slug;
        var viewObjects = this.get('viewObjects');
        console.log(viewObjects);
        // if (slug === cu)
        // return false;
      }
    });

    _.each(options.categories, function(category) {
      var catModel = new Category({category: category});
      categoryModels.push(catModel);
    });

    calcModel.set({categoryModels: categoryModels});
    var currentCategoryModel = categoryModels[0];
    calcModel.set({currentCategory: currentCategoryModel}); 

  };

  Calc.initLayout = function(options) {
    var calcModel = Calc.model
    , categoryModels = calcModel.get('categoryModels')
    , currentCategoryModel = calcModel.get('currentCategory')
    , inputViewObj = currentCategoryModel.getCurrentInputView();
    
    var mainLayout = Calc.mainLayout = new MainLayout();  
    var menuLayout = Calc.menuLayout = new MenuLayout({categories: categoryModels});
    var headerView = Calc.headerView = new HeaderView({model: calcModel});
    var helpView = Calc.helpView = new HelpView({model: calcModel});
    var footerView = Calc.footerView = new FooterView({model: calcModel});
    var summaryView = Calc.summaryView = new SummaryView({model: calcModel});

    App.body.show(mainLayout); // have to call show on a layout before it can do anything else
    mainLayout.headerRegion.show(headerView);
    mainLayout.helpRegion.show(helpView);
    mainLayout.footerRegion.show(footerView);
    mainLayout.menuRegion.show(menuLayout);
    mainLayout.inputRegion.show(inputViewObj.view);
    mainLayout.summaryRegion.show(summaryView);
    Calc.setFooterButtonStates(inputViewObj);
  };

  Calc.initEventListeners = function() {
    App.vent.on('next', function(event) {
      var currentCategory = Calc.model.get('currentCategory');
      var currentCategorySlug = currentCategory.getSlug();
      var currentViewObj = currentCategory.get('currentInputViewObj');
      var currentView = currentViewObj.view;
      var nextViewSlug = currentView.getNextViewSlug();
      
      if(nextViewSlug === '' || nextViewSlug === undefined || nextViewSlug === false) {
        Calc.goToNextCategory();
        return;
      }
      
      var nextViewObj = Calc.getViewObjBySlug(nextViewSlug);
      if(nextViewObj === undefined){ 
        alert('next view doesnt exist');
        return;
      }

      var nextView = nextViewObj.view;
      nextView.previousViewObj = currentViewObj;
      currentCategory.set({currentInputViewObj: nextViewObj});
      App.router.navigate(Calc.baseRoute+'/'+currentCategorySlug+'/'+nextViewObj.name, {trigger: true});
    });
    
    App.vent.on('prev', function(event) {     
      var currentCategory = Calc.model.get('currentCategory');
      var currentCategorySlug = currentCategory.getSlug();
      var currentViewObj = currentCategory.get('currentInputViewObj');
      var currentView = currentViewObj.view;
      var previousViewObj = currentView.previousViewObj;
      if(previousViewObj === undefined){ 
        Calc.goToPrevCategory();
        return;
      }
      currentCategory.set({currentInputViewObj: previousViewObj});
      App.router.navigate(Calc.baseRoute+'/'+currentCategorySlug+'/'+previousViewObj.name, {trigger: true});
    });

    App.vent.on('category', function(event) { 
      var newCategorySlug = $(event.target).data('category');
      var oldCategory = Calc.model.get('currentCategory');
      var oldCategorySlug = oldCategory.getSlug();
      if(newCategorySlug === oldCategorySlug) return; 
      var newCategory = Calc.getCategoryBySlug(newCategorySlug);
      var currentViewObj = newCategory.getCurrentInputView();
      Calc.model.set({currentCategory: newCategory});
      App.router.navigate(Calc.baseRoute+'/'+newCategorySlug+'/'+currentViewObj.name, {trigger: true});
    });  

    App.vent.on('help', function(event) { 
      $('#helpModal').modal(options);
    });  

  };

  Calc.addInitializer(function(options){
    console.log(options.slug + 'Calc  initializing');
    Calc.baseRoute = '#/'+options.categoryCodes+'/'+options.slug;
    Calc.baseRoute = '#/'+options.slug;
    Calc.initModels(options);
    Calc.initLayout(options);
    Calc.initEventListeners();
  });

  Calc.on('start', function(options) {
    console.log(options.slug + 'Calc  started');
  });

  Calc.addFinalizer(function(){
    console.log('Calc.addFinalizer');
    Calc.controller.hide();
    Calc.stopListening();
  }); 
});