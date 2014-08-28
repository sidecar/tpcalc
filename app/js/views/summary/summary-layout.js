var $ = require('jquery') 
, Marionette = require('backbone.marionette')
, App = require('../../app')
, template = require('../../templates/summary/summary-layout-template.hbs')
, numeral = require('numeral');

module.exports = Marionette.Layout.extend({
	template: template,
  events: {
    "click #buyBtn": "buyBtnClicked",
    "mouseover .us-avg-graph-category": "mouseOverUSAvgGraphCategory",
    "mouseout .us-avg-graph-category": "mouseOutUSAvgGraphCategory",
    "mouseover .you-graph-category": "mouseOverYouGraphCategory",
    "mouseout .you-graph-category": "mouseOutYouGraphCategory"
  },
  modelEvents: {
    "change:currentCategory": "render",
    "change:totalEmissions": "render",
    "change:emissionsUnit": "render"
  },
  mouseOverUSAvgGraphCategory: function(event) {
    $target = $(event.target);
    var headerID = $target.data('reveal');
    $('#us-avg-total-graph-header, #'+headerID).toggle();
  },
  mouseOverYouGraphCategory: function(event) {
    $target = $(event.target);
    var headerID = $target.data('reveal');
    $('#you-total-graph-header, #'+headerID).toggle();
  },
  mouseOutUSAvgGraphCategory: function(event) {
    $target = $(event.target);
    var headerID = $target.data('reveal');
    $('#us-avg-total-graph-header, #'+headerID).toggle();
  },
  mouseOutYouGraphCategory: function(event) {
    $target = $(event.target);
    var headerID = $target.data('reveal');
    $('#you-total-graph-header, #'+headerID).toggle();
  },
  onShow: function() {
    if(this.model.get('slug') !== 'individual') $("#us-avg-graph").remove();
    $('.us-avg-graph-header').hide();
    $('#us-avg-total-graph-header').show();
    $('.you-graph-header').hide();
    $('#you-total-graph-header').show();  
  },
  onDomRefresh: function() {
    if(this.model.get('slug') !== 'individual') $("#us-avg-graph").remove();
    $('.us-avg-graph-header').hide();
    $('#us-avg-total-graph-header').show();
  },
  onRender: function() {
    var calcModel = this.model;
    var YouGraphHeaderView = require('../../views/summary/you-graph-header-view')
    var YouGraphView = require('../../views/summary/you-graph-view')
    var EmissionsView = require('../../views/summary/emissions-view');
    var CategoryOffsetsView = require('../../views/summary/category-offsets-view');
    
    var youGraphHeaderView = new YouGraphHeaderView({
      model: calcModel,
      collection: calcModel.get('categories')
    });   

    var youGraphView = new YouGraphView({
      model: calcModel,
      collection: calcModel.get('categories')
    });

    var emissionsView = new EmissionsView({
      model: calcModel,
      collection: calcModel.get('categories') 
    });

    var categoryOffsetsView = new CategoryOffsetsView({
      model: calcModel,
      collection: calcModel.get('categories') 
    });

    this.youGraphHeaderRegion.show(youGraphHeaderView); 
    this.youGraphRegion.show(youGraphView); 
    this.emissionsRegion.show(emissionsView); 
    this.categoryOffsetsRegion.show(categoryOffsetsView); 
  },
  regions: {
    youGraphHeaderRegion: '[data-region=you-graph-header]',
    youGraphRegion: '[data-region=you-graph]',
    emissionsRegion: '[data-region=emissions]',
    categoryOffsetsRegion: '[data-region=category-offsets]'
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
    , emissionPounds = this.model.get('totalEmissions')*2204.622622
    , emissionPoundsFormatted = numeral(emissionPounds).format('0,0')
    , offsetAllUnits = Math.ceil(emissionPounds/1000)
    , offsetAllPrice = numeral(offsetAllUnits * 5.95).format('$0.00')
    , monthlyOffsetAllPrice = numeral(offsetAllUnits * 5.95 / 12).format('$0.00')
    , trees = numeral(this.model.get('totalEmissions')/0.039).format('0,0')
    , usAverage = this.model.get('usAvgEmissionsMetricTons') * multiplier
    , usAverageFormatted = numeral(usAverage).format('0,0')
    , usAvgVehicleFormatted = numeral(45/100 * usAverage).format('0,0')
    , usAvgTransitFormatted = numeral(4/100 * usAverage).format('0,0')
    , usAvgTravelFormatted = numeral(7/100 * usAverage).format('0,0')
    , usAvgHomeFormatted = numeral(44/100 * usAverage).format('0,0');

    if (this.model.get('totalEmissions') < this.model.get('usAvgEmissionsMetricTons')) {
      var usAvgGraphWidth = 320;
    } else {
      var usAvgGraphWidth = numeral(this.model.get('usAvgEmissionsMetricTons') / this.model.get('totalEmissions') * 320).format('0');
    }

    var productTypeMap = {individual: 'Individuals', business: 'Businesses', events: 'Events'};
 
    return {
      calculatorDisplayName: calculatorDisplayName,
      calculatorSlug: calculatorSlug,
      categoryDisplayName: categoryDisplayName,
      categorySlug: categorySlug,
      totalEmissions: totalEmissions,
      trees: trees,
      unitSymbol: unitSymbol,
      usAverage: usAverageFormatted,
      usAvgVehicle: usAvgVehicleFormatted,
      usAvgTransit: usAvgTransitFormatted,
      usAvgTravel: usAvgTravelFormatted,
      usAvgHome: usAvgHomeFormatted,
      usAvgGraphWidth: usAvgGraphWidth,
      productType: productTypeMap[calculatorSlug],
      emissionPounds: emissionPoundsFormatted,
      offsetAllUnits: offsetAllUnits,
      offsetAllPrice: offsetAllPrice,
      monthlyOffsetAllPrice: monthlyOffsetAllPrice
    }
  }
});
