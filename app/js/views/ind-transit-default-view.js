'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app')
, numeral = require('numeral');

var defaultTemplate = require('../templates/ind-transit-default-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
  onShow: function() {
    this.modelBinder = new Databinding.ModelBinder(this, this.category);
    this.modelBinder.watch('value: trainMileage', {selector: '[name="train_mileage"]'});
    this.modelBinder.watch('value: trainInterval', {selector: '[name="train_interval"]'});
    this.modelBinder.watch('value: busMileage', {selector: '[name="bus_mileage"]'});
    this.modelBinder.watch('value: busInterval', {selector: '[name="bus_interval"]'});
    this.modelBinder.watch('value: taxiMileage', {selector: '[name="taxi_mileage"]'});
    this.modelBinder.watch('value: taxiInterval', {selector: '[name="taxi_interval"]'});
    this.modelBinder.watch('value: ferryMileage', {selector: '[name="ferry_mileage"]'});
    this.modelBinder.watch('value: ferryInterval', {selector: '[name="ferry_interval"]'});
  },
  getNextInputView: function() {
    var transit = require('../utils/ind-transit-emissions'),
    totalEmissions = 0,
    trainMileage = parseInt($('[name="train_mileage"]').val()),
    trainInterval = $('[name="train_interval"]').val(),
    busMileage = parseInt($('[name="bus_mileage"]').val()),
    busInterval = $('[name="bus_interval"]').val(),
    taxiMileage = parseInt($('[name="taxi_mileage"]').val()),
    taxiInterval = $('[name="taxi_interval"]').val(),
    ferryMileage = parseInt($('[name="ferry_mileage"]').val()),
    ferryInterval = $('[name="ferry_interval"]').val();

    transit.train.milesPer = trainMileage;
    transit.train.interval = trainInterval;
    transit.bus.milesPer = busMileage;
    transit.bus.interval = busInterval;
    transit.taxi.milesPer = taxiMileage;
    transit.taxi.interval = taxiInterval;
    transit.ferry.milesPer = ferryMileage;
    transit.ferry.interval = ferryInterval;
    totalEmissions += transit.totalEmissions('train');
    totalEmissions += transit.totalEmissions('bus');
    totalEmissions += transit.totalEmissions('taxi');
    totalEmissions += transit.totalEmissions('ferry');

    var attrs = {
      trainMileage: trainMileage,
      trainInterval: trainInterval,
      busMileage: busMileage,
      busInterval: busInterval,
      taxiMileage: taxiMileage,
      taxiInterval: taxiInterval,
      ferryMileage: ferryMileage,
      ferryInterval: ferryInterval,
      totalEmissions: totalEmissions
    }

    this.category.set(attrs);
    App.vent.trigger('goToNextCategory');
  }
});
