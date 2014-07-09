var Marionette = require('backbone.marionette')
, template = require('../templates/summary-layout-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template,
  regions: {
    emissionsRegion: '[data-region=emissions]',
  }
});
