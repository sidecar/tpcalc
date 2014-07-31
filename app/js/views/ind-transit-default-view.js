'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

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
    var attrs = {
      trainMileage: $('[name="train_mileage"]').val(),
      trainInterval: $('[name="train_interval"]').val(),
      busMileage: $('[name="bus_mileage"]').val(),
      busInterval: $('[name="bus_interval"]').val(),
      taxiMileage: $('[name="taxi_mileage"]').val(),
      taxiInterval: $('[name="taxi_interval"]').val(),
      ferryMileage: $('[name="ferry_mileage"]').val(),
      ferryInterval: $('[name="ferry_interval"]').val()
    }
    this.category.set(attrs);
    App.vent.trigger('goToNextCategory');
  }
});
