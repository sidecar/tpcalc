var Marionette = require('backbone.marionette')
, template = require('../templates/summary-layout-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template,
  regions: {
    graphsRegion: '[data-region=graphs]',
    emissionsRegion: '[data-region=emissions]',
  }
});
