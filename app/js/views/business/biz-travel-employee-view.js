'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var employeeTemplate = require('../../templates/business/biz-travel-employee-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: employeeTemplate,
  events : {
    'blur input[name="num_employees"]': 'validateField',
    'blur input[name="short_haul"]': 'validateField',
    'blur input[name="med_haul"]': 'validateField',
    'blur input[name="long_haul"]': 'validateField'
  },
  ui: {
    numEmployeesInput: 'input[name="num_employees"]',
    shortHaulInput: 'input[name="short_haul"]',
    medHaulInput: 'input[name="med_haul"]',
    longHaulInput: 'input[name="long_haul"]'
  },
  onShow: function() {
    var numEmployees = this.category.get('numEmployeesTraveling') || 0
    , shortHaul = this.category.get('shortHaulPerEmp') || 0
    , medHaul = this.category.get('medHaulPerEmp') || 0
    , longHaul = this.category.get('longHaulPerEmp') || 0;

    if(numEmployees) this.ui.numEmployeesInput.val(numEmployees);
    if(shortHaul) this.ui.shortHaulInput.val(shortHaul);
    if(medHaul) this.ui.medHaulInput.val(medHaul);
    if(longHaul) this.ui.longHaulInput.val(longHaul);
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
    if(!isDigit(view.ui.numEmployeesInput)) return false;
    if(!isDigit(view.ui.shortHaulInput)) return false;
    if(!isDigit(view.ui.medHaulInput)) return false;
    if(!isDigit(view.ui.longHaulInput)) return false;
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
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('default-label');
        })
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
  },
  displayError: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('error-msg');
        })
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {
    var view = this;  
    if(!view.validateForm()) return; 
    var kmsToMiles = 0.621371
    , kmsPerShortHaul = 462
    , kmsPerMedHaul = 1108
    , kmsPerLongHaul = 6482
    , numEmployeesTraveling = Number(view.ui.numEmployeesInput.val())
    , shortHaulPerEmp = Number(view.ui.shortHaulInput.val())
    , medHaulPerEmp = Number(view.ui.medHaulInput.val())
    , longHaulPerEmp = Number(view.ui.longHaulInput.val())
    , travel = require('../../utils/biz-travel-emissions');

    travel.setCalculateBy('flightMiles');
    travel.employees = numEmployeesTraveling;
    travel.flight.shortHaul.annMiles = shortHaulPerEmp * kmsPerShortHaul * kmsToMiles;
    travel.flight.medHaul.annMiles = medHaulPerEmp * kmsPerMedHaul * kmsToMiles;
    travel.flight.longHaul.annMiles = longHaulPerEmp * kmsPerLongHaul * kmsToMiles;

    var totalEmissions = 0;
    totalEmissions += travel.totalEmissions('shortHaul');
    totalEmissions += travel.totalEmissions('medHaul');
    totalEmissions += travel.totalEmissions('longHaul');

    view.category.set({
      numEmployeesTraveling: numEmployeesTraveling,
      shortHaulPerEmp: shortHaulPerEmp,
      medHaulPerEmp: medHaulPerEmp,
      longHaulPerEmp: longHaulPerEmp,
      totalEmissions: totalEmissions
    }); 
    App.vent.trigger('goToNextCategory');
  }
});

