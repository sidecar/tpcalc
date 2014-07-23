var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var defaultTemplate = require('../templates/ind-vehicle-default-template.hbs')

var utils = require('../utils/utility');

var SelectView = require('./select-view');

module.exports = Marionette.ItemView.extend({ 
  template: defaultTemplate,
  ui: {
    vehicleTypeSelect: 'select[name="vehicle_type"]'
  },
  onShow: function() {
    this.model = this.category.get('currentVehicle');
    var vehicleType = (this.model) ? this.model.get('vehicleType') : undefined;
    if(typeof(vehicleType) == 'undefined' || vehicleType == null || vehicleType == '') {
      var Vehicle = require('../models/vehicle-related-models').vehicle
      this.category.set({currentVehicle: new Vehicle()});
      this.model = this.category.get('currentVehicle');
    } else {
      this.modelBinder = new Databinding.ModelBinder(this, this.model);
      this.modelBinder.watch('value: vehicleType', {selector: '[name="vehicle_type"]'});
    }
  },
  getNextInputView: function() {
    var oldVehicleType = this.model.get('vehicleType')
    , newVehicleType = this.ui.vehicleTypeSelect.val();
    if(oldVehicleType !== newVehicleType) {
      this.model.set({vehicleType: newVehicleType});
    }
    App.vent.trigger('showInputView', newVehicleType);
    return;
  }
});