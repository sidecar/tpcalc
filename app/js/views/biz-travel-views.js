var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette');

var defaultTemplate = require('../templates/biz-travel-default-template.hbs')
, employeeTemplate = require('../templates/biz-travel-employee-template.hbs')
, milesTemplate = require('../templates/biz-travel-miles-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'employee';
	}
});

module.exports.employee = Marionette.ItemView.extend({
	template: employeeTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'miles';
	}
});

module.exports.miles = Marionette.ItemView.extend({
	template: milesTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	}
});

