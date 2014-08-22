'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var defaultTemplate = require('../../templates/events/evt-meals-default-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});

