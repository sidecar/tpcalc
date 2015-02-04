var $ = require('jquery')
, Marionette = require('backbone.marionette')
, template = require('../../templates/individual/flight-list-item-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: template,
  //THIS SOLUTION IS SO NOT DOCUMENTED!
  //http://stackoverflow.com/questions/14656068/turning-off-div-wrap-for-backbone-marionette-itemview
  onRender: function () {
    // Get rid of that pesky wrapping-div.
    // Assumes 1 child element present in template.
    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely
    // nesting elements during re-render.
    this.$el.unwrap();
    //setElement is the key
    this.setElement(this.$el);
  }
});
