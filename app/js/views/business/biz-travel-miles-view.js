'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var milesTemplate = require('../../templates/business/biz-travel-miles-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: milesTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('goToNextCategory');
	}
});

