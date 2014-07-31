'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var addTemplate = require('../templates/ind-home-add-template.hbs');

module.exports= Marionette.ItemView.extend({
	template: addTemplate,
  onShow: function() {
    this.modelBinder = new Databinding.ModelBinder(this, this.category);
		this.modelBinder.watch('value: electricityAmount', {selector: '[name="electricity"]'});
		this.modelBinder.watch('value: electricityUnit', {selector: '[name="electricity_unit"]'});
		this.modelBinder.watch('value: electricityInterval', {selector: '[name="electricity_interval"]'});
		this.modelBinder.watch('value: naturalGasAmount', {selector: '[name="natural_gas_amount"]'});
		this.modelBinder.watch('value: naturalGasUnit', {selector: '[name="natural_gas_unit"]'});
		this.modelBinder.watch('value: naturalGasInterval', {selector: '[name="natural_gas_interval"]'});
		this.modelBinder.watch('value: heatingOilAmount', {selector: '[name="heating_oil_amount"]'});
		this.modelBinder.watch('value: heatingOilUnit', {selector: '[name="heating_oil_unit"]'});
		this.modelBinder.watch('value: heatingOilInterval', {selector: '[name="heating_oil_interval"]'});
		this.modelBinder.watch('value: propaneAmount', {selector: '[name="propane_amount"]'});
		this.modelBinder.watch('value: propaneUnit', {selector: '[name="propane_unit"]'});
		this.modelBinder.watch('value: propaneInterval', {selector: '[name="propane_interval"]'});
		this.modelBinder.watch('value: gasolineAmount', {selector: '[name="gasoline_amount"]'});
		this.modelBinder.watch('value: gasolineUnit', {selector: '[name="gasoline_unit"]'});
		this.modelBinder.watch('value: gasolineInterval', {selector: '[name="gasoline_interval"]'});
		this.modelBinder.watch('value: dieselAmount', {selector: '[name="diesel_amount"]'});
		this.modelBinder.watch('value: dieselUnit', {selector: '[name="diesel_unit"]'});
		this.modelBinder.watch('value: dieselInterval', {selector: '[name="diesel_interval"]'});
  },
  getNextInputView: function() {
    var attrs = {
      electricityAmount: $('[name="electricity_amount"]').val(),
			electricityUnit: $('[name="electricity_unit"]').val(),
			electricityInterval: $('[name="electricity_interval"]').val(),
			naturalGasAmount: $('[name="natural_gas_amount"]').val(),
			naturalGasUnit: $('[name="natural_gas_unit"]').val(),
			naturalGasInterval: $('[name="natural_gas_interval"]').val(),
			heatingOilAmount: $('[name="heating_oil_amount"]').val(),
			heatingOilUnit: $('[name="heating_oil_unit"]').val(),
			heatingOilInterval: $('[name="heating_oil_interval"]').val(),
			propaneAmount: $('[name="propane_amount"]').val(),
			propaneUnit: $('[name="propane_unit"]').val(),
			propaneInterval: $('[name="propane_interval"]').val(),
			gasolineAmount: $('[name="gasoline_amount"]').val(),
			gasolineUnit: $('[name="gasoline_unit"]').val(),
			gasolineInterval: $('[name="gasoline_interval"]').val(),
			dieselAmount: $('[name="diesel_amount"]').val(),
			dieselUnit: $('[name="diesel_unit"]').val(),
			dieselInterval: $('[name="diesel_interval"]').val()
    }
    this.category.set(attrs);
    App.vent.trigger('goToNextCategory');
  }
});
