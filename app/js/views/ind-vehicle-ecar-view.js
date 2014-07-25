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
    this.validated = {};
    this.vehicle.on('invalid', function (m, err) {
      // `err` will be an object with the error message {type:'message'}.
      if(err.zip) { 
        self.displayError(self.ui.zipInput, err.zip)
        return;
      }
      if(err.year) {
        self.displayError(self.ui.yearSelect, err.year)
        return;
      }
      if(err.mileage) {
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
    event.preventDefault();
    this.displaySuccess($(event.target));
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
    var zip = this.vehicle.get('zip')
    , year = this.vehicle.get('year')
    , mileage = this.vehicle.get('mileage');

    if(typeof(zip) == 'undefined' || zip == null || zip == '') {
      App.vent.trigger('errorAlert', 'Please, enter your car\'s zip');
      return;
    }
    if(typeof(year) == 'undefined' || year == null || year == '') {
      App.vent.trigger('errorAlert', 'Please, select your car\'s year');
      return;
    } 
    if(typeof(mileage) == 'undefined' || mileage == null || mileage == '') {
      App.vent.trigger('errorAlert', 'Please, select your car\'s mileage');
      return;
    }
    console.log(this.vehicle);
    //App.vent.trigger('showInputView', 'list');
  }
});