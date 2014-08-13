'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var boatTemplate = require('../../templates/business/biz-fleet-boat-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: boatTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});