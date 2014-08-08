var Marionette = require('backbone.marionette')
, App = require('../app')
, template = require('../templates/summary-layout-template.hbs')
, numeral = require('numeral');

module.exports = Marionette.Layout.extend({
	template: template,
  ui: {

  },
  events: {
    "click #buyBtn": "buyBtnClicked",
  },
  modelEvents: {
    "change:currentCategory": "render",
    "change:totalEmissions": "render",
    "change:emissionsUnit": "render"
  },
  onRender: function() {
    var calcModel = this.model;
    var GraphView = require('../views/graph-view')
    var EmissionsView = require('../views/emissions-view');
    var graphView = new GraphView({
      model: calcModel,
      collection: calcModel.get('categories')
    });

    var emissionsView = new EmissionsView({
      model: calcModel,
      collection: calcModel.get('categories') 
    });

    this.graphsRegion.show(graphView); 
    this.emissionsRegion.show(emissionsView); 
  },
  regions: {
    graphsRegion: '[data-region=graphs]',
    emissionsRegion: '[data-region=emissions]',
  },
  buyBtnClicked: function(event) {
    event.preventDefault();
    App.vent.trigger('buy', event);
  },
  serializeData: function(){
    var multiplier = (this.model.get('emissionsUnit') === 'pounds') ? 2204.622622 : 1
    , unitSymbol = (this.model.get('emissionsUnit') === 'pounds') ? 'lbs' : 'mT'
    , calculatorDisplayName = this.model.get('displayName')
    , calculatorSlug = this.model.get('slug')
    , categoryModel = this.model.get('currentCategory')
    , categoryDisplayName = categoryModel.get('displayName')
    , categorySlug = categoryModel.get('slug')
    , totalEmissions = numeral(this.model.get('totalEmissions')*multiplier).format('0,0')
    , trees = numeral(this.model.get('totalEmissions')/0.039).format('0,0')
    , usAverage = numeral(6.80433914190326 * multiplier).format('0,0');

    if (this.model.get('totalEmissions') < this.model.get('usAverageEmissions')) {
      var usAvgGraphWidth = 320;
    } else {
      var usAvgGraphWidth = numeral(this.model.get('usAverageEmissions') / this.model.get('totalEmissions') * 320).format('0');
    }
 
    return {
      calculatorDisplayName: calculatorDisplayName,
      calculatorSlug: calculatorSlug,
      categoryDisplayName: categoryDisplayName,
      categorySlug: categorySlug,
      totalEmissions: totalEmissions,
      trees: trees,
      unitSymbol: unitSymbol,
      usAverage: usAverage,
      usAvgGraphWidth: usAvgGraphWidth
    }
  }
});
