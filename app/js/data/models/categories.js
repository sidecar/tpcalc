"use strict";
var Backbone = require('backbone'),
	Marionette = require('backbone.marionette'),
	App = require('../app');

var category = Backbone.Model.extend({
  defaults: {
    displayName: '',
    slug: ''  
  },
  intialize: function() {

  }
});  

module.exports = Backbone.Collection.extend({
  model: category
});