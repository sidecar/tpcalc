'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var flightLengthTemplate = require('../../templates/events/evt-travel-flight-length-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: flightLengthTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'hotel');
  }
});
