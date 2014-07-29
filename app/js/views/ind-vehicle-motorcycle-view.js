'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var motorcycleTemplate = require('../templates/ind-vehicle-motorcycle-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: motorcycleTemplate,
  ui: {
    mileageSelect: 'select[name="moto_mileage"]' 
  },
  events: {
    'change select[name="moto_mileage"]': 'validate'
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentVehicle');
    this.valid = false;
    this.vehicle.on('invalid', function (m, err) {
      // `err` will be an object with the error message {type:'message'}.
      if(err.mileage) {
        self.valid = false; 
        self.displayError(self.ui.mileageSelect, err.mileage)
        return;
      }
    });

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var mileage = this.vehicle.get('mileage') || undefined;
    
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="moto_mileage"]'});
  },
  remove: function() {
    this.vehicle.off('invalid');
    Backbone.View.prototype.remove.call(this);
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
  validate: function(event) {
    if(event) { 
      event.preventDefault();
      this.displaySuccess($(event.target));
    }
    this.valid = true;
    this.vehicle.set({
      mileage: this.ui.mileageSelect.val()
    }, {validate: true});
  },
  getNextInputView: function() {
    this.validate();
    if(this.valid) App.vent.trigger('showInputView', 'list');
  }
});