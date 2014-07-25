'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
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
    'click #add-vehicle': 'addVehicleClicked',
    'click .delete': 'deleteClicked'
  },
  onShow: function() {
    var currentVehicle = this.category.get('currentVehicle');
    this.collection.add(currentVehicle);
    // in order to get the newly added vehicle rendered call...
    this.render();
  },
  deleteClicked: function(event) {
    this.collection.remove( this.collection.get($(event.target).data('cid')) );
    this.render();
  },
  addVehicleClicked: function(event) {
    event.preventDefault();
    var whichView = this.ui.vehicleSelect.val();
    var Vehicle = require('../models/vehicle-related-models').vehicle
    this.category.set({currentVehicle: new Vehicle({vehicleType: whichView})});
    this.category.setCurrentInputView('default');
    App.vent.trigger('showInputView', whichView);
  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});