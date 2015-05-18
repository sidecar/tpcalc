'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var listTemplate = require('../../templates/individual/ind-travel-list-template.hbs');

var itemView = require('./flight-list-item-view');

var utils = require('../../utils/utility');

module.exports = Marionette.CompositeView.extend({
  template: listTemplate,
  itemView: itemView,
  itemViewContainer: 'ul.flight-list',
  events: {
    'click #add-flight': 'addFlightClicked',
    'click .delete': 'deleteClicked'
  },
  calculateTotal : function () {
    var totalDistance = this.collection.getTotalDistance();
    var flightEmissionsCalculator = require('../../utils/ind-air-emissions');
    flightEmissionsCalculator.setCalculateBy('itinerary');
    flightEmissionsCalculator.itinerary.annMiles = totalDistance;
    flightEmissionsCalculator.useRFI = this.category.get('useRFI');
    var totalEmissions = flightEmissionsCalculator.totalEmissions('itinerary');
    this.category.set({totalEmissions: totalEmissions});
  },
  onShow: function() {
    var currentFlight = this.category.get('currentFlight');
    this.collection.add(currentFlight);
    this.calculateTotal();
    // in order to get the newly added vehicle rendered call...
    this.render();
  },
  deleteClicked: function(event) {
    this.collection.remove( this.collection.get($(event.target).data('cid')) );
    this.calculateTotal();
    this.render();
  },
  addFlightClicked: function(event) {
    event.preventDefault();
    var Flight = require('../../models/air-travel-models').flight;
    this.category.set({currentFlight: new Flight()});
    this.category.setCurrentInputView('default');
    App.vent.trigger('showInputView', 'flights');
  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});
