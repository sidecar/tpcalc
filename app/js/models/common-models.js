'use strict';
var _ = require('underscore')
, Backbone = require('backbone')
, LocalStorage = require("backbone.localstorage");

var Calculator = Backbone.Model.extend({ 
  fetch: function() {
      console.log("===== FETCH FIRED LOADING LOCAL STORAGE ====");
      this.set(JSON.parse(LocalStorage.getItem(this.id)));
  },

  save: function(attributes) {
      console.log("===== CHANGE FIRED SAVING LOCAL STORAGE ====");
      LocalStorage.setItem(this.id, JSON.stringify(this.toJSON()));
  },

  destroy: function(options) {
      LocalStorage.removeItem(this.id);
  }, 
  initialize: function() {
    //this.set({categories: new Categories([vehicleCategory,transitCategory,travelCategory,homeCategory])});
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
  }
});
module.exports.calculator = Calculator;  

var Category = Backbone.Model.extend({
  initialize: function() {
    this.set({currentInputView: this.get('viewList').first()});
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
  }
});
module.exports.category = Category;

var Categories = Backbone.Collection.extend({      
  model: Category,
  localStorage: new LocalStorage("CategoriesCollection")
});
module.exports.categories = Categories;      

var ViewModel = Backbone.Model;
module.exports.viewModel = ViewModel;

var ViewList = Backbone.Collection.extend({
  model: ViewModel,
  localStorage: new LocalStorage("ViewListCollection")
});
module.exports.viewList = ViewList;

