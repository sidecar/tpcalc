var Marionette = require('backbone.marionette')
, template = require('../../templates/summary/category-offset-item-template.hbs')
, numeral = require('numeral');

module.exports = Marionette.ItemView.extend({
  template: template,
  className: 'offset-category',
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
  serializeData: function(){
    var category = this.model
    , categoryDisplayName = category.get('displayName')
    , emissionPounds = category.get('totalEmissions')*2204.622622
    , offsetUnits = Math.ceil(emissionPounds/1000)
    , monthslyOffsetPrice = numeral(offsetUnits * 5.95 / 12).format('$0.00')
    return {
      categoryDisplayName: categoryDisplayName,
      monthslyOffsetPricePrice: monthslyOffsetPrice
    }
  }
});
