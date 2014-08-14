'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var boatTemplate = require('../../templates/business/biz-fleet-boat-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: boatTemplate,
  ui: {
    fuelTypeSelect: 'select[name="fuel_type"]', 
    fuelQtyInput: 'input[name="fuel_qty"]' 
  },
  events: {
    'change select[name="fuel_type"]': 'fuelTypeSelectChanged',
    'blur input[name="fuel_qty"]': 'validate'
  },
  fuelTypeSelectChanged: function() {
    this.displaySuccess(this.ui.fuelTypeSelect);
  },
  fuelQtyInputChanged: function() {
    this.displaySuccess(this.ui.fuelQtyInput);
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentFleetVehicle');

    this.vehicle.validate = function(attrs, options) {
      if(!attrs.fuelType || attrs.fuelType === '') {
        self.displayError(self.ui.fuelTypeSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.fuelTypeSelect);
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

    var fuelType = this.vehicle.get('fuelType') || undefined
    , fuelQty = this.vehicle.get('fuelQty') || undefined;
    
    if(fuelType) this.modelBinder.watch('value: fuelType', {selector: '[name="fuel_type"]'});
    if(fuelQty) this.modelBinder.watch('value: fuelQty', {selector: '[name="fuel_qty"]'});
  },
  validate: function() {
    var attrs = {
      fuelType: this.ui.fuelTypeSelect.val(),
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
    var attrs = {
      fuelType: this.ui.fuelTypeSelect.val(),
      fuelQty: this.ui.fuelQtyInput.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);     
      App.vent.trigger('showInputView', 'list');
    }
  }
});
