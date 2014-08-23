'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, validation = require('../../utils/validation');

var defaultTemplate = require('../../templates/events/evt-venue-default-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
	ui: {
    zipInput: 'input[name="zip"]',
    squareFeetInput: '[name="square-feet"]',
    daysInput: '[name="days"]'
  },
  events: {
    'blur input[name="zip"]': 'validateZip',
    'blur input[name="square-feet"]': 'validateHasDigit',
    'blur input[name="days"]': 'validateHasDigit'
  },
  onShow: function() {
    this.ui.zipInput.val(this.category.get('zip') || '');
    this.ui.squareFeetInput.val(this.category.get('squareFeet') || 0);
    this.ui.daysInput.val(this.category.get('days') || 0);
  },
  validateForm: function(){
    var validation = require('../../utils/validation');
    var view = this;

    function zip($input) {
      var val = $input.val();
      if(validation.zip(val)) {
        view.displaySuccess($input);
        return true;
      } else {
        view.displayError($input);
        return false;
      }
    }

    function isDigit($input) {
      var val = $input.val();
      if(validation.isDigit(val)) {
        view.displaySuccess($input);
        return true;
      } else {
        view.displayError($input);
        return false;
      }
    }

    if(!zip(view.ui.zipInput)) return false;
    if(!isDigit(view.ui.squareFeetInput)) return false;
    if(!isDigit(view.ui.daysInput)) return false;
    return true;
  },
  validateZip: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(validation.zip(val)) {       
      this.displaySuccess($target);
    } else {
      this.displayError($target);
    }
  },
  validateHasDigit: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(validation.isDigit(val)) {       
      this.displaySuccess($target);
    } else {
      this.displayError($target);
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

    var zip = view.ui.zipInput.val()
    , squareFeet = view.ui.squareFeetInput.val()
    , days = view.ui.daysInput.val();

    var venue = require('../../utils/evt-venue-emissions')
    venue.zipCode = zip;
    venue.size = squareFeet;
    venue.days = days;

    var totalEmissions = venue.totalEmissions();

    this.category.set({
      zipCode: zip,
      venueSize: squareFeet,
      days: days,
      totalEmissions: totalEmissions
    });
    App.vent.trigger('goToNextCategory');
  }
});