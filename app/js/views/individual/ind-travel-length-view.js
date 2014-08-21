'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var lengthTemplate = require('../../templates/individual/ind-travel-length-template.hbs')

module.exports = Marionette.ItemView.extend({
  template: lengthTemplate,
  ui: {
    shortInput: '[name="short"]',
    medEconInput: '[name="med_econ"]',
    medFirstClassInput: '[name="med_first_class"]',
    longEconInput: '[name="long_econ"]',
    longEconPlusInput: '[name="long_econ_plus"]',
    longBizClassInput: '[name="long_biz_class"]',
    longFirstClassInput: '[name="long_first_class"]'
  },
  events: {
    'blur [name="short"]': 'validateField',
    'blur [name="med_econ"]': 'validateField',
    'blur [name="med_first_class"]': 'validateField',
    'blur [name="long_econ"]': 'validateField',
    'blur [name="long_econ_plus"]': 'validateField',
    'blur [name="long_biz_class"]': 'validateField',
    'blur [name="long_first_class"]': 'validateField'
  },
  onShow: function() {
    this.ui.shortInput.val(this.category.get('milesShortFlights') || 0);
    this.ui.medEconInput.val(this.category.get('milesMedEconFlights') || 0);
    this.ui.medFirstClassInput.val(this.category.get('milesMedFirstClassFlights') || 0);
    this.ui.longEconInput.val(this.category.get('milesLongEconFlights') || 0);
    this.ui.longEconPlusInput.val(this.category.get('milesLongEconPlusFlights') || 0);
    this.ui.longBizClassInput.val(this.category.get('milesLongBizClassFlights') || 0);
    this.ui.longFirstClassInput.val(this.category.get('milesLongFirstClassFlights') || 0);
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

    if(!isDigit(view.ui.shortInput)) return false;
    if(!isDigit(view.ui.medEconInput)) return false;
    if(!isDigit(view.ui.medFirstClassInput)) return false;
    if(!isDigit(view.ui.longEconInput)) return false;
    if(!isDigit(view.ui.longEconPlusInput)) return false;
    if(!isDigit(view.ui.longBizClassInput)) return false;
    if(!isDigit(view.ui.longFirstClassInput)) return false;

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
    $elem.parent().parent('div')
      .addClass('has-success')
      .removeClass('has-error');
    $('.display-error')
      .html('');
  },
  displayError: function($elem) {
    $elem.parent().parent('div')
      .addClass('has-error')
      .removeClass('has-success');
    $('.display-error')
      .html('Indicated fields must contain a number.');
  },
  getNextInputView: function() {
    var view = this;  
    if(!view.validateForm()) return; 

    var numShortFlights = view.ui.shortInput.val()
    , numMedEconFlights = view.ui.medEconInput.val()
    , numMedFirstClassFlights = view.ui.medFirstClassInput.val()
    , numLongEconFlights = view.ui.longEconInput.val()
    , numLongEconPlusFlights = view.ui.longEconPlusInput.val()
    , numLongBizClassFlights = view.ui.longBizClassInput.val()
    , numLongFirstClassFlights = view.ui.longFirstClassInput.val();

    var air = require('../../utils/ind-air-emissions');
    air.setCalculateBy('flightCount');
    air.useRFI = (this.category.get('useRFI')) ? 1 : 0 ;
    air.flight.shortHaul.annFlights = numShortFlights;
    air.flight.medEcon.annFlights = numMedEconFlights;
    air.flight.medFirst.annFlights = numMedFirstClassFlights;
    air.flight.longEcon.annFlights = numLongEconFlights;
    air.flight.longEconPlus.annFlights = numLongEconPlusFlights;
    air.flight.longBusiness.annFlights = numLongBizClassFlights;
    air.flight.longFirst.annFlights = numLongFirstClassFlights;
    
    var totalEmissions = 0;
    totalEmissions += air.totalEmissions('shortHaul');
    totalEmissions += air.totalEmissions('medEcon');
    totalEmissions += air.totalEmissions('medFirst');    
    totalEmissions += air.totalEmissions('longEcon');    
    totalEmissions += air.totalEmissions('longEconPlus');    
    totalEmissions += air.totalEmissions('longBusiness');
    totalEmissions += air.totalEmissions('longFirst');

    this.category.set({
      numShortFlights: numShortFlights,
      numMedEconFlights: numMedEconFlights,
      numMedFirstClassFlights: numMedFirstClassFlights,
      numLongEconFlights: numLongEconFlights,
      numLongEconPlusFlights: numLongEconPlusFlights,
      numLongBizClassFlights: numLongBizClassFlights,
      numLongFirstClassFlights: numLongFirstClassFlights,
      totalEmissions: totalEmissions
    });
    App.vent.trigger('goToNextCategory');
  }
});