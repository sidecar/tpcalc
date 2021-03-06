'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, numeral = require('numeral');

var Calculator = Backbone.Model.extend({
  defaults: {
    totalEmissions: 0,
    emissionsUnit: 'pounds' //pounds or tonnes
  },
  initialize: function() {
    this.on('change', this.calculateEmissions, this);
    this.set({currentCategory: this.get('categories').first()});
    var catCodes = this.get('catCodes');
    if (catCodes) this.showSelectCategories(catCodes);
    // give all categories and views access to the calculator model
    var categories = this.get('categories');
    var self = this;
    categories.each(function(category) {
      category.set({calculator: self});
      var viewModels = category.get('viewList');
      var calculator = self;
      viewModels.each(function(viewModel){
         var view = viewModel.get('view')
         view.category = category;
         view.calculator = calculator;
      });
    });

  },
  toggleEmissionsUnit: function() {
    var unit = (this.get('emissionsUnit') === 'pounds') ? 'tonnes' : 'pounds';
    this.set({emissionsUnit: unit});
  },
  showSelectCategories: function(catCodes) {
    var categories = this.get('categories');
    var newListofCats = [];
    // strip out duplicates
    catCodes = _.uniq(catCodes, false);
    // order ascending
    catCodes = _.sortBy(catCodes, function(num) {return num});
    // construct a list of requested cats based on codes
    _.each(catCodes, function(catCode, index) {
       newListofCats.push(categories.at([catCode - 1]));
    })
    categories.reset(newListofCats);
  },
  getCategoryBySlug: function(slug) {
    var categories = this.get('categories')
    , category = categories.findWhere({slug: slug});
    return category;
  },
  getViewModelBySlug: function(slug) {
    var currentCategory = this.get('currentCategory')
    , views = currentCategory.get('viewList')
    , view = views.findWhere({name: slug});
    return view;
  },
  calculateEmissions: function() {
    var categories = this.get('categories');
    var totalEmissions = 0;
    categories.forEach(function(item){
      totalEmissions += item.getTotalEmissions();
    });
    this.set({totalEmissions: totalEmissions});
  },
  getTotalEmissions: function() {
    return this.totalEmissions;
  }
});
module.exports.calculator = Calculator;

var Category = Backbone.Model.extend({
  defaults: {
    totalEmissions: 0
  },
  initialize: function() {
    this.set({currentInputView: this.get('viewList').first()});
    this.bind('change', function(){this.get('calculator').trigger('change')})
  },
  getCurrentInputView: function() {
    var views = this.get('viewList');
    if(this.get('currentInputView') === undefined) {
      return views.first();
    } else {
      return this.get('currentInputView')
    }
  },
  setCurrentInputView: function(slug) {
    var views = this.get('viewList')
    , view =views.findWhere({name: slug});
    this.set({'currentInputView': view});
  },
  getTotalEmissions: function() {
    return this.get('totalEmissions');
  }
});
module.exports.category = Category;

var Categories = Backbone.Collection.extend({
  model: Category
});
module.exports.categories = Categories;

var ViewModel = Backbone.Model;
module.exports.viewModel = ViewModel;

var ViewList = Backbone.Collection.extend({
  model: ViewModel
});
module.exports.viewList = ViewList;

