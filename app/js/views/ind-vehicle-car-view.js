'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
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
    modelRegion: "[data-region=model]",
    mileageRegion: "[data-region=mileage]"
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
    $('.mileage-select-container').hide();
    var self = this;
    this.vehicle = this.category.get('currentVehicle');

    this.vehicle.validate = function(attrs, options) {

      if(!attrs.year || attrs.year == '') {
        self.displayError(self.ui.yearSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.yearSelect);
      }
      
      if(!attrs.make || attrs.make == '') {
        self.displayError(self.ui.makeSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.makeSelect);
      }
      
      if(!attrs.model || attrs.model == '') {
        self.displayError(self.ui.modelSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.modelSelect);
      }
      
      if(!attrs.mileage || attrs.mileage == '') {
        self.displayError(self.ui.mileageSelect);
        return false;
      } else {
        self.displaySuccess(self.ui.mileageSelect);
      }

      return true;
    }

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
    if(year !== this.vehicle.get('year')){
      this.vehicle.set({year: year});
      if(this.modelRegion.$el) this.modelRegion.$el.hide();
      this.loadMakeSelect(year);
    }
  },
  makeSelected: function(event) {
    var year = this.vehicle.get('year');
    var make = $(event.target).val();
    if(make == 'unknown') {
      if(this.modelRegion.$el) this.modelRegion.$el.hide();
      $('.mileage-select-container').hide();
    } else if (make !== this.vehicle.get('make')){
      this.loadModelSelect(year, make);
    }
    this.vehicle.set({make: make});
  },
  modelSelected: function(event) {
    var model = $(event.target).val();
    if(model == 'unknown') {
      $('.mileage-select-container').hide();
    } else if (model !== this.vehicle.get('model')){
      $('.mileage-select-container').show();
    }
    this.vehicle.set({model: model});
  },
  loadYearSelect: function() {
    var self = this;
    utils.getJSON('/vehicle/year', function(jsonResponse) {
      if(!jsonResponse.menuItems) return;
      var data = {};
      data.items = jsonResponse.menuItems.menuItem;
      data.selectName = 'car_year';
      data.defaultLabel = 'Year';
      data.defaultLabel = 'Choose the year of your vehicle';
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
      data.defaultLabel = 'Make';
      data.defaultLabel = 'Choose the make of your vehicle';
      data.selectedOptionText = 'Choose the vehicle\'s make';
      data.selectedOptionVal = '';
      self.makeRegion.show( new SelectView({json: data}) );
      self.makeRegion.$el.show();
      $('select[name="car_make"]').prepend('<option value="unknown">Can\'t find your vehicle\'s make?<option>');
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
      data.defaultLabel = 'Model';
      data.defaultLabel = 'Choose the model of your vehicle';
      data.selectedOptionText = 'Choose the vehicle\'s model';
      data.selectedOptionVal = '';
      self.modelRegion.show( new SelectView({json: data}) );
      self.modelRegion.$el.show();
      $('select[name="car_model"]').prepend('<option value="unknown">Can\'t find your vehicle\'s model?<option>');
      self.bindUIElements(); //re-implement the ui hash
    });
  },
  getNextInputView: function() {
    var year = this.vehicle.get('year')
    , make = this.vehicle.get('make')
    , modelOfCar = this.vehicle.get('model')
    , mileage = this.vehicle.get('mileage');

    if(make === 'unknown') {
      App.vent.trigger('showInputView', 'class');
      return;
    }

    var attrs = {
      year: this.ui.yearSelect.val(),
      make: this.ui.makeSelect.val(),
      model: this.ui.modelSelect.val(),
      mileage: this.ui.mileageSelect.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);
      App.vent.trigger('showInputView', 'options');
    }
  }
});