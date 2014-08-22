'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var flightLengthTemplate = require('../../templates/events/evt-travel-flight-length-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: flightLengthTemplate,
  events : {
    'blur input[name="short_flights"]': 'validateField',
    'blur input[name="med_flights"]': 'validateField',
    'blur input[name="long_flights"]': 'validateField'
  },
  ui: {
    shortFlightsInput: 'input[name="short_flights"]',
    medFlightsInput: 'input[name="med_flights"]',
    longFlightsInput: 'input[name="long_flights"]'
  },
  onShow: function() {
    var shortFlights = this.category.get('shortFlights') || 0
    , medFlights = this.category.get('medFlights') || 0
    , longFlights = this.category.get('longFlights') || 0;

    if(shortFlights) this.ui.shortFlightsInput.val(shortFlights);
    if(medFlights) this.ui.medFlightsInput.val(medFlights);
    if(longFlights) this.ui.longFlightsInput.val(longFlights);
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
    if(!isDigit(view.ui.shortFlightsInput)) return false;
    if(!isDigit(view.ui.medFlightsInput)) return false;
    if(!isDigit(view.ui.longFlightsInput)) return false;
    return true;
  },
  validateField: function(event) {
    var view = this;
    var $target = $(event.target);
    var val = $target.val();
    if(!val || val === '' || val === undefined || val.match(/^\d+$/) === null) {
      view.displayError($target);
      return false;
    } else {
      view.displaySuccess($target);
      return true;
    }
  },
  displaySuccess: function($elem) {
    $elem.nextAll('.display-error')
      .html('')
      .parent()
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
  },
  displayError: function($elem) {
    $elem.nextAll('.display-error')
      .html(' must contain a number')
      .parent()
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {
    var view = this;  
    if(!view.validateForm()) return; 
    var shortFlights = Number(view.ui.shortFlightsInput.val())
    , medFlights = Number(view.ui.medFlightsInput.val())
    , longFlights = Number(view.ui.longFlightsInput.val())
    , travel = require('../../utils/evt-travel-emissions');

    travel.setCalculateBy('flightDuration');
    travel.arrivedOnShortFlights = shortFlights;
    travel.arrivedOnMedFlights = medFlights;
    travel.arrivedOnLongFlights = longFlights;

    var totalEmissions = 0;
    totalEmissions += travel.totalEmissions('shortHaul');
    totalEmissions += travel.totalEmissions('medHaul');
    totalEmissions += travel.totalEmissions('longHaul');

    view.category.set({
      shortFlights: shortFlights,
      medFlights: medFlights,
      longFlights: longFlights,
      totalEmissions: totalEmissions
    }); 
    App.vent.trigger('showInputView', 'hotel');
  }
});

