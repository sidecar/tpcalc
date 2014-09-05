"use strict";
var $ = require('jquery')
, App = require('./app');

module.exports = function(Calc) {
  App.vent.on('next', function() {
    console.log('next');
    var currentCategory = Calc.model.get('currentCategory');
    var currentCategorySlug = currentCategory.get('slug');
    var currentViewModel = currentCategory.get('currentInputView');
    var currentView = currentViewModel.get('view');
    currentView.getNextInputView();
  });

  App.vent.on('prev', function() {
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

  App.vent.on('methodologyModal', function(topic) {
    $('#methodologyModal').modal('toggle');
    window.setTimeout(function() {
      var $anchor = $('[name="'+Calc.model.get('slug')+'-'+topic+'"]') || $('[name="'+Calc.model.get('slug')+'"]');
      $('#methodologyModal').animate({
          scrollTop: $anchor.offset().top
      }, 800);
    }, 1000)
  });

  App.vent.on('goBackToMethodologyTop', function() {
    $('#methodologyModal').animate({
        scrollTop: '0px'
    }, 800);
  });

  App.vent.on('buy', function(calculator, selected) {
    if (selected === 'all') {
      var url = (calculator === 'individual') ? 'http://www.terrapass.com/shop/individuals-families/' : 'http://www.terrapass.com/shop/busines-carbon-offsets/';
    } else {
      var url = 'http://www.terrapass.com/shop/';
    }
    window.location = url;
  });  

  App.vent.on('errorAlert', function(msg) { 
    window.alert(msg);
    return;
  });

  App.vent.on('toggleEmissionsUnit', function() {
    Calc.model.toggleEmissionsUnit();
  });  
};