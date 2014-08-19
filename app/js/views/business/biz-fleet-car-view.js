'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var carTemplate = require('../../templates/business/biz-fleet-car-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: carTemplate,
  ui: {
    numVehiclesInput: 'input[name="num_vehicles"]', 
    fuelTypeSelect: 'select[name="fuel_type"]', 
    mileageSelect: 'select[name="mileage"]'
  },
  events: {
    'blur input[name="num_vehicles"]': 'numVehiclesInputChanged',
    'change select[name="fuel_type"]': 'fuelTypeSelectChanged',
    'change select[name="mileage"]': 'mileageSelectChanged'
  },
  numVehiclesInputChanged: function() {
    this.displaySuccess(this.ui.numVehiclesInput);
  },
  fuelTypeSelectChanged: function() {
    this.displaySuccess(this.ui.fuelTypeSelect);
  },
  mileageSelectChanged: function() {
    this.displaySuccess(this.ui.mileageSelect);
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentFleetVehicle');

    this.vehicle.validate = function(attrs, options) {

      if(!attrs.numVehicles || attrs.numVehicles == '' || attrs.numVehicles.match(/^\d*$/) == null) {       
        self.displayError(self.ui.numVehiclesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.numVehiclesInput);
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

    var numVehicles = this.vehicle.get('numVehicles') || undefined
    , fuelType = this.vehicle.get('fuelType') || undefined
    , mileage = this.vehicle.get('mileage') || undefined;
    
    if(numVehicles) this.modelBinder.watch('value: numVehicles', {selector: '[name="num_vehicles"]'});
    if(fuelType) this.modelBinder.watch('value: fuelType', {selector: '[name="fuel_type"]'});
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="mileage"]'});
  },
  validate: function() {
    var attrs = {
      numVehicles: this.ui.numVehiclesInput.val(),
      fuelType: this.ui.fuelTypeSelect.val(),
      mileage: this.ui.mileageSelect.val()
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
      numVehicles: this.ui.numVehiclesInput.val(),
      fuelType: this.ui.fuelTypeSelect.val(),
      mileage: this.ui.mileageSelect.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);     
      App.vent.trigger('showInputView', 'list');
    }
  }
});
