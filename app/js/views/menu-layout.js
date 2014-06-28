var Marionette = require('backbone.marionette')
, App = require('../app')
, template = require('../templates/menu-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template//,
	// events: {
	// 	'click .category-icon': 'categoryClicked'
	// },
	// categoryClicked: function(event) {
	// 	event.preventDefault();
	// 	App.vent.trigger('category', event);
	// }
});
