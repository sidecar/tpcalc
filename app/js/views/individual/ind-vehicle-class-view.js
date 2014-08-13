'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var classTemplate = require('../../templates/individual/ind-vehicle-class-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: classTemplate,
  ui: {
    vehicleClassSelect: 'select[name="vehicle_class"]', 
    fuelTypeSelect: 'select[name="fuel_type"]',
    mileageSelect: 'select[name="mileage"]' 
  },
  events: {
    'change select[name="vehicle_class"]': 'validate',
    'change select[name="fuel_type"]': 'validate',
    'change select[name="mileage"]': 'validate'
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentVehicle');

    this.vehicle.validate = function(attrs, options) {
      if(!attrs.vehicleClass || attrs.vehicleClass == '') {
        self.displayError(self.ui.vehicleClassSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.vehicleClassSelect);
      }

      if(!attrs.fuelType || attrs.fuelType == '') {
        self.displayError(self.ui.fuelTypeSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.fuelTypeSelect);
      }
      
      if(!attrs.mileage || attrs.mileage == '') {
        self.displayError(self.ui.mileageSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.mileageSelect);
      }

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var vehicleClass = this.vehicle.get('vehicleClass') || undefined
    , fuelType = this.vehicle.get('fuelType') || undefined
    , mileage = this.vehicle.get('mileage') || undefined;
    
    if(vehicleClass) this.modelBinder.watch('value: vehicleClass', {selector: '[name="vehicle_class"]'});
    if(fuelType) this.modelBinder.watch('value: fuelType', {selector: '[name="fuel_type"]'});
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="mileage"]'});
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
    var attrs = {
      vehicleClass: this.ui.vehicleClassSelect.val(),
      fuelType: this.ui.fuelTypeSelect.val(),
      mileage: this.ui.mileageSelect.val(),
      makeModelIsUnknown: true
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);
      App.vent.trigger('showInputView', 'list');
    }
  }
});