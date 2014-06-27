var $ = require('jquery'),
	Backbone = require('backbone'),
  utils = require('../utility');

module.exports = Backbone.View.extend({
	el: '#individual',
	events: {

	},
	initialize: function() {
		this.render();	
	},
	render: function() {
		var self = this;
		utils.getJSON('/vehicle/year', function(jsonResponse) {
			var template = require("../templates/years-template.hbs");
			self.$el.html(template(jsonResponse));
		});	
	}
});