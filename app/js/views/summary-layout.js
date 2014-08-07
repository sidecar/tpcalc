var Marionette = require('backbone.marionette')
, App = require('../app')
, template = require('../templates/summary-layout-template.hbs');

module.exports = Marionette.Layout.extend({
	template: template,
  ui: {

  },
  events: {
    "click #buyBtn": "buyBtnClicked",
  },
  modelEvents: {
    "change:currentCategory": "render",
    "change:totalEmissions": "render"
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
    var calculatorDisplayName = this.model.get('displayName')
    , calculatorSlug = this.model.get('slug')
    , categoryModel = this.model.get('currentCategory')
    , categoryDisplayName = categoryModel.get('displayName')
    , categorySlug = categoryModel.get('slug');
    return {
      calculatorDisplayName: calculatorDisplayName,
      calculatorSlug: calculatorSlug,
      categoryDisplayName: categoryDisplayName,
      categorySlug: categorySlug
    }
  }
});
