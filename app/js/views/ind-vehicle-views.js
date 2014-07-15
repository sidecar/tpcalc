var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var defaultTemplate = require('../templates/ind-vehicle-default-template.hbs')
, carTemplate = require('../templates/ind-vehicle-car-template.hbs')
, ecarTemplate = require('../templates/ind-vehicle-ecar-template.hbs')
, boatTemplate = require('../templates/ind-vehicle-boat-template.hbs')
, motorcycleTemplate = require('../templates/ind-vehicle-motorcycle-template.hbs')
, classTemplate = require('../templates/ind-vehicle-class-template.hbs')
, optionsTemplate = require('../templates/ind-vehicle-options-template.hbs')
, typeTemplate = require('../templates/ind-vehicle-type-template.hbs')
, listTemplate = require('../templates/ind-vehicle-list-template.hbs')
, utils = require('../utils/utility');

var SelectView = require('./select-view');

module.exports.default = Marionette.ItemView.extend({	
	template: defaultTemplate,
	ui: {
		vehicleTypeSelect: 'select[name="vehicle_type"]'
	},
	initialize: function() {
		this.modelBinder = new Databinding.ModelBinder(this, this.model);
		this.modelBinder.watch('value: vehicleType', {selector: '[name="vehicle_type"]'});
	},
	getNextView: function() {
		App.vent.trigger('goToView', this.ui.vehicleTypeSelect.val());
		return;
	}
});

module.exports.car = Marionette.Layout.extend({
	template: carTemplate,
	regions: {
    yearRegion: "[data-region=year]",
    makeRegion: "[data-region=make]",
    modelRegion: "[data-region=model]"
  },
	ui: {
		yearSelect: 'select[name="car_year"]',
		makeSelect: 'select[name="car_make"]', 
		modelSelect: 'select[name="car_models"]' 
	},
	events: {
		'change select[name="car_year"]': 'yearSelected',
		'change select[name="car_make"]': 'makeSelected',
	},
	initialize: function() {
		this.data = {};
		this.modelBinder = new Databinding.ModelBinder(this, this.model);
		this.modelBinder.watch('value: year', {selector: '[name="car_year"]'});
		this.modelBinder.watch('value: make', {selector: '[name="car_make"]'});
		this.modelBinder.watch('value: model', {selector: '[name="car_model"]'});
		this.modelBinder.watch('value: mileage', {selector: '[name="car_mileage"]'});
	},
	onShow: function() {
		this.loadYearSelect();
	},
	loadYearSelect: function() {
		var self = this;
		utils.getJSON('/vehicle/year', function(jsonResponse) {
			var data = {}
			data.years = jsonResponse.menuItems;
			data.selectName = 'car_year';
			data.displayName = 'Year';
			data.instruction = 'Choose the vehicle\'s year';
			self.yearRegion.show( new SelectView({json: data}) );
		});	
	},
	loadMakeSelect: function(year) {
		var self = this;
		utils.getJSON('/vehicle/make/'+year, function(jsonResponse) {
			var data = {}
			data.years = jsonResponse.menuItems;
			data.selectName = 'car_make';
			data.displayName = 'Make';
			data.instruction = 'Choose the vehicle\'s make';
			self.makeRegion.show( new SelectView({json: data}) );
		});
	},
	loadModelSelect: function(year, make) {
		console.log('loadModelSelect');
		console.log('make');
		console.log(make);
		var self = this;
		utils.getJSON('/vehicle/model/'+year+'/'+make, function(jsonResponse) {
			var data = {}
			data.years = jsonResponse.menuItems;
			data.selectName = 'car_model';
			data.displayName = 'Model';
			data.instruction = 'Choose the vehicle\'s model';
			self.modelRegion.show( new SelectView({json: data}) );
		});
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
		// if(!this.ui.modelSelect.val()) {
		// 	App.vent.trigger('errorAlert', 'Please, choose your car\'s model');
		// 	return;
		// } else {
		// 	App.vent.trigger('goToView', 'list');
		// 	return;
		// }
	},
	yearSelected: function(event) {
		var year = $(event.target).val();
		this.model.set({year: year});
		this.loadMakeSelect(year);
	},
	makeSelected: function(event) {
		var year = this.model.get('year');
		var make = $(event.target).val();
		this.loadModelSelect(year, make);
	} 
});

module.exports.ecar = Marionette.ItemView.extend({
	template: ecarTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.boat = Marionette.ItemView.extend({
	template: boatTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.motorcycle = Marionette.ItemView.extend({
	template: motorcycleTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.class = Marionette.ItemView.extend({
	template: classTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.options = Marionette.ItemView.extend({
	template: optionsTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.type = Marionette.ItemView.extend({
	template: typeTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return 'list';
	},
	getNextView: function() {
		App.vent.trigger('goToView', 'list');
	}
});

module.exports.list = Marionette.ItemView.extend({
	template: listTemplate,
	events: {

	},
	getNextViewSlug: function() {
		return '';
	},
	getNextView: function() {
		App.vent.trigger('goToNextCategory');
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