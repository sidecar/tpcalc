'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app')
, numeral = require('numeral');

var defaultTemplate = require('../../templates/individual/ind-transit-default-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
  ui: {
    trainMileageInput: '[name="train_mileage"]',
    trainIntervalInput: '[name="train_interval"]',
    busMileageInput: '[name="bus_mileage"]',
    busIntervalInput: '[name="bus_interval"]',
    taxiMileageInput: '[name="taxi_mileage"]',
    taxiIntervalInput: '[name="taxi_interval"]',
    ferryMileageInput: '[name="ferry_mileage"]',
    ferryIntervalInput: '[name="ferry_interval"]'
  },
  events: {
    'blur [name="train_mileage"]': 'validateField',
    'blur [name="bus_mileage"]': 'validateField',
    'blur [name="taxi_mileage"]': 'validateField',
    'blur [name="ferry_mileage"]': 'validateField',
  },
  onShow: function() {
    this.ui.trainMileageInput.val(this.category.get('trainMileage') || 0);
    this.ui.trainIntervalInput.val(this.category.get('trainInterval') || 0);
    this.ui.busMileageInput.val(this.category.get('busMileage') || 0);
    this.ui.busIntervalInput.val(this.category.get('busInterval') || 0);
    this.ui.taxiMileageInput.val(this.category.get('taxiMileage') || 0);
    this.ui.taxiIntervalInput.val(this.category.get('taxiInterval') || 0);
    this.ui.ferryMileageInput.val(this.category.get('ferryMileage') || 0);
    this.ui.ferryIntervalInput.val(this.category.get('ferryInterval') || 0);
  },
  validateForm: function(){
    var view = this;
    function isDigit($input) {
      var val = $input.val();
      if(!val || val === '' || val === undefined || val.match(/^\d+$/) === null) {
        view.displayError($input);
        return false;
      } else {
        view.displaySuccess($input);
        return true;
      }
    }

    if(!isDigit(view.ui.trainMileageInput)) return false;
    if(!isDigit(view.ui.busMileageInput)) return false;
    if(!isDigit(view.ui.taxiMileageInput)) return false;
    if(!isDigit(view.ui.ferryMileageInput)) return false;

    return true;
  },
  validateField: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(!val || val === '' || val.match(/^\d*$/) === null) {       
      this.displayError($target);
      return false;
    } else {
      this.displaySuccess($target);
    }
  },
  displaySuccess: function($elem) {
    $elem.parent('td')
      .addClass('has-success')
      .removeClass('has-error');
    $('.display-error')
      .html('');
  },
  displayError: function($elem) {
    $elem.parent('td')
      .addClass('has-error')
      .removeClass('has-success');
    $('.display-error')
      .html('Indicated fields must contain a number.');
  },
  getNextInputView: function() {
    var view = this;  
    if(!view.validateForm()) return; 

    var trainMileage = parseInt($('[name="train_mileage"]').val())
    , trainInterval = $('[name="train_interval"]').val()
    , busMileage = parseInt($('[name="bus_mileage"]').val())
    , busInterval = $('[name="bus_interval"]').val()
    , taxiMileage = parseInt($('[name="taxi_mileage"]').val())
    , taxiInterval = $('[name="taxi_interval"]').val()
    , ferryMileage = parseInt($('[name="ferry_mileage"]').val())
    , ferryInterval = $('[name="ferry_interval"]').val();
    
    var transit = require('../../utils/ind-transit-emissions');
    transit.train.milesPer = trainMileage;
    transit.train.interval = trainInterval;
    transit.bus.milesPer = busMileage;
    transit.bus.interval = busInterval;
    transit.taxi.milesPer = taxiMileage;
    transit.taxi.interval = taxiInterval;
    transit.ferry.milesPer = ferryMileage;
    transit.ferry.interval = ferryInterval;

    var totalEmissions = 0;
    totalEmissions += transit.totalEmissions('train');
    totalEmissions += transit.totalEmissions('bus');
    totalEmissions += transit.totalEmissions('taxi');
    totalEmissions += transit.totalEmissions('ferry');

    this.category.set({
      trainMileage: trainMileage,
      trainInterval: trainInterval,
      busMileage: busMileage,
      busInterval: busInterval,
      taxiMileage: taxiMileage,
      taxiInterval: taxiInterval,
      ferryMileage: ferryMileage,
      ferryInterval: ferryInterval,
      totalEmissions: totalEmissions
    });
    App.vent.trigger('goToNextCategory');
  }
});