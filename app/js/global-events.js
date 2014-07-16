"use strict";
var $ = require('jquery')
  , App = require('./app');

var Calc = App.module("Calc");

module.exports = function() {

    App.vent.on('next', function(event) {
      var currentCategoryModel = Calc.model.get('currentCategoryModel')
      , currentCategorySlug = currentCategoryModel.get('slug')
      , currentViewModel = currentCategoryModel.get('currentInputViewModel')
      , currentView = currentViewModel.get('view');
      currentView.getNextInputView();
    });
    App.vent.on('prev', function(event) {     
      var currentCategoryModel = Calc.model.get('currentCategoryModel')
      , currentCategorySlug = currentCategoryModel.get('slug')
      , currentViewModel = currentCategoryModel.get('currentInputViewModel')
      , previousViewModel = currentViewModel.get('previousViewModel');
      if(previousViewModel === undefined){ 
        Calc.controller.goToPrevCategory();
        return;
      } else {
        currentCategoryModel.set({currentInputViewModel: previousViewModel});
        App.router.navigate(Calc.baseRoute+'/'+currentCategorySlug+'/'+previousViewModel.get('name'), {trigger: true});
      }
    });

    App.vent.on('showInputView', function(slug) {
      var currentCategoryModel = Calc.model.get('currentCategoryModel')
      , currentCategorySlug = currentCategoryModel.get('slug')
      , currentViewModel = currentCategoryModel.get('currentInputViewModel')
      , nextViewModel = Calc.model.getViewModelBySlug(slug);
      nextViewModel.set({previousViewModel: currentViewModel});
      currentCategoryModel.set({currentInputViewModel: nextViewModel});
      App.router.navigate(Calc.baseRoute+'/'+currentCategorySlug+'/'+nextViewModel.get('name'), {trigger: true});
    });

    App.vent.on('goToNextCategory', function() {
      Calc.controller.goToNextCategory();
    });

    App.vent.on('goToPrevCategory', function() {
      Calc.controller.goToPrevCategory();
    });

    App.vent.on('category', function(event) { 
      var newCategorySlug = $(event.target).data('category');
      var oldCategory = Calc.model.get('currentCategoryModel');
      var oldCategorySlug = oldCategory.get('slug');
      if(newCategorySlug === oldCategorySlug) return; 
      var newCategory = Calc.model.getCategoryBySlug(newCategorySlug);
      var currentViewModel = newCategory.getCurrentInputView();
      Calc.model.set({currentCategoryModel: newCategory});
      App.router.navigate(Calc.baseRoute+'/'+newCategorySlug+'/'+currentViewModel.get('name'), {trigger: true});
    });  

    App.vent.on('help', function(event) { 
      $('#helpModal').modal(options);
    });  

    App.vent.on('buy', function(event) { 
      alert('The buy button was clicked.');
    });  

    App.vent.on('errorAlert', function(msg) { 
      alert(msg);
    });  

  };