var $ = require('jquery')
, Marionette = require('backbone.marionette')
, template = require('../../templates/summary/you-graph-template.hbs')
, ItemView = require('./you-graph-category-view')
, numeral = require('numeral');

module.exports = Marionette.CompositeView.extend({
  template: template,
  itemView: ItemView,
  itemViewContainer: 'tr.graph',
  serializeData: function(){
    var calculator = this.model
    , multiplier = (calculator.get('emissionsUnit') === 'pounds') ? 2204.622622 : 1
    , unitSymbol = (calculator.get('emissionsUnit') === 'pounds') ? 'lbs' : 'mT'
    , totalEmissions = numeral(calculator.get('totalEmissions')*multiplier).format('0,0');

    if (this.model.get('usAvgEmissionsMetricTons') === undefined || this.model.get('usAvgEmissionsMetricTons') === 'undefined' || this.model.get('totalEmissions') > this.model.get('usAvgEmissionsMetricTons') ) {
      var youGraphWidth = 320;
    } else {
      var youGraphWidth = numeral(this.model.get('totalEmissions') / this.model.get('usAvgEmissionsMetricTons') * 320).format('0');
    }

    return {
      unitSymbol: unitSymbol,
      totalEmissions: totalEmissions,
      youGraphWidth: youGraphWidth
    }
  }
});
