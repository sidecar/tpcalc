'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var flightAverageTemplate = require('../../templates/events/evt-travel-flight-average-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: flightAverageTemplate,
  events : {
    'blur input[name="attendees"]': 'validateField',
    'blur input[name="average"]': 'validateField'
  },
  ui: {
    attendeesInput: 'input[name="attendees"]',
    averageInput: 'input[name="average"]'
  },
  onShow: function() {
    var attendees = this.category.get('attendees') || 0
    , average = this.category.get('average') || 0;

    if(attendees) this.ui.attendeesInput.val(attendees);
    if(average) this.ui.averageInput.val(average);
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
    if(!isDigit(view.ui.attendeesInput)) return false;
    if(!isDigit(view.ui.averageInput)) return false;
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
      .html(' (must contain a number)')
      .parent()
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {
    var view = this;  
    if(!view.validateForm()) return; 
    var attendees = Number(view.ui.attendeesInput.val())
    , average = Number(view.ui.averageInput.val())
    , travel = require('../../utils/evt-travel-emissions');

    travel.setCalculateBy('averageDistance');
    travel.attendees = attendees;
    travel.aveMileage = average;

    var totalEmissions = travel.totalEmissions();

    view.category.set({
      attendees: attendees,
      average: average,
      totalEmissions: totalEmissions
    }); 
    App.vent.trigger('showInputView', 'hotel');
  }
});


