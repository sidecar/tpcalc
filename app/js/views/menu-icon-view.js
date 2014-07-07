var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../app')
, template = require('../templates/menu-icon-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  tagName: 'a',
  events: {
    'click a': 'categoryClicked'
  },
  initialize: function(options) {
    this.slug = options.categorySlug;
    this.displayName = options.displayName;
  },
  onRender: function() {
    this.$el.addClass('btn btn-default btn-circle-36 ico-'+this.slug)
      .data('category', this.slug)
      .html(this.displayName);
  },
  categoryClicked: function(event) {
    event.preventDefault();
    App.vent.trigger('category', event);
  }
});
