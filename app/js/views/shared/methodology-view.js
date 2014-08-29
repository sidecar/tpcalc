var $ = require('jquery')
  , Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('../../app')
  , template = require('../../templates/shared/methodology-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template,
  onShow: function() {
    console.log("$('#'+this.model.get('slug')+'-methodology')", $('#'+this.model.get('slug')+'-methodology'));
    $('#'+this.model.get('slug')+'-methodology').removeClass('hide');
  }
});
