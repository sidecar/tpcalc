'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var defaultTemplate = require('../../templates/events/evt-meals-default-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
	events : {
    'blur input[name="num-meals"]': 'validateField',
    'blur input[name="percent-veg"]': 'validateIsPercent'
  },
  ui: {
    numMealsInput: 'input[name="num-meals"]',
    percentVegInput: 'input[name="percent-veg"]'
  },
  onShow: function() {
    var numMeals = this.category.get('numMeals') || 0
    , percentVeg = this.category.get('percentVeg') || 0;

    if(numMeals) this.ui.numMealsInput.val(numMeals);
    if(percentVeg) this.ui.percentVegInput.val(percentVeg);
  },
  validateForm: function(){
    var view = this;
    function isDigit($input) {
      var val = $input.val();
      if(!val || val === '' || val === undefined || val.match(/^\d+$/) === null) {
        view.displayError($input);
        return false;
      } else {
        view.displaySuccess($input);
        return true;
      }
    }

    function isPercent($input) {
      var val = $input.val();
      if(!val || val === '' || val === undefined || val.match(/^\d+$/) === null || val > 100) {
        view.displayError($input);
        return false;
      } else {
        view.displaySuccess($input);
        return true;
      }
    }

    if(!isDigit(view.ui.numMealsInput)) return false;
    if(!isPercent(view.ui.percentVegInput)) return false;
    return true;
  },
  validateField: function(event) {
    var view = this;
    var $target = $(event.target);
    var val = $target.val();
    if(!val || val === '' || val === undefined || val.match(/^\d+$/) === null) {
      view.displayError($target);
      return false;
    } else {
      view.displaySuccess($target);
      return true;
    }
  },
  validateIsPercent: function(event) {
    var view = this;
    var $target = $(event.target);
    var val = $target.val();
    if(!val || val === '' || val === undefined || val.match(/^\d+$/) === null || val > 100) {
      view.displayError($target);
      return false;
    } else {
      view.displaySuccess($target);
      return true;
    }
  },
  displaySuccess: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('default-label');
        })
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
  },
  displayError: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('error-msg');
        })
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {
    var view = this;  
    if(!view.validateForm()) return; 
    var numMeals = Number(view.ui.numMealsInput.val())
    , percentVeg = Number(view.ui.percentVegInput.val())
    , meals = require('../../utils/evt-meals-emissions');

    meals.totalMeals = numMeals;
    meals.percentVeggie = percentVeg;

    var totalEmissions = meals.totalEmissions();

    view.category.set({
      numMeals: numMeals,
      percentVeg: percentVeg,
      totalEmissions: totalEmissions
    }); 
    App.vent.trigger('goToNextCategory');
  }
});




