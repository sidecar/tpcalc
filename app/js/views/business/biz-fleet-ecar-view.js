'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var ecarTemplate = require('../../templates/business/biz-fleet-ecar-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: ecarTemplate,
  events: {
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});
