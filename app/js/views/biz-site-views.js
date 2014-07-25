'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var defaultTemplate = require('../templates/biz-site-default-template.hbs')
, energyTemplate = require('../templates/biz-site-energy-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'energy');
	}
});

module.exports.energy = Marionette.ItemView.extend({
	template: energyTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('goToNextCategory');
	}
});

