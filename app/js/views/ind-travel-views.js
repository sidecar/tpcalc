var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette');

var defaultTemplate = require('../templates/ind-travel-default-template.hbs')
, addTemplate = require('../templates/ind-travel-add-template.hbs')
, averageTemplate = require('../templates/ind-travel-average-template.hbs')
, listTemplate = require('../templates/ind-travel-list-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'add';
	}
});

module.exports.add = Marionette.ItemView.extend({
	template: addTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.average = Marionette.ItemView.extend({
	template: averageTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	}
});

module.exports.list = Marionette.ItemView.extend({
	template: listTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	}
});
