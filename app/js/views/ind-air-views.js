var $ = require('jquery'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  defaultTemplate = require('../templates/ind-air-default-template.hbs'),
  addTemplate = require('../templates/ind-air-add-template.hbs'),
  averageTemplate = require('../templates/ind-air-average-template.hbs'),
  listTemplate = require('../templates/ind-air-list-template.hbs');

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

module.exports.average = Marionette.ItemView.extend({
	template: averageTemplate,
	events: {

	}
});

module.exports.list = Marionette.ItemView.extend({
	template: listTemplate,
	events: {

	}
});