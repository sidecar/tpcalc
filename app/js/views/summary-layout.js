var Marionette = require('backbone.marionette')
, App = require('../app')
, template = require('../templates/summary-layout-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template,
  ui: {

  },
  events: {
    "click #buyBtn": "buyBtnClicked",
  },
  regions: {
    graphsRegion: '[data-region=graphs]',
    emissionsRegion: '[data-region=emissions]',
  },
  buyBtnClicked: function(event) {
    event.preventDefault();
    App.vent.trigger('buy', event);
  }
});
