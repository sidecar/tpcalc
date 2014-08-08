var $ = require('jquery')
, Marionette = require('backbone.marionette')
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
    , totalEmissions = numeral(calculator.get('totalEmissions')*multiplier).format('0,0');

    if (this.model.get('totalEmissions') < this.model.get('usAverageEmissions')) {
      var youGraphWidth = numeral(this.model.get('totalEmissions') / this.model.get('usAverageEmissions') * 320).format('0');
    } else {
      var youGraphWidth = 320;
    }

    return {
      unitSymbol: unitSymbol,
      totalEmissions: totalEmissions,
      youGraphWidth: youGraphWidth
    }
  }
});
