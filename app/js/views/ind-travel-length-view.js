'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var lengthTemplate = require('../templates/ind-travel-length-template.hbs')

module.exports = Marionette.ItemView.extend({
  template: lengthTemplate,
  onShow: function() {
    this.modelBinder = new Databinding.ModelBinder(this, this.category);
    this.modelBinder.watch('value: numShortFlights', {selector: '[name="short"]'});
    this.modelBinder.watch('value: numMedEconFlights', {selector: '[name="med_econ"]'});
    this.modelBinder.watch('value: numMedFirstClassFlights', {selector: '[name="med_first_class"]'});
    this.modelBinder.watch('value: numLongEconFlights', {selector: '[name="long_econ"]'});
    this.modelBinder.watch('value: numLongEconPlusFlights', {selector: '[name="long_econ_plus"]'});
    this.modelBinder.watch('value: numLongBizClassFlights', {selector: '[name="long_biz_class"]'});
    this.modelBinder.watch('value: numLongFirstClassFlights', {selector: '[name="long_first_class"]'});
  },
  getNextInputView: function() {
    var air = require('../utils/ind-air-emissions'),
    totalEmissions = 0,
    numShortFlights = $('[name="short"]').val(),
    numMedEconFlights = $('[name="med_econ"]').val(),
    numMedFirstClassFlights = $('[name="med_first_class"]').val(),
    numLongEconFlights = $('[name="long_econ"]').val(),
    numLongEconPlusFlights = $('[name="long_econ_plus"]').val(),
    numLongBizClassFlights = $('[name="long_biz_class"]').val(),
    numLongFirstClassFlights = $('[name="long_first_class"]').val();

    air.setCalculateBy('flightCount');
    air.useRFI = (this.category.get('useRFI')) ? 1 : 0 ;
    air.flight.shortHaul.annFlights = numShortFlights;
    air.flight.medEcon.annFlights = numMedEconFlights;
    air.flight.medFirst.annFlights = numMedFirstClassFlights;
    air.flight.longEcon.annFlights = numLongEconFlights;
    air.flight.longEconPlus.annFlights = numLongEconPlusFlights;
    air.flight.longBusiness.annFlights = numLongBizClassFlights;
    air.flight.longFirst.annFlights = numLongFirstClassFlights;
    
    console.log('ind-travel-length-view air.totalEmissions() = ', air.totalEmissions());

    totalEmissions += air.totalEmissions('shortHaul');
    totalEmissions += air.totalEmissions('medEcon');
    totalEmissions += air.totalEmissions('medFirst');    
    totalEmissions += air.totalEmissions('longEcon');    
    totalEmissions += air.totalEmissions('longEconPlus');    
    totalEmissions += air.totalEmissions('longBusiness');
    totalEmissions += air.totalEmissions('longFirst');


    var attrs = {
      numShortFlights: numShortFlights,
      numMedEconFlights: numMedEconFlights,
      numMedFirstClassFlights: numMedFirstClassFlights,
      numLongEconFlights: numLongEconFlights,
      numLongEconPlusFlights: numLongEconPlusFlights,
      numLongBizClassFlights: numLongBizClassFlights,
      numLongFirstClassFlights: numLongFirstClassFlights,
      totalEmissions: totalEmissions
    }

    this.category.set(attrs);
    App.vent.trigger('goToNextCategory');
  }
});