'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var flightAverageTemplate = require('../../templates/events/evt-travel-flight-average-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: flightAverageTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'hotel');
  }
});
