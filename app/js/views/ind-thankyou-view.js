"use strict";
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var template = require('../templates/ind-thankyou-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
	events: {
	},
	getNextViewSlug: function() {
		return '';
	},
  getNextView: function() {
    App.vent.trigger('goToNextCategory');
  }
});
