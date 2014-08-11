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
    'change select[name="ecar_year"]': 'yearSelectChanged',
    'change select[name="ecar_mileage"]': 'mileageSelectChanged'
  },
  yearSelectChanged: function() {
    this.displaySuccess(this.ui.yearSelect);
  },
  mileageSelectChanged: function() {
    this.displaySuccess(this.ui.mileageSelect);
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentVehicle');

    this.vehicle.validate = function(attrs, options) {
      if(!attrs.zip || attrs.zip == '' || attrs.zip.match(/^\d{5}(-\d{4})?$/) == null) {
        self.displayError(self.ui.zipInput);
        return false;
      } else {
        self.displaySuccess(self.ui.zipInput);
      }

      if(!attrs.year || attrs.year == '') {
        self.displayError(self.ui.yearSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.yearSelect);
      }
      
      if(!attrs.mileage || attrs.mileage == '') {
        self.displayError(self.ui.mileageSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.mileageSelect);
      }

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var year = this.vehicle.get('year') || undefined
    , zip = this.vehicle.get('zip') || undefined
    , mileage = this.vehicle.get('mileage') || undefined;
    
    if(zip) this.modelBinder.watch('value: zip', {selector: '[name="ecar_zip"]'});
    if(year) this.modelBinder.watch('value: year', {selector: '[name="ecar_year"]'});
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="ecar_mileage"]'});
  },
  validate: function() {
    var attrs = {
      zip: this.ui.zipInput.val(),
      year: this.ui.yearSelect.val(),
      mileage: this.ui.mileageSelect.val()
    }
    this.vehicle.validate(attrs);
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
    var attrs = {
      zip: this.ui.zipInput.val(),
      year: this.ui.yearSelect.val(),
      mileage: this.ui.mileageSelect.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);
      App.vent.trigger('showInputView', 'list');
    }
  }
});