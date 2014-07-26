'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');


var boatTemplate = require('../templates/ind-vehicle-boat-template.hbs');

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
    this.valid = false;
    this.vehicle.on('invalid', function (m, err) {
      // `err` will be an object with the error message {type:'message'}.
      if(err.fuelQty) {
        self.valid = false; 
        self.displayError(self.ui.fuelQtyInput, err.fuelQty)
        return;
      }
      if(err.fuelType) {
        self.valid = false; 
        self.displayError(self.ui.fuelTypeSelect, err.fuelType)
        return;
      }
    });

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var fuelQty = this.vehicle.get('fuelQty') || undefined
    , fuelType = this.vehicle.get('fuelType') || undefined;
    
    if(fuelQty) this.modelBinder.watch('value: fuelQty', {selector: '[name="boat_fuel_qty"]'});
    if(fuelType) this.modelBinder.watch('value: fuelType', {selector: '[name="boat_fuel_type"]'});
  },
  validate: function(event) {
    if(event) { 
      event.preventDefault();
      this.displaySuccess($(event.target));
    }
    this.valid = true;
    this.vehicle.set({
      fuelQty: this.ui.fuelQtyInput.val(),
      fuelType: this.ui.fuelTypeSelect.val()
    }, {validate: true});
  },
  getNextInputView: function() {
    this.validate();
    if(this.valid) App.vent.trigger('showInputView', 'list');
  }
});