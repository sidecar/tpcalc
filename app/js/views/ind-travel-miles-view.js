'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var milesTemplate = require('../templates/ind-travel-miles-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: milesTemplate,
  onShow: function() {

    this.modelBinder = new Databinding.ModelBinder(this, this.category);
    this.modelBinder.watch('value: milesShortFlights', {selector: '[name="short"]'});
    this.modelBinder.watch('value: milesMedEconFlights', {selector: '[name="med_econ"]'});
    this.modelBinder.watch('value: milesMedFirstClassFlights', {selector: '[name="med_first_class"]'});
    this.modelBinder.watch('value: milesLongEconFlights', {selector: '[name="long_econ"]'});
    this.modelBinder.watch('value: milesLongEconPlusFlights', {selector: '[name="long_econ_plus"]'});
    this.modelBinder.watch('value: milesLongBizClassFlights', {selector: '[name="long_biz_class"]'});
    this.modelBinder.watch('value: milesLongFirstClassFlights', {selector: '[name="long_first_class"]'});
  },
  getNextInputView: function() {

    var air = require('../utils/ind-air-emissions'),
    totalEmissions = 0,
    milesShortFlights = $('[name="short"]').val(),
    milesMedEconFlights = $('[name="med_econ"]').val(),
    milesMedFirstClassFlights = $('[name="med_first_class"]').val(),
    milesLongEconFlights = $('[name="long_econ"]').val(),
    milesLongEconPlusFlights = $('[name="long_econ_plus"]').val(),
    milesLongBizClassFlights = $('[name="long_biz_class"]').val(),
    milesLongFirstClassFlights = $('[name="long_first_class"]').val();

    air.setCalculateBy('flightMiles');
    air.flight.shortHaul.annMiles = milesShortFlights;
    air.flight.medEcon.annMiles = milesMedEconFlights;
    air.flight.medFirst.annMiles = milesMedFirstClassFlights;
    air.flight.longEcon.annMiles = milesLongEconFlights;
    air.flight.longEconPlus.annMiles = milesLongEconPlusFlights;
    air.flight.longBusiness.annMiles = milesLongBizClassFlights;
    air.flight.longFirst.annMiles = milesLongFirstClassFlights;
    
    totalEmissions += air.totalEmissions('shortHaul');
    totalEmissions += air.totalEmissions('medEcon');
    totalEmissions += air.totalEmissions('medFirst');    
    totalEmissions += air.totalEmissions('longEcon');    
    totalEmissions += air.totalEmissions('longEconPlus');    
    totalEmissions += air.totalEmissions('longBusiness');
    totalEmissions += air.totalEmissions('longFirst');

    var attrs = {
      milesShortFlights: milesShortFlights,
      milesMedEconFlights: milesMedEconFlights,
      milesMedFirstClassFlights: milesMedFirstClassFlights,
      milesLongEconFlights: milesLongEconFlights,
      milesLongEconPlusFlights: milesLongEconPlusFlights,
      milesLongBizClassFlights: milesLongBizClassFlights,
      milesLongFirstClassFlights: milesLongFirstClassFlights,
      totalEmissions: totalEmissions
    }

    this.category.set(attrs);
    App.vent.trigger('goToNextCategory');
  }
});