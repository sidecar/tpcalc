'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var planeTemplate = require('../../templates/business/biz-fleet-plane-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: planeTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});