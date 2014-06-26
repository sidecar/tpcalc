"use strict";
var _ = require('underscore'), 
  $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('./app'),
  MainLayout = require('./views/main-layout'),
  HeaderView = require('./views/header-view'),
  FooterView = require('./views/footer-view'),
  MenuLayout = require('./views/menu-layout'),
  MenuIconView = require('./views/menu-icon-view'),
  inputViewLoader = require('./views/ind-calc-input-view-loader'),
  utils = require('./utils/utility');

console.log('inputViewLoader');
console.log(inputViewLoader);


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
      var category = Calc.getCategoryBySlug(categorySlug);
      Calc.model.set({currentCategory: category});
      var inputViewObj = Calc.getViewObjBySlug(inputView);
      category.set({currentInputViewObj: inputViewObj});
      Calc.mainLayout.inputRegion.show(inputViewObj.view); 
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
      return model.get('slug') === categorySlug;
    });
    return category;
  };

  Calc.getViewObjBySlug = function(viewSlug) {
    var currentCategory = Calc.model.get('currentCategory');
    var viewObjects = currentCategory.get('viewObjects');
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
    var newCategorySlug = newCategory.get('slug');
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
    var prevCategorySlug = prevCategory.get('slug');
    var inputViewToShow = prevCategory.getCurrentInputView();
    App.router.navigate(Calc.baseRoute+'/'+prevCategorySlug+'/'+inputViewToShow.name, {trigger: true});
  };

  Calc.initModels = function(options) {
    // set up the calculator model that contains category models
    var calcModel = Calc.model = new Backbone.Model({displayName: options.displayName, slug: options.slug});
    var categoryModels = [];
    // Set up models for each category
    var Category = Backbone.Model.extend({
      initialize: function(){},
      getCurrentInputView: function() {
        var inputView = this.get('currentInputViewObj');
        if (inputView === undefined) {
          var viewObjects = this.get('viewObjects');
          return viewObjects[0];
        } else {
          return inputView;
        }
      }
    });
    _.each(options.categories, function(category) {
      var catModel = new Category(category);
      categoryModels.push(catModel);
    });
    calcModel.set({categoryModels: categoryModels});
  };

  Calc.initNav = function() {
    var calcModel = Calc.model;
    var categoryModels = calcModel.get('categoryModels');
    var menuLayout = Calc.menuLayout = new MenuLayout();
    // have to call show on the menuLayout before it can do anything else
    Calc.mainLayout.menuRegion.show(menuLayout);
    //add views to each catgory model
    _.each(categoryModels, function(categoryModel) {
      var calculatorSlug = calcModel.get('slug');
      var displayName = categoryModel.get('displayName');
      var categorySlug = categoryModel.get('slug');
      $('.main-menu').append('<li class='+categorySlug+'></li>');
      menuLayout.addRegion(categorySlug, '.'+categorySlug);
      menuLayout[categorySlug].show(new MenuIconView({model: categoryModel, categorySlug: categorySlug, displayName: displayName}));
      categoryModel.set({viewObjects: inputViewLoader[calculatorSlug][categorySlug]});
    });
  };

  Calc.initLayout = function() {
    var calcModel = Calc.model;
    var categoryModels = calcModel.get('categoryModels');
    var mainLayout = Calc.mainLayout = new MainLayout();
     // Set up the first page with the correct calculator category and that categories default view
    App.body.show(mainLayout);
    mainLayout.headerRegion.show(new HeaderView({model: calcModel}));
    mainLayout.footerRegion.show(new FooterView({model: calcModel}));
    Calc.initNav();
    //get first category set it on the calc model
    var currentCategory = categoryModels[0];
    var currentCategorySlug = currentCategory.get('slug');
    calcModel.set({currentCategory: currentCategory}); 
    var inputViewToShow = currentCategory.getCurrentInputView();
    mainLayout.inputRegion.show(inputViewToShow.view);
  };

  Calc.initEventListeners = function() {
    App.vent.on('next', function(event) {
      var currentCategory = Calc.model.get('currentCategory');
      var currentCategorySlug = currentCategory.get('slug');
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
      var currentCategorySlug = currentCategory.get('slug');
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
      var oldCategorySlug = oldCategory.get('slug');
      if(newCategorySlug === oldCategorySlug) return; 
      var newCategory = Calc.getCategoryBySlug(newCategorySlug);
      var currentViewObj = newCategory.getCurrentInputView();
      Calc.model.set({currentCategory: newCategory});
      App.router.navigate(Calc.baseRoute+'/'+newCategorySlug+'/'+currentViewObj.name, {trigger: true});
    });
  };

  Calc.addInitializer(function(options){
    console.log(options.slug + 'Calc  initializing');
    Calc.baseRoute = '#/'+options.categoryCodes+'/'+options.slug;
    Calc.baseRoute = '#/'+options.slug;
    Calc.initModels(options);
    Calc.initLayout();
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