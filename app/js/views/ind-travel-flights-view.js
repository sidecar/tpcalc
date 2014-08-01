'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var addTemplate = require('../templates/ind-travel-flights-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: addTemplate,
  events: {

  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'list');
  }
});