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
		//this.modelBinder = new Databinding.ModelBinder(this, this.model);
		//this.modelBinder.watch('value: vehicleType', {selector: '[name="vehicle_type"]'});
	},
	getNextInputView: function() {
		var Vehicle = require('../models/vehicle-related-models').vehicle
		this.category.set({currentVehicle: new Vehicle({vehicleType: this.ui.vehicleTypeSelect.val()})});
		App.vent.trigger('showInputView', this.ui.vehicleTypeSelect.val());
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
		modelSelect: 'select[name="car_model"]', 
		mileageSelect: 'select[name="car_mileage"]' 
	},
	events: {
		'change select[name="car_year"]': 'yearSelected',
		'change select[name="car_make"]': 'makeSelected',
	},
	initialize: function() {
		//this.data = {};
		// this.modelBinder = new Databinding.ModelBinder(this, this.model);
		// this.modelBinder.watch('value: year', {selector: '[name="car_year"]'});
		// this.modelBinder.watch('value: make', {selector: '[name="car_make"]'});
		// this.modelBinder.watch('value: model', {selector: '[name="car_model"]'});
		// this.modelBinder.watch('value: mileage', {selector: '[name="car_mileage"]'});
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
			self.bindUIElements(); //re-implement the ui hash
		});	
	},
	loadMakeSelect: function(year) {
		var self = this;
		if(self.ui.yearSelect.val() === '')	{
			self.makeRegion.$el.hide();
			return;
		}
		utils.getJSON('/vehicle/make/'+year, function(jsonResponse) {
			var data = {}
			data.years = jsonResponse.menuItems;
			data.selectName = 'car_make';
			data.displayName = 'Make';
			data.instruction = 'Choose the vehicle\'s make';
			self.makeRegion.show( new SelectView({json: data}) );
			self.makeRegion.$el.show();
			self.bindUIElements(); //re-implement the ui hash
		});
	},
	loadModelSelect: function(year, make) {
		var self = this;
		if(self.ui.makeSelect.val() === '')	{
			self.modelRegion.$el.hide();
			return;
		}
		utils.getJSON('/vehicle/model/'+year+'/'+make, function(jsonResponse) {
			var data = {}
			data.years = jsonResponse.menuItems;
			data.selectName = 'car_model';
			data.displayName = 'Model';
			data.instruction = 'Choose the vehicle\'s model';
			self.modelRegion.show( new SelectView({json: data}) );
			self.modelRegion.$el.show();
			self.bindUIElements(); //re-implement the ui hash
		});
	},
	getNextInputView: function() {
		if(!this.ui.yearSelect.val()) {
			App.vent.trigger('errorAlert', 'Please, select your car\'s year');
			return;
		} 
		if(!this.ui.makeSelect.val()) {
			App.vent.trigger('errorAlert', 'Please, select your car\'s make');
			return;
		}
		if(!this.ui.modelSelect.val()) {
			App.vent.trigger('errorAlert', 'Please, select your car\'s model');
			return;
		}
		var vehicle = this.category.get('currentVehicle');
		vehicle.set({
			year: this.ui.yearSelect.val(), 
			make: this.ui.makeSelect.val(), 
			model: this.ui.modelSelect.val(), 
			mileage: this.ui.mileageSelect.val()
		});
		App.vent.trigger('showInputView', 'list');
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

module.exports.options = Marionette.ItemView.extend({
	template: optionsTemplate,
	regions: {
    transmissionRegion: "[data-region=transmission]",
    fuelTypeRegion: "[data-region=fuelType]",
  },
	ui: {
		transmissionSelect: 'select[name="car_transmission"]',
		fuelTypeSelect: 'select[name="car_fuelType"]', 
	},
	events: {
		'change select[name="car_transmission"]': 'transmissionSelected',
	},
	onShow: function() {
		this.loadTransmissionSelect();
	},
	loadTransmissionSelect: function() {
		var self = this;
		var vehicle = this.category.get('currentVehicle');
		var year = vehicle.get('year');
		var make = vehicle.get('make');
		var model = vehicle.get('model');
		utils.getJSON('/vehicle/options/'+year+'/'+make+'/'+model, function(jsonResponse) {
			var data = {}
			data.years = jsonResponse.menuItems;
			data.selectName = 'car_transmission';
			data.displayName = 'Transmission';
			data.instruction = 'Choose the vehicle\'s transmission';
			self.transmissionRegion.show( new SelectView({json: data}) );
			self.bindUIElements(); //re-implement the ui hash
		});	
	},
	transmissionSelected: function() {
		alert('trans selected');
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

module.exports.list = Marionette.ItemView.extend({
	template: listTemplate,
	events: {
	},
	getNextInputView: function() {
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