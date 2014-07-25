'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var defaultTemplate = require('../templates/evt-meals-default-template.hbs');

module.exports.default = Marionette.ItemView.extend({
	template: defaultTemplate,
	events: {
	},
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});

