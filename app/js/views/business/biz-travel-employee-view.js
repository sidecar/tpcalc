'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var employeeTemplate = require('../../templates/business/biz-travel-employee-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: employeeTemplate,
  ui: {
    numEmployeesInput: 'input[name="num_employees"]',
    shortHaul: 'input[name="short_haul"]',
    medHaul: 'input[name="med_haul"]',
    longHaul: 'input[name="long_haul"]'
  },
  onShow: function() {
   
    this.modelBinder = new Databinding.ModelBinder(this, this.category);

    var numEmployees = this.category.get('numEmployeesTraveling') || undefined
    , shortHaul = this.category.get('shortHaulPerEmp') || undefined
    , medHaul = this.category.get('medHaulPerEmp') || undefined
    , longHaul = this.category.get('longHaulPerEmp') || undefined;

    if(numEmployees) this.modelBinder.watch('value: numEmployeesTraveling', {selector: '[name="num_employees"]'});
    if(shortHaul) this.modelBinder.watch('value: shortHaulPerEmp', {selector: '[name="short_haul"]'});
    if(medHaul) this.modelBinder.watch('value: medHaulPerEmp', {selector: '[name="med_haul"]'});
    if(longHaul) this.modelBinder.watch('value: longHaulPerEmp', {selector: '[name="long_haul"]'});
  },
  getNextInputView: function() {   
    var attrs = {
      numEmployeesTraveling: $('input[name="num_employees"]').val(),
      shortHaulPerEmp: $('input[name="short_haul"]').val(),
      medHaulPerEmp: $('input[name="med_haul"]').val(),
      longHaulPerEmp: $('input[name="long_haul"]').val()
    }
    this.category.set(attrs); 
    App.vent.trigger('goToNextCategory');
  }
});

