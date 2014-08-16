'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var defaultTemplate = require('../../templates/business/biz-fleet-default-template.hbs');

module.exports = Marionette.ItemView.extend({ 
  template: defaultTemplate,
  ui: {
    vehicleTypeSelect: 'select[name="vehicle_type"]'
  },
  onShow: function() {
    this.vehicle = this.category.get('currentFleetVehicle');
    var vehicleType = (this.vehicle) ? this.vehicle.get('vehicleType') : undefined;
    if(typeof(vehicleType) == 'undefined' || vehicleType == null || vehicleType == '') {
      var FleetVehicle = require('../../models/fleet-models').fleetVehicle
      this.category.set({currentFleetVehicle: new FleetVehicle()});
      this.vehicle = this.category.get('currentFleetVehicle');
    } else {
      this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);
      this.modelBinder.watch('value: vehicleType', {selector: '[name="vehicle_type"]'});
    }
  },
  getNextInputView: function() {
    var oldVehicleType = this.vehicle.get('vehicleType')
    , newVehicleType = this.ui.vehicleTypeSelect.val();
    if(oldVehicleType !== newVehicleType) {
      this.vehicle.set({vehicleType: newVehicleType});
    }
    var viewSlugs = {
      'car': 'car',
      'truck': 'car',
      'deliveryTruck': 'car',
      'semi': 'car',
      'ecar': 'ecar',
      'boat': 'boat'
      // 'plane': 'plane',
    }
    App.vent.trigger('showInputView', viewSlugs[newVehicleType]);
    return;
  }
});