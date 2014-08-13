'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var boatTemplate = require('../../templates/individual/ind-vehicle-boat-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: boatTemplate,
  ui: {
    fuelQtyInput: 'input[name="boat_fuel_qty"]', 
    fuelTypeSelect: 'select[name="boat_fuel_type"]'
  },
  events: {
    'blur input[name="boat_fuel_qty"]': 'validate',
    'change select[name="boat_fuel_type"]': 'validate'
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentVehicle');

    this.vehicle.validate = function(attrs, options) {
      if(!attrs.fuelQty || attrs.fuelQty == '' || attrs.fuelQty.match(/^\d+$/) == null) {
        self.displayError(self.ui.fuelQtyInput);
        return false;
      } else {
        self.displaySuccess(self.ui.fuelQtyInput);
      }
      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var fuelQty = this.vehicle.get('fuelQty') || undefined
    , fuelType = this.vehicle.get('fuelType') || undefined;
    
    if(fuelQty) this.modelBinder.watch('value: fuelQty', {selector: '[name="boat_fuel_qty"]'});
    if(fuelType) this.modelBinder.watch('value: fuelType', {selector: '[name="boat_fuel_type"]'});
  },
  validate: function() {
    var attrs = {
      fuelQty: this.ui.fuelQtyInput.val(),
      fuelType: this.ui.fuelTypeSelect.val()
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
      fuelQty: this.ui.fuelQtyInput.val(),
      fuelType: this.ui.fuelTypeSelect.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);
      App.vent.trigger('showInputView', 'list');
    }
  }
});












