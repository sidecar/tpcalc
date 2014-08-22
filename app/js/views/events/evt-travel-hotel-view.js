'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var hotelTemplate = require('../../templates/events/evt-travel-hotel-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: hotelTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});

