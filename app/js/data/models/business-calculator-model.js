"use strict";
var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../../app');

module.exports = Backbone.Model.extend({
  defaults: {  
  },
  intialize: function() {
  },
  displayName: 'Business',
  slug: 'business',
  categories: [
    {
      displayName: 'Site',
      slug: 'site',
      icon: ''
    },
    {
      displayName: 'Fleet',
      slug: 'fleet',
      icon: ''
    },
    {
      displayName: 'Air Travel',
      slug: 'air',
      icon: ''
    },
    {
      displayName: 'Commute',
      slug: 'commute',
      icon: ''
    },
    {
      displayName: 'Shipping',
      slug: 'shipping',
      icon: ''
    }
  ]
});  
