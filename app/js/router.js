"use strict";
var $ = require('jquery')
  , Marionette = require('backbone.marionette')
  , RouteFilter = require('barf')
  , App = require('./app');

var Calc = App.module("Calc");

module.exports.router = Marionette.AppRouter.extend({
    appRoutes: {
      // ':categoriesCodes/:calculator/:category/:inputView': 'showInputView'
      ':calculator/complete/thankyou': 'showThankYouView',
      ':calculator/:category/:inputView': 'showInputView'
    },
    before: {
      ':calculator/:category/:inputView': function(fragment, args, next) {
        if(Calc.model === undefined){ 
          console.log('before route Calc.model === undefined right?');
          console.log(Calc.model);
          App.controller.showDefaultCalculator('individual');
          // App.router.navigate('#/d/individual', {trigger: true});
        }
        next();
      }
    }
  }); 

module.exports.controller  = Marionette.Controller.extend({
    // showInputView: function(catCodes, calculator, category, inputView) {
    showInputView: function(calculator, categorySlug, inputViewSlug) {
      var categoryModel = Calc.model.getCategoryBySlug(categorySlug);
      Calc.model.set({currentCategoryModel: categoryModel});
      var inputViewModel = Calc.model.getViewModelBySlug(inputViewSlug);
      categoryModel.set({currentInputViewModel: inputViewModel});
      Calc.mainLayout.inputRegion.show(inputViewModel.get('view')); 
      Calc.mainLayout.headerRegion.$el.show();
      this.setFooterButtonStates(inputViewModel.get('name'));
    },
    showThankYouView: function(calculator) {
      var thankYouView = Calc.model.get('thankYouView');
      Calc.mainLayout.inputRegion.show(thankYouView); 
      Calc.mainLayout.headerRegion.$el.hide();
      this.setFooterButtonStates('thankyou');
    },
    goToNextCategory: function() {
      var categories = Calc.model.get('categories');
      var currentCategoryModel = Calc.model.get('currentCategoryModel');
      currentCategoryModel.set({completed: true});
      var index = categories.indexOf(currentCategoryModel);
      var newCategory = categories.at(index+1);
      if(newCategory === undefined) {
        App.router.navigate(Calc.baseRoute+'/complete/thankyou', {trigger: true});
        return;
      }
      Calc.model.set({currentCategoryModel: newCategory});
      var newCategorySlug = newCategory.get('slug');
      var inputViewModel = newCategory.getCurrentInputView();
      App.router.navigate(Calc.baseRoute+'/'+newCategorySlug+'/'+inputViewModel.get('name'), {trigger: true});
    },
    goToPrevCategory: function() {
      var categories = Calc.model.get('categories');
      var index = categories.indexOf(Calc.model.get('currentCategoryModel'));
      var prevCategory = categories.at(index-1);

      if(prevCategory === undefined) {
        alert('this is the first category');
        return;
      }
      Calc.model.set({currentCategoryModel: prevCategory});
      var prevCategorySlug = prevCategory.get('slug');
      var inputViewModel = prevCategory.getCurrentInputView();
      App.router.navigate(Calc.baseRoute+'/'+prevCategorySlug+'/'+inputViewModel.get('name'), {trigger: true});
    },
    setFooterButtonStates: function(inputName) {
      var categories = Calc.model.get('categories')
      , initialCat = categories.first()
      , currentCat = Calc.model.get('currentCategoryModel')
      , views = currentCat.get('viewList')
      , initialViewObject = views.first();

      if (inputName === initialViewObject.get('name') && currentCat.get('slug') === initialCat.get('slug')) {
        Calc.footerView.disablePrevBtn();
      } else if (inputName === 'thankyou') {
        Calc.footerView.disableNextBtn();
      } else {
        Calc.footerView.activatePrevBtn();
        Calc.footerView.activateNextBtn();
      }
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
