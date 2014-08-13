'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var ecarTemplate = require('../../templates/business/biz-fleet-ecar-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: ecarTemplate,
  ui: {
    numVehiclesInput: 'input[name="num_vehicles"]', 
    zipInput: 'input[name="zip"]'
  },
  events: {
    'blur input[name="num_vehicles"]': 'validate',
    'blur input[name="zip"]': 'validate'
  },
  numVehiclesInputChanged: function() {
    this.displaySuccess(this.ui.numVehiclesInput);
  },
  zipInputChanged: function() {
    this.displaySuccess(this.ui.numVehiclesInput);
  },
  onShow: function() {
    var self = this;
    this.vehicle = this.category.get('currentFleetVehicle');

    this.vehicle.validate = function(attrs, options) {

      if(!attrs.numVehicles || attrs.numVehicles == '' || attrs.numVehicles.match(/^(0|[1-9][0-9]*)$/) == null) {       
        self.displayError(self.ui.numVehiclesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.numVehiclesInput);
      }

      if(!attrs.zip || attrs.zip == '' || attrs.zip.match(/^\d{5}(-\d{4})?$/) == null) {
        self.displayError(self.ui.zipInput);
        return false;
      } else {
        self.displaySuccess(self.ui.zipInput);
      }

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var numVehicles = this.vehicle.get('numVehicles') || undefined
    , zip = this.vehicle.get('zip') || undefined;
    
    if(numVehicles) this.modelBinder.watch('value: numVehicles', {selector: '[name="num_vehicles"]'});
    if(zip) this.modelBinder.watch('value: zip', {selector: '[name="zip"]'});
  },
  validate: function() {
    var attrs = {
      numVehicles: this.ui.numVehiclesInput.val(),
      zip: this.ui.zipInput.val()
    }
    this.vehicle.validate(attrs);
  },
  displaySuccess: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('default-label');
        })
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
  },
  displayError: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('error-msg');
        })
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {   
    var attrs = {
      numVehicles: this.ui.numVehiclesInput.val(),
      zip: this.ui.zipInput.val()
    }
    if(this.vehicle.validate(attrs)) {
      this.vehicle.set(attrs);     
      App.vent.trigger('showInputView', 'list');
    }
  }
});

