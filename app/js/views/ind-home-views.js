var $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  defaultTemplate = require('../templates/ind-home-default-template.hbs'),
  addTemplate = require('../templates/ind-home-add-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
		'click input[type=submit]': 'submitClicked'
	},
	submitClicked: function() {
		console.log('submitClicked()');
	}
});

module.exports.add = Marionette.ItemView.extend({
	template: addTemplate,
	events: {

	}
});
