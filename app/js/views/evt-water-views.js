var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette');

var defaultTemplate = require('../templates/evt-water-default-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return '';
	}
});

