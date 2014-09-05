'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var template = require('../../templates/events/evt-gate-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
	events: {
	},
  onRender: function() {
    App.gateShowing = true;
  },
  getNextInputView: function() {
    App.vent.trigger('showInputView', 'default');
    //App.execute('calcModule:start', 'events', undefined);
  }
});
