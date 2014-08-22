'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var groundTemplate = require('../../templates/events/evt-travel-ground-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: groundTemplate,
  ui: {
    carAttendeesInput: 'input[name="car_attendees"]',
    carMileageInput: 'input[name="car_mileage"]',
    trainAttendeesInput: 'input[name="train_attendees"]',
    trainMileageInput: 'input[name="train_mileage"]',
    busAttendeesInput: 'input[name="bus_attendees"]',
    busMileageInput: 'input[name="bus_mileage"]',
    taxiAttendeesInput: 'input[name="taxi_attendees"]',
    taxiMileageInput: 'input[name="taxi_mileage"]',
    ferryAttendeesInput: 'input[name="ferry_attendees"]',
    ferryMileageInput: 'input[name="ferry_mileage"]'
  },
  events: {
    'blur input[name="car_attendees"]': 'carAttendeesInputChanged',
    'blur input[name="car_mileage"]': 'carMileageInputChanged',
    'blur input[name="train_attendees"]': 'trainAttendeesInputChanged',
    'blur input[name="train_mileage"]': 'trainMileageInputChanged',
    'blur input[name="bus_attendees"]': 'busAttendeesInputChanged',
    'blur input[name="bus_mileage"]': 'busMileageInputChanged',
    'blur input[name="taxi_attendees"]': 'taxiAttendeesInputChanged',
    'blur input[name="taxi_mileage"]': 'taxiMileageInputChanged',
    'blur input[name="ferry_attendees"]': 'ferryAttendeesInputChanged',
    'blur input[name="ferry_mileage"]': 'ferryMileageInputChanged'
  },
  carAttendeesInputChanged: function() {
    this.displaySuccess(this.ui.carAttendeesInput);
  },
  carMileageInputChanged: function() {
    this.displaySuccess(this.ui.carMileageInput);
  },
  trainAttendeesInputChanged: function() {
    this.displaySuccess(this.ui.trainAttendeesInput);
  },
  trainMileageInputChanged: function() {
    this.displaySuccess(this.ui.trainMileageInput);
  },
  busAttendeesInputChanged: function() {
    this.displaySuccess(this.ui.busAttendeesInput);
  },
  busMileageInputChanged: function() {
    this.displaySuccess(this.ui.busMileageInput);
  },
  taxiAttendeesInputChanged: function() {
    this.displaySuccess(this.ui.taxiAttendeesInput);
  },
  taxiMileageInputChanged: function() {
    this.displaySuccess(this.ui.taxiMileageInput);
  },
  ferryAttendeesInputChanged: function() {
    this.displaySuccess(this.ui.ferryAttendeesInput);
  },
  ferryMileageInputChanged: function() {
    this.displaySuccess(this.ui.ferryMileageInput);
  },
  onShow: function() {
    var self = this;
    this.category.validate = function(attrs, options) {

      if(!attrs.carAttendees || attrs.carAttendees == '' || attrs.carAttendees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.carAttendeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.carAttendeesInput);
      }

      if(!attrs.carMileage || attrs.carMileage == '' || attrs.carMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.carMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.carMileageInput);
      }

      if(!attrs.trainAttendees || attrs.trainAttendees == '' || attrs.trainAttendees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.trainAttendeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.trainAttendeesInput);
      }

      if(!attrs.trainMileage || attrs.trainMileage == '' || attrs.trainMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.trainMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.trainMileageInput);
      }

      if(!attrs.busAttendees || attrs.busAttendees == '' || attrs.busAttendees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.busAttendeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.busAttendeesInput);
      }

      if(!attrs.busMileage || attrs.busMileage == '' || attrs.busMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.busMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.busMileageInput);
      }

      if(!attrs.taxiAttendees || attrs.taxiAttendees == '' || attrs.taxiAttendees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.taxiAttendeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.taxiAttendeesInput);
      }

      if(!attrs.taxiMileage || attrs.taxiMileage == '' || attrs.taxiMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.taxiMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.taxiMileageInput);
      }

      if(!attrs.ferryAttendees || attrs.ferryAttendees == '' || attrs.ferryAttendees.match(/^\d*$/) == null) {       
        self.displayError(self.ui.ferryAttendeesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.ferryAttendeesInput);
      }

      if(!attrs.ferryMileage || attrs.ferryMileage == '' || attrs.ferryMileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.ferryMileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.ferryMileageInput);
      }

      return true;
    }

    this.ui.carAttendeesInput.val(this.category.get('carAttendees') || 0);
    this.ui.carMileageInput.val(this.category.get('carMileage') || 0);
    this.ui.trainAttendeesInput.val(this.category.get('trainAttendees') || 0);
    this.ui.trainMileageInput.val(this.category.get('trainMileage') || 0);
    this.ui.busAttendeesInput.val(this.category.get('busAttendees') || 0);
    this.ui.busMileageInput.val(this.category.get('busMileage') || 0);
    this.ui.taxiAttendeesInput.val(this.category.get('taxiAttendees') || 0);
    this.ui.taxiMileageInput.val(this.category.get('taxiMileage') || 0);
    this.ui.ferryAttendeesInput.val(this.category.get('ferryAttendees') || 0);
    this.ui.ferryMileageInput.val(this.category.get('ferryMileage') || 0);

  },
  validate: function() {
    var attrs = {
      carAttendees: this.ui.carAttendeesInput.val(),
      carMileage: this.ui.carMileageInput.val(),      
      trainAttendees: this.ui.trainAttendeesInput.val(),
      trainMileage: this.ui.trainMileageInput.val(),    
      busAttendees: this.ui.busAttendeesInput.val(),
      busMileage: this.ui.busMileageInput.val(),
      taxiAttendees: this.ui.taxiAttendeesInput.val(),
      taxiMileage: this.ui.taxiMileageInput.val(),
      ferryAttendees: this.ui.ferryAttendeesInput.val(),
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
      carAttendees: this.ui.carAttendeesInput.val(),
      carMileage: this.ui.carMileageInput.val(),
      trainAttendees: this.ui.trainAttendeesInput.val(),
      trainMileage: this.ui.trainMileageInput.val(),      
      busAttendees: this.ui.busAttendeesInput.val(),
      busMileage: this.ui.busMileageInput.val(),
      taxiAttendees: this.ui.taxiAttendeesInput.val(),
      taxiMileage: this.ui.taxiMileageInput.val(),
      ferryAttendees: this.ui.ferryAttendeesInput.val(),
      ferryMileage: this.ui.ferryMileageInput.val()
    }

    if(this.category.validate(attrs)) {
      this.category.set(attrs);
      var ground = require('../../utils/evt-ground-emissions');
      var groundEmissions = 0;
      ground.car.Attendees = this.ui.carAttendeesInput.val();
      ground.car.roundTripMiles = this.ui.carMileageInput.val();
      ground.train.Attendees = this.ui.trainAttendeesInput.val();
      ground.train.roundTripMiles = this.ui.trainMileageInput.val();     ;
      ground.bus.Attendees = this.ui.busAttendeesInput.val();
      ground.bus.roundTripMiles = this.ui.busMileageInput.val();
      ground.taxi.Attendees = this.ui.taxiAttendeesInput.val();
      ground.taxi.roundTripMiles = this.ui.taxiMileageInput.val();
      ground.ferry.Attendees = this.ui.ferryAttendeesInput.val();
      ground.ferry.roundTripMiles = this.ui.ferryMileageInput.val();

      groundEmissions += ground.totalEmissions('car');
      groundEmissions += ground.totalEmissions('train');
      groundEmissions += ground.totalEmissions('bus');
      groundEmissions += ground.totalEmissions('taxi');
      groundEmissions += ground.totalEmissions('ferry');

      this.category.set({groundEmissions: groundEmissions});
      this.category.trigger('change:groundEmissions');
      App.vent.trigger('goToNextCategory');
    }


  }
});





