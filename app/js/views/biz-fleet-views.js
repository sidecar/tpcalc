var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette');

var defaultTemplate = require('../templates/biz-fleet-default-template.hbs')
, carTemplate = require('../templates/biz-fleet-car-template.hbs')
, ecarTemplate = require('../templates/biz-fleet-ecar-template.hbs')
, boatTemplate = require('../templates/biz-fleet-boat-template.hbs')
, planeTemplate = require('../templates/biz-fleet-plane-template.hbs')
, listTemplate = require('../templates/biz-fleet-list-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'car';
	}
});

module.exports.car = Marionette.ItemView.extend({
	template: carTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.ecar = Marionette.ItemView.extend({
	template: ecarTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.boat = Marionette.ItemView.extend({
	template: boatTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.plane = Marionette.ItemView.extend({
	template: planeTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'list';
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

