'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var averageTemplate = require('../../templates/individual/ind-travel-average-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: averageTemplate,
  events: {

  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});