"use strict";
var Backbone = require('backbone'),
	Marionette = require('backbone.marionette'),
	App = require('../app');

var calculator = Backbone.Model.extend({
  defaults: {
    displayName: '',
    slug: '',
    categories: null
  },
  intialize: function() {

  }
});  

module.exports = Backbone.Collection.extend({
  model: calculator
});