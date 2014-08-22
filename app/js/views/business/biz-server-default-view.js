'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var defaultTemplate = require('../../templates/business/biz-server-default-template.hbs')

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
  ui: {
    zipInput: 'input[name="zip"]',
    numServersInput: 'input[name="num_servers"]' 
  },
	events: {
    'blur input[name="zip"]': 'zipInputChanged',
    'blur input[name="num_servers"]': 'numServersInputChanged'
  },
  zipInputChanged: function() {
    this.displaySuccess(this.ui.zipInput);
  },
  numServersInputChanged: function() {
    this.displaySuccess(this.ui.numServersInput);
  },
  onShow: function() {
    var self = this;

    this.category.validate = function(attrs, options) {
      if(!attrs.zip || attrs.zip == '' || attrs.zip.match(/^\d{5}(-\d{4})?$/) == null) {
        self.displayError($('input[name="zip"]'));
        return false;
      } else {
        self.displaySuccess($('input[name="zip"]'));
      }

      if(!attrs.numServers || attrs.numServers === '' || attrs.numServers.match(/^\d*$/) === null) {       
        self.displayError(self.ui.numServersInput);
        return false;
      } else {
        self.displaySuccess(self.ui.numServersInput);
      }

      return true;
    }

    this.ui.zipInput.val(this.category.get('zip') || '');
    this.ui.numServersInput.val(this.category.get('numServers') || 0);
  },
  validate: function() {
    var attrs = {
      zip: this.ui.zipInput.val(),
      numServers: this.ui.numServersInput.val()
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
      zip: this.ui.zipInput.val(),
      numServers: this.ui.numServersInput.val()
    }
    if(this.category.validate(attrs)) {
      this.category.set(attrs);
      var server = require('../../utils/biz-server-emissions');
      server.zipCode = this.ui.zipInput.val();
      server.servers = this.ui.numServersInput.val();
      this.category.set({totalEmissions: server.totalEmissions()});
      App.vent.trigger('goToNextCategory');
    }
  }
});
