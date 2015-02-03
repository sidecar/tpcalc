'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var defaultTemplate = require('../../templates/individual/ind-vehicle-default-template.hbs')

module.exports = Marionette.ItemView.extend({
  template: defaultTemplate,
  ui: {
    vehicleTypeSelect: 'select[name="vehicle_type"]'
  },
  validateForm: function() {
    if(this.ui.vehicleTypeSelect.val()) {
      this.displaySuccess($('select[name="vehicle_type"]'));
    } else {
      this.displayError($('select[name="vehicle_type"]'));
      return false;
    }
    return true;
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
  onShow: function() {
    this.vehicle = this.category.get('currentVehicle');
    var vehicleType = (this.vehicle) ? this.vehicle.get('vehicleType') : undefined;
    if(typeof(vehicleType) == 'undefined' || vehicleType == null || vehicleType == '') {
      var Vehicle = require('../../models/vehicle-models').vehicle
      this.category.set({currentVehicle: new Vehicle()});
      this.vehicle = this.category.get('currentVehicle');
    } else {
      this.ui.vehicleTypeSelect.val(this.vehicle.get('vehicleType'));
    }
  },
  getNextInputView: function() {
    if(this.validateForm()) {
      var oldVehicleType = this.vehicle.get('vehicleType')
      , newVehicleType = this.ui.vehicleTypeSelect.val();
      if(oldVehicleType !== newVehicleType) {
        this.vehicle.set({vehicleType: newVehicleType});
      }
      App.vent.trigger('showInputView', newVehicleType);
    }
  }
});