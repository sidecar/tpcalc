'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var ecarTemplate = require('../templates/ind-vehicle-ecar-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: ecarTemplate,
  ui: {
    zipInput: 'input[name="ecar_zip"]', 
    yearSelect: 'select[name="ecar_year"]',
    mileageSelect: 'select[name="ecar_mileage"]' 
  },
  events: {
    'blur input[name="ecar_zip"]': 'validate',
    'change select[name="ecar_year"]': 'validate',
    'change select[name="ecar_mileage"]': 'validate'
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentVehicle');
    this.valid = false;
    this.vehicle.on('invalid', function (m, err) {
      // `err` will be an object with the error message {type:'message'}.
      if(err.zip) {
        self.valid = false; 
        self.displayError(self.ui.zipInput, err.zip)
        return;
      }
      if(err.year) {
        self.valid = false; 
        self.displayError(self.ui.yearSelect, err.year)
        return;
      }
      if(err.mileage) {
        self.valid = false; 
        self.displayError(self.ui.mileageSelect, err.mileage)
        return;
      }
    });

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var year = this.vehicle.get('year') || undefined
    , zip = this.vehicle.get('zip') || undefined
    , mileage = this.vehicle.get('mileage') || undefined;
    
    if(zip) this.modelBinder.watch('value: zip', {selector: '[name="ecar_zip"]'});
    if(year) this.modelBinder.watch('value: year', {selector: '[name="ecar_year"]'});
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="ecar_mileage"]'});
  },
  validate: function(event) {
    if(event) { 
      event.preventDefault();
      this.displaySuccess($(event.target));
    }
    this.valid = true;
    this.vehicle.set({
      zip: this.ui.zipInput.val(),
      year: this.ui.yearSelect.val(),
      mileage: this.ui.mileageSelect.val()
    }, {validate: true});
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
  displayError: function($elem, err) {
    $elem.parent()
      .prev('label')
      .html(err)
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {
    this.validate();
    if(this.valid) App.vent.trigger('showInputView', 'list');
  }
});