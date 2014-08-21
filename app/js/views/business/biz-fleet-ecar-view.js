'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app')
, validation = require('../../utils/validation');

var ecarTemplate = require('../../templates/business/biz-fleet-ecar-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: ecarTemplate,
  ui: {
    numVehiclesInput: 'input[name="num_vehicles"]', 
    zipInput: 'input[name="zip"]',
    mileageSelect: 'select[name="mileage"]'
  },
  events: {
    'blur input[name="num_vehicles"]': 'validateFieldisDigit',
    'blur input[name="zip"]': 'validateZip',
    'change select[name="mileage"]': 'validateFieldHasValue'
  },
  onShow: function() {
    var view = this;
    view.vehicle = view.category.get('currentFleetVehicle');
    view.ui.numVehiclesInput.val(view.vehicle.get('numVehicles') || 0)
    view.ui.zipInput.val(view.vehicle.get('zip') || '')
    view.ui.mileageSelect.val(view.vehicle.get('mileage') || '')
  },
  validateFieldisDigit: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(validation.isDigit(val)) {
      this.displaySuccess($target);
    } else {
      this.displayError($target);
    }
  },
  validateFieldHasValue: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(validation.hasValue(val)) {
      this.displaySuccess($target);
    } else {
      this.displayError($target);
    }
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
  validateForm: function() {
    var view = this;
    if(validation.isDigit(view.ui.numVehiclesInput.val())) {
      view.displaySuccess(view.ui.numVehiclesInput);
    } else {
      view.displayError(view.ui.numVehiclesInput);
      return false;
    }

    if(validation.zip(view.ui.zipInput.val())) {
      view.displaySuccess(view.ui.zipInput);
    } else {
      view.displayError(view.ui.zipInput);
      return false;
    }
    
    if(validation.hasValue(view.ui.mileageSelect.val())) {
      view.displaySuccess(view.ui.mileageSelect);
    } else {
      view.displayError(view.ui.mileageSelect);
      return false;
    }

    return true;
  },
  displaySuccess: function($elem) {
    var $label = $elem.parent().prev('label'); 
    $label.html(function() {return $(this).data('success-label');})
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
  },
  displayError: function($elem) {
    var $label = $elem.parent().prev('label'); 
    $label.html(function() {return $(this).data('error-msg');})
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() { 
    var view = this;  
    if(!view.validateForm()) return; 
    view.vehicle.set({
      numVehicles: view.ui.numVehiclesInput.val(),
      zip: view.ui.zipInput.val(),
      mileage: view.ui.mileageSelect.val()
    });     
    App.vent.trigger('showInputView', 'list');
  }
});

