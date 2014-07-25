'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var motorcycleTemplate = require('../templates/ind-vehicle-motorcycle-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: motorcycleTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});