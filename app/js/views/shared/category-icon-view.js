var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, template = require('../../templates/shared/category-icon-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  events: {
    'click a': 'categoryClicked'
  },
  modelEvents: {
    "change:completed": "categoryCompleted"
  },
  categoryClicked: function(event) {
    event.preventDefault();
    App.vent.trigger('category', event);
  },
  methodologyClicked: function(event) {
    event.preventDefault();
    console.log('blah');
    App.vent.trigger('methodologyModal', event);
  },
  categoryCompleted: function() {
    $(this.el).children('.checkmark').show();
  },
  onRender: function() {
    // Get rid of that pesky wrapping-div.
    // Assumes 1 child element present in template.
    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely 
    // nesting elements during re-render.
    this.$el.unwrap();
    //setElement is the key
    this.setElement(this.$el);
  },
  serializeData: function() {
    return {
      slug: this.model.get('slug'),
      displayName: this.model.get('displayName'),
      calculatorSlug: this.model.get('calculator').get('slug')
    }
  }
});
