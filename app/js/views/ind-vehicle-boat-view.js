'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var boatTemplate = require('../templates/ind-vehicle-boat-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: boatTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});