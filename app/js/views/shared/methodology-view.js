var $ = require('jquery')
  , Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('../../app')
  , template = require('../../templates/shared/methodology-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template,
  onShow: function() {
    $('#'+this.model.get('slug')+'-methodology').removeClass('hide');
    $('.back-to-top-link').on('click', function(event) {
      event.preventDefault();
      App.vent.trigger('goBackToMethodologyTop');
    });
  }
});
