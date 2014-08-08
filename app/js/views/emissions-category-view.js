var Marionette = require('backbone.marionette')
, template = require('../templates/emissions-category-template.hbs')
, numeral = require('numeral');

module.exports = Marionette.ItemView.extend({
  template: template,
  className: 'offset-category',
  serializeData: function(){
    var category = this.model
    , calculator = category.get('calculator')
    , multiplier = (calculator.get('emissionsUnit') === 'pounds') ? 2204.622622 : 1
    , unitSymbol = (calculator.get('emissionsUnit') === 'pounds') ? 'lbs' : 'mT'
    , calculatorDisplayName = calculator.get('displayName')
    , calculatorSlug = calculator.get('slug')
    , categoryModel = calculator.get('currentCategory')
    , categoryDisplayName = category.get('displayName')
    , categorySlug = category.get('slug')
    , totalEmissions = numeral(category.get('totalEmissions')*multiplier).format('0,0')
 
    return {
      calculator: calculator,
      multiplier: multiplier,
      unitSymbol: unitSymbol,
      calculatorDisplayName: calculatorDisplayName,
      calculatorSlug: calculatorSlug,
      categoryModel: categoryModel,
      categoryDisplayName: categoryDisplayName,
      categorySlug: categorySlug,
      totalEmissions: totalEmissions
    }
  }
});
