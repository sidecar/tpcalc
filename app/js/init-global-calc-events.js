"use strict";
var $ = require('jquery')
  , App = require('./app');

module.exports = function(Calc) {
  console.log(Calc);
  App.vent.on('next', function(event) {
    var currentCategory = Calc.model.get('currentCategory');
    var currentCategorySlug = currentCategory.get('slug');
    var currentViewModel = currentCategory.get('currentInputView');
    var currentView = currentViewModel.get('view');
    currentView.getNextInputView();
  });
  App.vent.on('prev', function(event) {     
    var currentCategory = Calc.model.get('currentCategory')
    , currentCategorySlug = currentCategory.get('slug')
    , currentViewModel = currentCategory.get('currentInputView')
    , previousViewModel = currentViewModel.get('previousViewModel');
    if(previousViewModel === undefined){ 
      Calc.controller.goToPrevCategory();
      return;
    } else {
      currentCategory.set({currentInputView: previousViewModel});
      App.router.navigate(Calc.baseRoute+'/'+currentCategorySlug+'/'+previousViewModel.get('name'), {trigger: true});
    }
  });

  App.vent.on('showInputView', function(slug) {
    var currentCategory = Calc.model.get('currentCategory')
    , currentCategorySlug = currentCategory.get('slug')
    , currentViewModel = currentCategory.get('currentInputView')
    , nextViewModel = Calc.model.getViewModelBySlug(slug);
    nextViewModel.set({previousViewModel: currentViewModel});
    currentCategory.set({currentInputView: nextViewModel});
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
    var oldCategory = Calc.model.get('currentCategory');
    var oldCategorySlug = oldCategory.get('slug');
    if(newCategorySlug === oldCategorySlug) return; 
    var newCategory = Calc.model.getCategoryBySlug(newCategorySlug);
    var currentViewModel = newCategory.getCurrentInputView();
    Calc.model.set({currentCategory: newCategory});
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