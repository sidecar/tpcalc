'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, validation = require('../../utils/validation');

var ecarTemplate = require('../../templates/individual/ind-vehicle-ecar-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: ecarTemplate,
  ui: {
    zipInput: 'input[name="ecar_zip"]', 
    yearSelect: 'select[name="ecar_year"]',
    mileageSelect: 'select[name="ecar_mileage"]' 
  },
  events: {
    'blur input[name="ecar_zip"]': 'validateZip',
    'change select[name="ecar_year"]': 'validateFieldHasValue',
    'change select[name="ecar_mileage"]': 'validateFieldHasValue'
  },
  onShow: function() {
    var view = this;
    view.vehicle = view.category.get('currentVehicle');
    view.ui.zipInput.val(view.vehicle.get('zip') || '')
    view.ui.yearSelect.val(view.vehicle.get('year') || '')
    view.ui.mileageSelect.val(view.vehicle.get('mileage') || '')
  },
  validateForm: function() {
    var view = this;
    if(validation.zip(view.ui.zipInput.val())) {
      view.displaySuccess(view.ui.zipInput);
    } else {
      view.displayError(view.ui.zipInput);
      return false;
    }

    if(validation.hasValue(view.ui.yearSelect.val())) {
      view.displaySuccess(view.ui.yearSelect);
    } else {
      view.displayError(view.ui.yearSelect);
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
  validateZip: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(validation.zip(val)) {
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
    view.vehicle.set({
      zip: view.ui.zipInput.val(),
      year: view.ui.yearSelect.val(),
      mileage: view.ui.mileageSelect.val()
    });
    App.vent.trigger('showInputView', 'list');
  }
});