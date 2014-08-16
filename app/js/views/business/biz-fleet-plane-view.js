'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var planeTemplate = require('../../templates/business/biz-fleet-plane-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: planeTemplate,
  ui: {
    numVehiclesInput: 'input[name="num_vehicles"]',
    useRfi: 'input[name="use_rfi"]', 
    fuelQtyInput: 'input[name="fuel_qty"]' 
  },
  events: {
    'blur input[name="num_vehicles"]': 'numVehiclesInputChanged',
    'blur input[name="fuel_qty"]': 'fuelQtyInputChanged'
  },
  numVehiclesInputChanged: function() {
    this.displaySuccess(this.ui.numVehiclesInput);
  },
  fuelQtyInputChanged: function() {
    this.displaySuccess(this.ui.fuelQtyInput);
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentFleetVehicle');
    console.log('biz fleet onShow this.vehicle', this.vehicle);
    this.vehicle.validate = function(attrs, options) {

      if(!attrs.numVehicles || attrs.numVehicles == '' || attrs.numVehicles.match(/^(0|[1-9][0-9]*)$/) == null) {       
        self.displayError(self.ui.numVehiclesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.numVehiclesInput);
      }

      if(!attrs.fuelQty || attrs.fuelQty === '' || attrs.fuelQty.match(/^\d*$/) === null) {       
        self.displayError(self.ui.fuelQtyInput);
        return false;
      } else {
        self.displaySuccess(self.ui.fuelQtyInput);
      }

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var numVehicles = this.vehicle.get('numVehicles') || undefined
    , useRFI = this.vehicle.get('useRFI') || false
    , fuelQty = this.vehicle.get('fuelQty') || undefined;
    
    if(numVehicles) this.modelBinder.watch('value: numVehicles', {selector: '[name="num_vehicles"]'});
    if(useRFI) this.modelBinder.watch('checked: useRFI', {selector: '[name="use_rfi"]'});
    if(fuelQty) this.modelBinder.watch('value: fuelQty', {selector: '[name="fuel_qty"]'});
  },
  validate: function() {
    var attrs = {
      numVehicles: this.ui.numVehiclesInput.val(),
      fuelQty: this.ui.fuelQtyInput.val()
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
    var useRFI = ($('[name="use_rfi"]:checked').val() === 'true') ? true : false ;
    var attrs = {
      numVehicles: this.ui.numVehiclesInput.val(),
      useRFI: useRFI,
      fuelQty: this.ui.fuelQtyInput.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs); 
      console.log('biz fleet getNextInputView this.vehicle', this.vehicle);    
      App.vent.trigger('showInputView', 'list');
    }
  }
});

