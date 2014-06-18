var Marionette = require('backbone.marionette'),
	template = require('../templates/header-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template//,
	// serializeData: function(){
 //      return this.model.data
 //    } 
});
