'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var employeeTemplate = require('../../templates/business/biz-travel-employee-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: employeeTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'miles');
	}
});
