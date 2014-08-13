var Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('../../app')
  , template = require('../../templates/shared/help-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template
});
