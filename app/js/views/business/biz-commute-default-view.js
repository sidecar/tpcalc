'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var defaultTemplate = require('../../templates/business/biz-commute-default-template.hbs')

module.exports = Marionette.ItemView.extend({
  template: defaultTemplate,
  ui: {
    carEmployeesInput: 'input[name="car_employees"]',
    carMileageInput: 'input[name="car_mileage"]',
    trainEmployeesInput: 'input[name="train_employees"]',
    trainMileageInput: 'input[name="train_mileage"]',
    busEmployeesInput: 'input[name="bus_employees"]',
    busMileageInput: 'input[name="bus_mileage"]',
    taxiEmployeesInput: 'input[name="taxi_employees"]',
    taxiMileageInput: 'input[name="taxi_mileage"]',
    ferryEmployeesInput: 'input[name="ferry_employees"]',
    ferryMileageInput: 'input[name="ferry_mileage"]'
  },
  events: {
    'blur input[name="car_employees"]': 'carEmployeesInputChanged',
    'blur input[name="car_mileage"]': 'carMileageInputChanged',
    'blur input[name="train_employees"]': 'trainEmployeesInputChanged',
    'blur input[name="train_mileage"]': 'trainMileageInputChanged',
    'blur input[name="bus_employees"]': 'busEmployeesInputChanged',
    'blur input[name="bus_mileage"]': 'busMileageInputChanged',
    'blur input[name="taxi_employees"]': 'taxiEmployeesInputChanged',
    'blur input[name="taxi_mileage"]': 'taxiMileageInputChanged',
    'blur input[name="ferry_employees"]': 'ferryEmployeesInputChanged',
    'blur input[name="ferry_mileage"]': 'ferryMileageInputChanged'
  },
  carEmployeesInputChanged: function() {
    this.displaySuccess(this.ui.carEmployeesInput);
  },
  carMileageInputChanged: function() {
    this.displaySuccess(this.ui.carMileageInput);
  },
  trainEmployeesInputChanged: function() {
    this.displaySuccess(this.ui.trainEmployeesInput);
  },
  trainMileageInputChanged: function() {
    this.displaySuccess(this.ui.trainMileageInput);
  },
  busEmployeesInputChanged: function() {
    this.displaySuccess(this.ui.busEmployeesInput);
  },
  busMileageInputChanged: function() {
    this.displaySuccess(this.ui.busMileageInput);
  },
  taxiEmployeesInputChanged: function() {
    this.displaySuccess(this.ui.taxiEmployeesInput);
  },
  taxiMileageInputChanged: function() {
    this.displaySuccess(this.ui.taxiMileageInput);
  },
  ferryEmployeesInputChanged: function() {
    this.displaySuccess(this.ui.ferryEmployeesInput);
  },
  ferryMileageInputChanged: function() {
    this.displaySuccess(this.ui.ferryMileageInput);
  },
  onShow: function() {
    var self = this;
    this.category.validate = function(attrs, options) {

      if(!attrs.carEmployees || attrs.carEmployees == '' || attrs.carEmployees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.carEmployeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.carEmployeesInput);
      }

      if(!attrs.carMileage || attrs.carMileage == '' || attrs.carMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.carMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.carMileageInput);
      }

      if(!attrs.trainEmployees || attrs.trainEmployees == '' || attrs.trainEmployees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.trainEmployeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.trainEmployeesInput);
      }

      if(!attrs.trainMileage || attrs.trainMileage == '' || attrs.trainMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.trainMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.trainMileageInput);
      }

      if(!attrs.busEmployees || attrs.busEmployees == '' || attrs.busEmployees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.busEmployeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.busEmployeesInput);
      }

      if(!attrs.busMileage || attrs.busMileage == '' || attrs.busMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.busMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.busMileageInput);
      }

      if(!attrs.taxiEmployees || attrs.taxiEmployees == '' || attrs.taxiEmployees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.taxiEmployeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.taxiEmployeesInput);
      }

      if(!attrs.taxiMileage || attrs.taxiMileage == '' || attrs.taxiMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.taxiMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.taxiMileageInput);
      }

      if(!attrs.ferryEmployees || attrs.ferryEmployees == '' || attrs.ferryEmployees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.ferryEmployeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.ferryEmployeesInput);
      }

      if(!attrs.ferryMileage || attrs.ferryMileage == '' || attrs.ferryMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.ferryMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.ferryMileageInput);
      }

      return true;
    }

    this.ui.carEmployeesInput.val(this.category.get('carEmployees') || 0);
    this.ui.carMileageInput.val(this.category.get('carMileage') || 0);
    this.ui.trainEmployeesInput.val(this.category.get('trainEmployees') || 0);
    this.ui.trainMileageInput.val(this.category.get('trainMileage') || 0);
    this.ui.busEmployeesInput.val(this.category.get('busEmployees') || 0);
    this.ui.busMileageInput.val(this.category.get('busMileage') || 0);
    this.ui.taxiEmployeesInput.val(this.category.get('taxiEmployees') || 0);
    this.ui.taxiMileageInput.val(this.category.get('taxiMileage') || 0);
    this.ui.ferryEmployeesInput.val(this.category.get('ferryEmployees') || 0);
    this.ui.ferryMileageInput.val(this.category.get('ferryMileage') || 0);

  },
  validate: function() {
    var attrs = {
      carEmployees: this.ui.carEmployeesInput.val(),
      carMileage: this.ui.carMileageInput.val(),      
      trainEmployees: this.ui.trainEmployeesInput.val(),
      trainMileage: this.ui.trainMileageInput.val(),    
      busEmployees: this.ui.busEmployeesInput.val(),
      busMileage: this.ui.busMileageInput.val(),
      taxiEmployees: this.ui.taxiEmployeesInput.val(),
      taxiMileage: this.ui.taxiMileageInput.val(),
      ferryEmployees: this.ui.ferryEmployeesInput.val(),
      ferryMileage: this.ui.ferryMileageInput.val()
    }
    this.category.validate(attrs);
  },
  displaySuccess: function($elem) {
    $elem.parent()
      .prev('label')
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
    $('.display-error').html('');
  },
  displayError: function($elem) {
    $elem.parent()
      .prev('label')
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
    $('.display-error').html('Indicated fields require a number');
  },
  getNextInputView: function() {   
    var attrs = {
      carEmployees: this.ui.carEmployeesInput.val(),
      carMileage: this.ui.carMileageInput.val(),
      trainEmployees: this.ui.trainEmployeesInput.val(),
      trainMileage: this.ui.trainMileageInput.val(),      
      busEmployees: this.ui.busEmployeesInput.val(),
      busMileage: this.ui.busMileageInput.val(),
      taxiEmployees: this.ui.taxiEmployeesInput.val(),
      taxiMileage: this.ui.taxiMileageInput.val(),
      ferryEmployees: this.ui.ferryEmployeesInput.val(),
      ferryMileage: this.ui.ferryMileageInput.val()
    }

    if(this.category.validate(attrs)) {
      this.category.set(attrs);
      var commute = require('../../utils/biz-commute-emissions');
      var totalEmissions = 0;
      commute.car.employees = this.ui.carEmployeesInput.val();
      commute.car.roundTripMiles = this.ui.carMileageInput.val();
      commute.train.employees = this.ui.trainEmployeesInput.val();
      commute.train.roundTripMiles = this.ui.trainMileageInput.val();     ;
      commute.bus.employees = this.ui.busEmployeesInput.val();
      commute.bus.roundTripMiles = this.ui.busMileageInput.val();
      commute.taxi.employees = this.ui.taxiEmployeesInput.val();
      commute.taxi.roundTripMiles = this.ui.taxiMileageInput.val();
      commute.ferry.employees = this.ui.ferryEmployeesInput.val();
      commute.ferry.roundTripMiles = this.ui.ferryMileageInput.val();

      totalEmissions += commute.totalEmissions('car');
      totalEmissions += commute.totalEmissions('train');
      totalEmissions += commute.totalEmissions('bus');
      totalEmissions += commute.totalEmissions('taxi');
      totalEmissions += commute.totalEmissions('ferry');

      this.category.set({totalEmissions: totalEmissions});
      App.vent.trigger('goToNextCategory');
    }


  }
});





