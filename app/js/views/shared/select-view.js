'use strict';
var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var template = require('../../templates/shared/select-template');

module.exports = Marionette.ItemView.extend({
  template: template,
  serializeData: function() {
    return this.options.json;
  }
});