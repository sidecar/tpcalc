var $ = require('jquery')
, Marionette = require('backbone.marionette')
, template = require('../templates/graph-category-template.hbs')
, numeral = require('numeral');

module.exports = Marionette.ItemView.extend({
  template: template,
  //THIS SOLUTION IS SO NOT DOCUMENTED
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
  },
  serializeData: function(){
    var category = this.model
    , calculator = category.get('calculator')
    , multiplier = (calculator.get('emissionsUnit') === 'pounds') ? 2204.622622 : 1
    , calculatorSlug = calculator.get('slug')
    , categorySlug = category.get('slug')
    , percentageWidth = numeral(category.get('totalEmissions') / calculator.get('totalEmissions') * 100).format('0')
 
    return {
      calculator: calculator,
      calculatorSlug: calculatorSlug,
      categorySlug: categorySlug,
      percentageWidth: percentageWidth
    }
  }
});
