var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../app')
, template = require('../templates/menu-icon-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  events: {
    'click a': 'categoryClicked'
  },
  categoryClicked: function(event) {
    event.preventDefault();
    App.vent.trigger('category', event);
  }
});
