'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');


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
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'car');
	}
});

module.exports.car = Marionette.ItemView.extend({
	template: carTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.ecar = Marionette.ItemView.extend({
	template: ecarTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.boat = Marionette.ItemView.extend({
	template: boatTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.plane = Marionette.ItemView.extend({
	template: planeTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.list = Marionette.ItemView.extend({
	template: listTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('goToNextCategory');
	}
});

