'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var classTemplate = require('../templates/ind-vehicle-class-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: classTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});