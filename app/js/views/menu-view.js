var Marionette = require('backbone.marionette'),
	template = require('../templates/main-menu-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template
});
