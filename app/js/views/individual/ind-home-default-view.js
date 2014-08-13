'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var defaultTemplate = require('../../templates/individual/ind-home-default-template.hbs')

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
		'blur input[name="zip"]': 'validate',
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

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.category);
    var zip = this.category.get('zip') || undefined;
    if(zip) this.modelBinder.watch('value: zip', {selector: '[name="zip"]'});
  },
	validate: function() {
		this.category.validate({zip: $('[name="zip"]').val()});
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
      zip: $('input[name="zip"]').val()
    }
    if(this.category.validate(attrs)) {
      this.category.set(attrs);
      App.vent.trigger('showInputView', 'add');
    }
  }
});