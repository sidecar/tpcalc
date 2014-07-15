"use strict";
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var defaultTemplate = require('../templates/ind-home-default-template.hbs')
, addTemplate = require('../templates/ind-home-add-template.hbs');

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
		return '';
	},
	getNextView: function() {
		App.vent.trigger('goToNextCategory');
	}
});
