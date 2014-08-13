'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var carTemplate = require('../../templates/business/biz-fleet-car-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: carTemplate,
  ui: {
    fuelTypeSelect: 'select[name="fuel_type"]', 
    mileageSelect: 'select[name="mileage"]',
    numVehiclesInput: 'input[name="num_vehicles"]' 
  },
  events: {
    'change select[name="fuel_type"]': 'fuelTypeSelectChanged',
    'change select[name="mileage"]': 'mileageSelectChanged',
    'blur input[name="num_vehicles"]': 'validate'
  },
  fuelTypeSelectChanged: function() {
    this.displaySuccess(this.ui.fuelTypeSelect);
  },
  mileageSelectChanged: function() {
    this.displaySuccess(this.ui.mileageSelect);
  },
  numVehiclesInputChanged: function() {
    this.displaySuccess(this.ui.numVehiclesInput);
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentFleetVehicle');

    this.vehicle.validate = function(attrs, options) {
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

      if(!attrs.numVehicles || attrs.numVehicles == '' || attrs.numVehicles.match(/^(0|[1-9][0-9]*)$/) == null) {       
        self.displayError(self.ui.numVehiclesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.numVehiclesInput);
      }

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var fuelType = this.vehicle.get('fuelType') || undefined
    , mileage = this.vehicle.get('mileage') || undefined
    , numVehicles = this.vehicle.get('numVehicles') || undefined;
    
    if(fuelType) this.modelBinder.watch('value: fuelType', {selector: '[name="fuel_type"]'});
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="mileage"]'});
    if(numVehicles) this.modelBinder.watch('value: numVehicles', {selector: '[name="num_vehicles"]'});
  },
  validate: function() {
    var attrs = {
      fuelType: this.ui.fuelTypeSelect.val(),
      mileage: this.ui.mileageSelect.val(),
      numVehicles: this.ui.numVehiclesInput.val()
    }
    this.vehicle.validate(attrs);
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
      fuelType: this.ui.fuelTypeSelect.val(),
      mileage: this.ui.mileageSelect.val(),
      numVehicles: this.ui.numVehiclesInput.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);     
      App.vent.trigger('showInputView', 'list');
    }
  }
});
