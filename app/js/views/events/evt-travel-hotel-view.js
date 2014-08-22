'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, validation = require('../../utils/validation');

var hotelTemplate = require('../../templates/events/evt-travel-hotel-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: hotelTemplate,
  ui: {
    zipInput: 'input[name="zip"]',
    attendeesInput: '[name="attendees"]',
    nightsInput: '[name="nights"]'
  },
  events: {
    'blur input[name="zip"]': 'validateZip',
    'blur input[name="attendees"]': 'validateHasDigit',
    'blur input[name="nights"]': 'validateHasDigit'
  },
  onShow: function() {
    this.ui.zipInput.val(this.category.get('zip') || '');
    this.ui.attendeesInput.val(this.category.get('attendees') || 0);
    this.ui.nightsInput.val(this.category.get('nights') || 0);
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
    if(!isDigit(view.ui.attendeesInput)) return false;
    if(!isDigit(view.ui.nightsInput)) return false;
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
    , attendees = view.ui.attendeesInput.val()
    , nights = view.ui.nightsInput.val();

    var hotel = require('../../utils/evt-hotel-emissions')
    hotel.zipCode = zip;
    hotel.attendees = attendees;
    hotel.aveNights = nights;

    var hotelEmissions = hotel.totalEmissions();

    this.category.set({
      zip: zip,
      attendees: attendees,
      nights: nights,
      hotelEmissions: hotelEmissions
    });
    view.category.trigger('change:hotelEmissions');
    App.vent.trigger('showInputView', 'ground');
  }
});