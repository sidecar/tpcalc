var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var ecarTemplate = require('../templates/ind-vehicle-ecar-template.hbs')
, boatTemplate = require('../templates/ind-vehicle-boat-template.hbs')
, motorcycleTemplate = require('../templates/ind-vehicle-motorcycle-template.hbs')
, classTemplate = require('../templates/ind-vehicle-class-template.hbs')
, typeTemplate = require('../templates/ind-vehicle-type-template.hbs');

var utils = require('../utils/utility');

var SelectView = require('./select-view');

module.exports.ecar = Marionette.ItemView.extend({
	template: ecarTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.boat = Marionette.ItemView.extend({
	template: boatTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.motorcycle = Marionette.ItemView.extend({
	template: motorcycleTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.class = Marionette.ItemView.extend({
	template: classTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
	}
});

module.exports.type = Marionette.ItemView.extend({
	template: typeTemplate,
	events: {
	},
	getNextInputView: function() {
		App.vent.trigger('showInputView', 'list');
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


  // render: function(){
  //     // Invoke original render function
  //     var args = Array.prototype.slice.apply(arguments);
  //     var result = Marionette.ItemView.prototype.render.apply(this, args);
  //     // Apply stickit
  //     //this.stickit();
  //     // Return render result
  //     return result;
  // },