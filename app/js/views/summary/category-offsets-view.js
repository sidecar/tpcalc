var Marionette = require('backbone.marionette')
, template = require('../../templates/summary/category-offsets-template.hbs')
, itemView = require('./category-offset-item-view')
, App = require('../../app')
, numeral = require('numeral');

module.exports = Marionette.CompositeView.extend({
  template: template,
  // itemView: itemView,
  // itemViewContainer: '.category-offsets-item-container',
  onRender: function () {
    //THIS SOLUTION IS SO NOT DOCUMENTED
    //http://stackoverflow.com/questions/14656068/turning-off-div-wrap-for-backbone-marionette-itemview
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
    var emissionPounds = this.model.get('totalEmissions')*2204.622622
    , emissionPoundsFormatted = numeral(emissionPounds).format('0,0')
    , offsetAllUnits = Math.ceil(emissionPounds/1000)
    , offsetAllPrice = numeral(offsetAllUnits * 5.95).format('$0.00')
    , monthlyOffsetAllPrice = numeral(offsetAllUnits * 5.95 / 12).format('$0.00')
    return {
      monthlyOffsetAllPrice: monthlyOffsetAllPrice
    }
  }
});
