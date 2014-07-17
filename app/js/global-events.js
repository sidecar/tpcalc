"use strict";
var $ = require('jquery')
  , App = require('./app');

module.exports = function() {
  var self = this;
  App.vent.on('next', function(event) {
    var currentCategory = self.model.get('currentCategory')
    , currentCategorySlug = currentCategory.get('slug')
    , currentViewModel = currentCategory.get('currentInputView')
    , currentView = currentViewModel.get('view');
    currentView.getNextInputView();
  });
  App.vent.on('prev', function(event) {     
    var currentCategory = self.model.get('currentCategory')
    , currentCategorySlug = currentCategory.get('slug')
    , currentViewModel = currentCategory.get('currentInputView')
    , previousViewModel = currentViewModel.get('previousViewModel');
    if(previousViewModel === undefined){ 
      self.controller.goToPrevCategory();
      return;
    } else {
      currentCategory.set({currentInputView: previousViewModel});
      App.router.navigate(self.baseRoute+'/'+currentCategorySlug+'/'+previousViewModel.get('name'), {trigger: true});
    }
  });

  App.vent.on('showInputView', function(slug) {
    var currentCategory = self.model.get('currentCategory')
    , currentCategorySlug = currentCategory.get('slug')
    , currentViewModel = currentCategory.get('currentInputView')
    , nextViewModel = self.model.getViewModelBySlug(slug);
    nextViewModel.set({previousViewModel: currentViewModel});
    currentCategory.set({currentInputView: nextViewModel});
    App.router.navigate(self.baseRoute+'/'+currentCategorySlug+'/'+nextViewModel.get('name'), {trigger: true});
  });

  App.vent.on('goToNextCategory', function() {
    self.controller.goToNextCategory();
  });

  App.vent.on('goToPrevCategory', function() {
    self.controller.goToPrevCategory();
  });

  App.vent.on('category', function(event) { 
    var newCategorySlug = $(event.target).data('category');
    var oldCategory = self.model.get('currentCategory');
    var oldCategorySlug = oldCategory.get('slug');
    if(newCategorySlug === oldCategorySlug) return; 
    var newCategory = self.model.getCategoryBySlug(newCategorySlug);
    var currentViewModel = newCategory.getCurrentInputView();
    self.model.set({currentCategory: newCategory});
    App.router.navigate(self.baseRoute+'/'+newCategorySlug+'/'+currentViewModel.get('name'), {trigger: true});
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