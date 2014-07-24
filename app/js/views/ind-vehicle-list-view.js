var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app')
, emissions = require('../utils/ind-vehicle-emissions');

var listTemplate = require('../templates/ind-vehicle-list-template.hbs');

var itemView = require('./vehicle-list-item-view');

var utils = require('../utils/utility');

module.exports = Marionette.CompositeView.extend({
  template: listTemplate,
  itemView: itemView,
  itemViewContainer: 'ul.vehicle-list',
  ui: {
    'vehicleSelect': 'select[name=ind_vehicle_type]'
  },
  events: {
    'click #add-vehicle': 'addVehicleClicked'
  },
  onShow: function() {
    var currentVehicle = this.category.get('currentVehicle');
    var vehicles = this.category.get('vehicles');
    vehicles.add(currentVehicle);
    this.render();
  },
  addVehicleClicked: function(event) {
    event.preventDefault();
    var whichView = this.ui.vehicleSelect.val();
    var Vehicle = require('../models/vehicle-related-models').vehicle
    this.category.set({currentVehicle: new Vehicle({vehicleType: whichView})});
    App.vent.trigger('showInputView', whichView);
  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});