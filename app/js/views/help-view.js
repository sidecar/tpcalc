var Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('../app')
  , template = require('../templates/help-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template,
  onRender: function() {
    //this.$el.hide();
  },
	show: function() {
		//this.$el.show();
	}
});
