'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var defaultTemplate = require('../templates/ind-home-default-template.hbs')
, addTemplate = require('../templates/ind-home-add-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'add');
	}
});

module.exports.add = Marionette.ItemView.extend({
	template: addTemplate,
	events: {

	},
	getNextInputView: function() {
		App.vent.trigger('goToNextCategory');
	}
});
