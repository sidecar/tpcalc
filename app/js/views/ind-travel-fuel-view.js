'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var fuelTemplate = require('../templates/ind-travel-fuel-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: fuelTemplate,
  events: {

  },
  getNextInputView: function() {
    App.vent.trigger('goToNextCategory');
  }
});
