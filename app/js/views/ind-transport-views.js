var $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  template = require('../templates/ind-transport-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: template,
	events: {
		'click input[type=submit]': 'submitClicked'
	},
	submitClicked: function() {
		console.log('submitClicked()');
	}
});

module.exports = Marionette.ItemView.extend({
	template: template,
	events: {

	}
});
