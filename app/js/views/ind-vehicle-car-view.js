var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var carTemplate = require('../templates/ind-vehicle-car-template.hbs');

var utils = require('../utils/utility');

var SelectView = require('./select-view');

module.exports = Marionette.Layout.extend({
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
    'change select[name="car_model"]': 'modelSelected'
  },
  onShow: function() {
    this.vehicle = this.category.get('currentVehicle');
    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);
    
    var year = this.vehicle.get('year') || undefined
    , make = this.vehicle.get('make') || undefined
    , modelOfCar = this.vehicle.get('model') || undefined;
    
    if(modelOfCar) {
      this.loadYearSelect();
      this.modelBinder.watch('value: year', {selector: '[name="car_year"]'});
      this.loadMakeSelect(year);
      this.modelBinder.watch('value: make', {selector: '[name="car_make"]'});
      this.loadModelSelect(year, make);
      this.modelBinder.watch('value: model', {selector: '[name="car_model"]'});
    } else {
      this.loadYearSelect();
    }

    this.modelBinder.watch('value: mileage', {selector: '[name="car_mileage"]'});
  },
  yearSelected: function(event) {
    var year = $(event.target).val();
    this.vehicle.set({year: year});
    this.loadMakeSelect(year);
  },
  makeSelected: function(event) {
    var year = this.vehicle.get('year');
    var make = $(event.target).val();
    this.vehicle.set({make: make});
    this.loadModelSelect(year, make);
  },
  modelSelected: function(event) {
    var model = $(event.target).val();
    this.vehicle.set({model: model});
  },
  loadYearSelect: function() {
    var self = this;
    utils.getJSON('/vehicle/year', function(jsonResponse) {
      if(!jsonResponse.menuItems) return;
      var data = {};
      data.items = jsonResponse.menuItems.menuItem;
      data.selectName = 'car_year';
      data.displayName = 'Year';
      data.selectedOptionText = 'Choose the vehicle\'s year';
      data.selectedOptionVal = '';
      self.yearRegion.show( new SelectView({json: data}) );
      self.bindUIElements(); //re-implement the ui hash
    }); 
  },
  loadMakeSelect: function(year) {
    var self = this;
    if(self.ui.yearSelect.val() === '') {
      self.makeRegion.$el.hide();
      return;
    }
    utils.getJSON('/vehicle/make/'+year, function(jsonResponse) {
      if(!jsonResponse.menuItems) return;
      var data = {};
      data.items = jsonResponse.menuItems.menuItem;
      data.selectName = 'car_make';
      data.displayName = 'Make';
      data.selectedOptionText = 'Choose the vehicle\'s make';
      data.selectedOptionVal = '';
      self.makeRegion.show( new SelectView({json: data}) );
      self.makeRegion.$el.show();
      self.bindUIElements(); //re-implement the ui hash
    });
  },
  loadModelSelect: function(year, make) {
    var self = this;
    if(self.ui.makeSelect.val() === '') {
      self.modelRegion.$el.hide();
      return;
    }
    utils.getJSON('/vehicle/model/'+year+'/'+make, function(jsonResponse) {
      if(!jsonResponse.menuItems) return;
      var data = {};
      data.items = jsonResponse.menuItems.menuItem;
      data.selectName = 'car_model';
      data.displayName = 'Model';
      data.selectedOptionText = 'Choose the vehicle\'s model';
      data.selectedOptionVal = '';
      self.modelRegion.show( new SelectView({json: data}) );
      self.modelRegion.$el.show();
      self.bindUIElements(); //re-implement the ui hash
    });
  },
  getNextInputView: function() {
    var year = this.vehicle.get('year')
    , make = this.vehicle.get('make')
    , modelOfCar = this.vehicle.get('model')
    , mileage = this.vehicle.get('mileage');

    if(typeof(year) == 'undefined' || year == null || year == '') {
      App.vent.trigger('errorAlert', 'Please, select your car\'s year');
      return;
    } 
    if(typeof(make) == 'undefined' || make == null || make == '') {
      App.vent.trigger('errorAlert', 'Please, select your car\'s make');
      return;
    }
    if(typeof(modelOfCar) == 'undefined' || modelOfCar == null || modelOfCar == '') {
      App.vent.trigger('errorAlert', 'Please, select your car\'s model');
      return;
    }
    if(typeof(mileage) == 'undefined' || mileage == null || mileage == '') {
      console.log(App);
      App.vent.trigger('errorAlert', 'Please, select your car\'s mileage');
      return;
    }

    utils.getJSON('/vehicle/options/'+year+'/'+make+'/'+modelOfCar, function(jsonResponse) {
      if(!jsonResponse.menuItems) return;
      var data = {};
      data.items = jsonResponse.menuItems.menuItem;
      var hasManual = _.some(data.items, function(item) {
        var matched = item.text[0].match(/^Man\b/g);
        return (matched) ? true : false;
      });
      var hasDiesel = _.some(data.items, function(item) {
        var matched = item.text[0].match(/\bDiesel\b/g);
        return (matched) ? true : false;
      });
      if(!hasManual && !hasDiesel) {
        App.vent.trigger('showInputView', 'list');
      } else {
        App.vent.trigger('showInputView', 'options');
      }
    }); 

  }
});