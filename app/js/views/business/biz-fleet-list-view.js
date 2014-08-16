'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app')
, numeral = require('numeral');

var listTemplate = require('../../templates/business/biz-fleet-list-template.hbs');

var itemView = require('./fleet-list-item-view');

var utils = require('../../utils/utility');

module.exports = Marionette.CompositeView.extend({
  template: listTemplate,
  itemView: itemView,
  itemViewContainer: 'ul.vehicle-list',
  ui: {
    'vehicleTypeSelect': 'select[name=vehicle_type]'
  },
  events: {
    'click #add-vehicle': 'addVehicleClicked',
    'click .delete': 'deleteClicked'
  },
  onShow: function() {
    var currentVehicle = this.category.get('currentFleetVehicle');

    if(currentVehicle.get('vehicleType') !== 'boat' && currentVehicle.get('numVehicles') < 1) {
      $('.view-question').html('No vehicles were added to this fleet.');
      return;
    }

    if(currentVehicle.get('vehicleType') === 'boat' && currentVehicle.get('fuelQty') <= 0) {
      $('.view-question').html('No fuel was used by boats in this fleet.');
      return;
    }

    var vehicleType = currentVehicle.get('vehicleType');
    switch(vehicleType) {
      case 'car': currentVehicle.set({isCar: true})
        break;
      case 'truck': currentVehicle.set({isTruck: true})
        break;
      case 'deliveryTruck': currentVehicle.set({isDeliveryTruck: true})
        break;
      case 'semi': currentVehicle.set({isSemi: true})
        break;
      case 'ecar': currentVehicle.set({isEcar: true})
        break;
      case 'boat': currentVehicle.set({isBoat: true})
        break;
      case 'plane': currentVehicle.set({isPlane: true})
        break;
    }
    var displayPlural = (currentVehicle.get('numVehicles') >= 2) ? true : false ;
    currentVehicle.set({displayPlural: displayPlural});

    this.collection.add(currentVehicle);
    var totalEmissions = this.collection.getTotalEmissions();
    this.category.set({totalEmissions: totalEmissions});
    // in order to get the newly added vehicle rendered call...
    this.render();
    console.log('this.collection');
    console.log(this.collection);
  },
  deleteClicked: function(event) {
    this.collection.remove( this.collection.get($(event.target).data('cid')) );
    this.render();
  },
  addVehicleClicked: function(event) {
    event.preventDefault();
    var whichView = this.ui.vehicleTypeSelect.val();
    var Vehicle = require('../../models/fleet-models').fleetVehicle;
    this.category.set({currentFleetVehicle: new Vehicle({vehicleType: whichView})});
    this.category.setCurrentInputView('default');
    var vehicleTypes = {
      'car': 'car',
      'truck': 'car',
      'deliveryTruck': 'car',
      'semi': 'car',
      'ecar': 'ecar',
      'plane': 'plane',
      'boat': 'boat'
    }
    App.vent.trigger('showInputView', vehicleTypes[whichView]);
  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});