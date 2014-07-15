"use strict";
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var defaultTemplate = require('../templates/ind-travel-default-template.hbs')
, addTemplate = require('../templates/ind-travel-add-template.hbs')
, averageTemplate = require('../templates/ind-travel-average-template.hbs')
, lengthTemplate = require('../templates/ind-travel-length-template.hbs')
, milesTemplate = require('../templates/ind-travel-miles-template.hbs')
, fuelTemplate = require('../templates/ind-travel-fuel-template.hbs')
, listTemplate = require('../templates/ind-travel-list-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'add';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'add');
	}
});

module.exports.add = Marionette.ItemView.extend({
	template: addTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.average = Marionette.ItemView.extend({
	template: averageTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.length = Marionette.ItemView.extend({
	template: lengthTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.miles = Marionette.ItemView.extend({
	template: milesTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.fuel = Marionette.ItemView.extend({
	template: fuelTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	},
	getNextView: function() {
		App.vent.trigger('goToNextCategory');
	}
});

module.exports.list = Marionette.ItemView.extend({
	template: listTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	},
	getNextView: function() {
		App.vent.trigger('goToNextCategory');
	}
});
