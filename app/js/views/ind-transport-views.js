var $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  defaultTemplate = require('../templates/ind-transport-default-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return '';
	}
});
