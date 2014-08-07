'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var fuelTemplate = require('../templates/ind-travel-fuel-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: fuelTemplate,
  ui: {
    fuelGallonsInput: 'input[name="fuel_gallons"]', 
    fuelTypeSelect: 'select[name="fuel_type"]'
  },
  onShow: function() {
    var self = this;

    this.category.validate = function(attrs, options) {
      if(!attrs.fuelGallons || attrs.fuelGallons == '' || attrs.fuelGallons.match(/^\d+$/) == null) {
        self.displayError(self.ui.fuelGallonsInput);
        return false;
      } else {
        self.displaySuccess(self.ui.fuelGallonsInput);
      }
      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.category);

    var fuelGallons = this.category.get('fuelGallons') || undefined
    , fuelType = this.category.get('fuelType') || undefined;
    
    if(fuelGallons) this.modelBinder.watch('value: fuelGallons', {selector: '[name="fuel_gallons"]'});
    if(fuelType) this.modelBinder.watch('value: fuelType', {selector: '[name="fuel_type"]'});
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
    var air = require('../utils/ind-air-emissions'),
    totalEmissions = 0,
    fuelType = this.ui.fuelTypeSelect.val(),
    fuelGallons = this.ui.fuelGallonsInput.val();

    air.setCalculateBy('fuel');
    air.fuel[fuelType] = fuelGallons;

    totalEmissions += air.totalEmissions('jetFuel');
    totalEmissions += air.totalEmissions('aviationGas');

    var attrs = {
      fuelGallons: fuelGallons,
      fuelType: fuelType,
      totalEmissions: totalEmissions
    }
    this.category.validate(attrs);
    if(this.category.validate(attrs)) {
      this.category.set(attrs);
      App.vent.trigger('goToNextCategory');
    }
  }
});
