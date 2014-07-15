var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app');

var template = require('../templates/select-template');

module.exports = Marionette.ItemView.extend({
  template: template,
  initialize: function() {
    console.log('Select View initialize');
  },
  serializeData: function() {
    console.log('this.options')
    console.log(this.options)
    return this.options.json;
  }
});