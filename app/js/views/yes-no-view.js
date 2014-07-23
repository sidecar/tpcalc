var $ = require('jquery')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('../app');

var template = require('../templates/yes-no-template');

module.exports = Marionette.ItemView.extend({
  template: template,
  serializeData: function() {
    return this.options.json;
  }
});