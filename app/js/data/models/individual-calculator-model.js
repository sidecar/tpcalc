"use strict";
var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../../app');

module.exports = Backbone.Model.extend({
  defaults: {  
  },
  intialize: function() {
  },
  displayName: 'Individual',
  slug: 'individual',
  categories: [
    {
      displayName: 'Vehicle',
      slug: 'vehicle',
      icon: ''
    },
    {
      displayName: 'Public Transortation',
      slug: 'transport',
      icon: ''
    },
    {
      displayName: 'Air Travel',
      slug: 'air',
      icon: ''
    },
    {
      displayName: 'Home Energy',
      slug: 'home',
      icon: ''
    }
  ]
});  
