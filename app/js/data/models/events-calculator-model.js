"use strict";
var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../../app');

module.exports = Backbone.Model.extend({
  defaults: {  
  },
  intialize: function() {
  },
  displayName: 'Events',
  slug: 'events',
  categories: [
    {
      displayName: 'Site',
      slug: 'site',
      icon: ''
    },
    {
      displayName: 'Driving',
      slug: 'driving',
      icon: ''
    },
    {
      displayName: 'Flights',
      slug: 'flights',
      icon: ''
    }
  ]
});  
