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
    this.vehicle = this.category.get('currentVehicle');
    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var mileage = this.vehicle.get('mileage') || undefined;
    
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="moto_mileage"]'});
  },
  getNextInputView: function() {
    this.vehicle.set({mileage: this.ui.mileageSelect.val()});
    App.vent.trigger('showInputView', 'list');
  }
});