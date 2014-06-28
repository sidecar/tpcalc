var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('../app');

var defaultTemplate = require('../templates/ind-vehicle-default-template.hbs')
, carTemplate = require('../templates/ind-vehicle-car-template.hbs')
, ecarTemplate = require('../templates/ind-vehicle-ecar-template.hbs')
, boatTemplate = require('../templates/ind-vehicle-boat-template.hbs')
, motorcycleTemplate = require('../templates/ind-vehicle-motorcycle-template.hbs')
, classTemplate = require('../templates/ind-vehicle-class-template.hbs')
, optionsTemplate = require('../templates/ind-vehicle-options-template.hbs')
, listTemplate = require('../templates/ind-vehicle-list-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
	getNextViewSlug: function() {
		return 'car';
	}
});

module.exports.car = Marionette.ItemView.extend({
	template: carTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.ecar = Marionette.ItemView.extend({
	template: ecarTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.boat = Marionette.ItemView.extend({
	template: boatTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.motorcycle = Marionette.ItemView.extend({
	template: motorcycleTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.class = Marionette.ItemView.extend({
	template: classTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.options = Marionette.ItemView.extend({
	template: optionsTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	}
});

module.exports.list = Marionette.ItemView.extend({
	template: listTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	}
});

// var $ = require('jquery'),
// 	Backbone = require('backbone'),
//   utils = require('../utility');

// module.exports = Backbone.View.extend({
// 	el: '#individual',
// 	events: {

// 	},
// 	initialize: function() {
// 		this.render();	
// 	},
// 	render: function() {
// 		var self = this;
// 		utils.getJSON('/vehicle/year', function(jsonResponse) {
// 			var template = require("../templates/years-template.hbs");
// 			self.$el.html(template(jsonResponse));
// 		});	
// 	}
// });
