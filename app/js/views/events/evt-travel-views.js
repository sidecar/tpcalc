'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var defaultTemplate = require('../../templates/events/evt-travel-default-template.hbs')
, flightAverageTemplate = require('../../templates/events/evt-travel-flight-average-template.hbs')
, flightLengthTemplate = require('../../templates/events/evt-travel-flight-length-template.hbs')
, groundTemplate = require('../../templates/events/evt-travel-ground-template.hbs')
, hotelTemplate = require('../../templates/events/evt-travel-hotel-template.hbs');

module.exports.default = Marionette.ItemView.extend({
  template: defaultTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'flightLength');
  }
});

module.exports.flightAverage = Marionette.ItemView.extend({
  template: flightAverageTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'hotel');
  }
});

module.exports.flightLength = Marionette.ItemView.extend({
  template: flightLengthTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'hotel');
  }
});

module.exports.ground = Marionette.ItemView.extend({
  template: groundTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});

module.exports.hotel = Marionette.ItemView.extend({
	template: hotelTemplate,
	events: {
	},
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});

