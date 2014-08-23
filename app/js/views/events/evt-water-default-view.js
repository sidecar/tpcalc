'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var defaultTemplate = require('../../templates/events/evt-water-default-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
	events : {
    'blur input[name="bottles"]': 'validateField'
  },
  ui: {
    bottlesInput: 'input[name="bottles"]'
  },
  onShow: function() {
    var bottles = this.category.get('bottles') || 0;

    if(bottles) this.ui.bottlesInput.val(bottles);
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

    if(!isDigit(view.ui.bottlesInput)) return false;
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
    var bottles = Number(view.ui.bottlesInput.val())
    , bottlesEmissions = require('../../utils/evt-bottles-emissions');

    bottlesEmissions.count = bottles;

    var totalEmissions = bottlesEmissions.totalEmissions();

    view.category.set({
      bottles: bottles,
      totalEmissions: totalEmissions
    }); 
    App.vent.trigger('goToNextCategory');
  }
});






