'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var defaultTemplate = require('../../templates/business/biz-shipping-default-template.hbs')

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
  ui: {
    shipmentsInput: 'input[name="shipments"]',
    distanceInput: 'input[name="distance"]',
    weightInput: 'input[name="weight"]' 
  },
  events: {
    'blur input[name="shipments"]': 'shipmentsInputChanged',
    'blur input[name="distance"]': 'distanceInputChanged',
    'blur input[name="weight"]': 'weightInputChanged'
  },
  shipmentsInputChanged: function() {
    this.displaySuccess(this.ui.shipmentsInput);
  },
  distanceInputChanged: function() {
    this.displaySuccess(this.ui.distanceInput);
  },
  weightInputChanged: function() {
    this.displaySuccess(this.ui.weightInput);
  },
  onShow: function() {
    var self = this;
    this.category.validate = function(attrs, options) {

      if(!attrs.shipments || attrs.shipments == '' || attrs.shipments.match(/^\d*$/) == null) {       
        self.displayError(self.ui.shipmentsInput);
        return false;
      } else {
        self.displaySuccess(self.ui.shipmentsInput);
      }

      if(!attrs.distance || attrs.distance == '' || attrs.distance.match(/^\d*$/) == null) {       
        self.displayError(self.ui.distanceInput);
        return false;
      } else {
        self.displaySuccess(self.ui.distanceInput);
      }

      if(!attrs.weight || attrs.weight === '' || attrs.weight.match(/^\d*$/) === null) {       
        self.displayError(self.ui.weightInput);
        return false;
      } else {
        self.displaySuccess(self.ui.weightInput);
      }

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.category);

    var shipments = this.category.get('shipments') || undefined
    , distance = this.category.get('distance') || false
    , weight = this.category.get('weight') || undefined;
    
    if(shipments) this.modelBinder.watch('value: shipments', {selector: '[name="shipments"]'});
    if(distance) this.modelBinder.watch('checked: distance', {selector: '[name="distance"]'});
    if(weight) this.modelBinder.watch('value: weight', {selector: '[name="weight"]'});
  },
  validate: function() {
    var attrs = {
      shipments: this.ui.shipmentsInput.val(),
      distance: this.ui.distanceInput.val(),
      weight: this.ui.weightInput.val()
    }
    this.category.validate(attrs);
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
      shipments: this.ui.shipmentsInput.val(),
      distance: this.ui.distanceInput.val(),
      weight: this.ui.weightInput.val()
    }
    if(this.category.validate(attrs)) {
      //var shipping = require('../../utils/biz-shipping-emissions')
      this.category.set(attrs); 
      App.vent.trigger('goToNextCategory');
    }
  }
});



