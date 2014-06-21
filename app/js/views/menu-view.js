var Marionette = require('backbone.marionette'),
	App = require('../app'),
	template = require('../templates/main-menu-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
	events: {
		'click .category-icon': 'categoryClicked'
	},
	categoryClicked: function(event) {
		event.preventDefault();
		App.vent.trigger('category', event);
	}
});
