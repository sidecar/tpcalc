var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette');

var defaultTemplate = require('../templates/evt-venue-default-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});

