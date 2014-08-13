'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var addTemplate = require('../../templates/business/biz-site-add-template.hbs');

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
    var home = require('../../utils/ind-home-emissions'),
    totalEmissions = 0,
    electricityAmount = $('[name="electricity_amount"]').val(),
    electricityUnit = $('[name="electricity_unit"]').val(),
    electricityInterval = $('[name="electricity_interval"]').val(),
    naturalGasAmount = $('[name="natural_gas_amount"]').val(),
    naturalGasUnit = $('[name="natural_gas_unit"]').val(),
    naturalGasInterval = $('[name="natural_gas_interval"]').val(),
    heatingOilAmount = $('[name="heating_oil_amount"]').val(),
    heatingOilUnit = $('[name="heating_oil_unit"]').val(),
    heatingOilInterval = $('[name="heating_oil_interval"]').val(),
    propaneAmount = $('[name="propane_amount"]').val(),
    propaneUnit = $('[name="propane_unit"]').val(),
    propaneInterval = $('[name="propane_interval"]').val(),
    gasolineAmount = $('[name="gasoline_amount"]').val(),
    gasolineUnit = $('[name="gasoline_unit"]').val(),
    gasolineInterval = $('[name="gasoline_interval"]').val(),
    dieselAmount = $('[name="diesel_amount"]').val(),
    dieselUnit = $('[name="diesel_unit"]').val(),
    dieselInterval = $('[name="diesel_interval"]').val();

    home.zipCode = this.category.get('zip');
    home.fuel.electricity.amount = electricityAmount;
    home.fuel.electricity.method = (electricityUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.electricity.interval = electricityInterval;
    home.fuel.naturalGas.amount = naturalGasAmount;
    home.fuel.naturalGas.method = (naturalGasUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.naturalGas.interval = naturalGasInterval;
    home.fuel.heatingOil.amount = heatingOilAmount;
    home.fuel.heatingOil.method = (heatingOilUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.heatingOil.interval = heatingOilInterval;
    home.fuel.propane.amount = propaneAmount;
    home.fuel.propane.method = (propaneUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.propane.interval = propaneInterval;
    home.fuel.gasoline.amount = gasolineAmount;
    home.fuel.gasoline.method = (gasolineUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.gasoline.interval = gasolineInterval;
    home.fuel.diesel.amount = dieselAmount;
    home.fuel.diesel.method = (dieselUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.diesel.interval = dieselInterval;

    totalEmissions += home.totalEmissions('electricity');
    totalEmissions += home.totalEmissions('naturalGas');
    totalEmissions += home.totalEmissions('heatingOil');
    totalEmissions += home.totalEmissions('propane');
    totalEmissions += home.totalEmissions('gasoline');

    var attrs = {
      electricityAmount: electricityAmount,
      electricityUnit: electricityUnit,
      electricityInterval: electricityInterval,
      naturalGasAmount: naturalGasAmount,
      naturalGasUnit: naturalGasUnit,
      naturalGasInterval: naturalGasInterval,
      heatingOilAmount: heatingOilAmount,
      heatingOilUnit: heatingOilUnit,
      heatingOilInterval: heatingOilInterval,
      propaneAmount: propaneAmount,
      propaneUnit: propaneUnit,
      propaneInterval: propaneInterval,
      gasolineAmount: gasolineAmount,
      gasolineUnit: gasolineUnit,
      gasolineInterval: gasolineInterval,
      dieselAmount: dieselAmount,
      dieselUnit: dieselUnit,
      dieselInterval: dieselInterval,
      totalEmissions: totalEmissions
    }
    this.category.set(attrs);
    App.vent.trigger('goToNextCategory');
  }
});