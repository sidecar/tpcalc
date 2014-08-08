var Marionette = require('backbone.marionette')
, template = require('../templates/graph-template.hbs')
, ItemView = require('./graph-category-view')
, numeral = require('numeral');

module.exports = Marionette.CompositeView.extend({
  template: template,
  itemView: ItemView,
  itemViewContainer: 'tr.graph',
  serializeData: function(){
    var calculator = this.model
    , multiplier = (calculator.get('emissionsUnit') === 'pounds') ? 2204.622622 : 1
    , unitSymbol = (calculator.get('emissionsUnit') === 'pounds') ? 'lbs' : 'mT'
    , totalEmissions = numeral(calculator.get('totalEmissions')*multiplier).format('0,0')
 
    return {
      multiplier: multiplier,
      unitSymbol: unitSymbol,
      totalEmissions: totalEmissions
    }
  }
});
