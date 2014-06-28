var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette');

var defaultTemplate = require('../templates/biz-site-default-template.hbs')
, energyTemplate = require('../templates/biz-site-energy-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'energy';
	}
});

module.exports.energy = Marionette.ItemView.extend({
	template: energyTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	}
});

