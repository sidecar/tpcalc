var $ = require('jquery'),
	Marionette = require('backbone.marionette'),
	App = require('../app'),
	template = require('../templates/menu-icon-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  tagName: 'a',
  className: 'category-icon',
  initialize: function(attrs) {
    this.attrs = attrs;
  },
  onRender: function() {
    var app = App;
    var self = this;
    $(this.el)
      .attr( {"data-category": this.attrs.categorySlug, 'href': '#'})
      .html(this.attrs.displayName)
      .on('click', function(){
        self.categoryClicked(event);
      })
  },
	categoryClicked: function(event) {
    console.log('categoryClicked');
		event.preventDefault();
		App.vent.trigger('category', event);
	}
});
