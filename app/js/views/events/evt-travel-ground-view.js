'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var groundTemplate = require('../../templates/events/evt-travel-ground-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: groundTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});
