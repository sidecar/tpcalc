var _ = require('underscore')
, Backbone = require('backbone');

var defaultTravelView = require('./views/evt-travel-views').default
, flightAverageTravelView = require('./views/evt-travel-views').flightAverage
, flightLengthTravelView = require('./views/evt-travel-views').flightLength
, groundTravelView = require('./views/evt-travel-views').ground
, hotelTravelView = require('./views/evt-travel-views').hotel;

var defaultVenueView = require('./views/evt-venue-views').default;

var defaultWaterView = require('./views/evt-water-views').default;

var defaultMealsView = require('./views/evt-meals-views').default;


var Calculator = Backbone.Model.extend({  
  initialize: function() {
    this.set({categories: new Categories([travel,venue,water,meals])});
    this.set({currentCategory: this.get('categories').first()});
    var catCodes = this.get('catCodes');
    if (catCodes) this.showSelectCategories(catCodes);
    var evtThankYouView = require('./views/evt-thankyou-view');
    this.set({thankYouView: evtThankYouView});
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
  }
});

var Categories = Backbone.Collection.extend({      
  model: Category
});

var ViewModel = Backbone.Model;

var ViewList = Backbone.Collection.extend({
  model: ViewModel
});

////////////////////////////////////////////////////////
var travel = new Category({
  displayName: 'Travel',
  slug: 'travel',
  viewList: new ViewList([
    {name: 'default',  view: new defaultTravelView()},
    {name: 'flightAverage',  view: new flightAverageTravelView()}, 
    {name: 'flightLength',  view: new flightLengthTravelView()}, 
    {name: 'ground',  view: new groundTravelView()}, 
    {name: 'hotel',  view: new hotelTravelView()}
  ]),
  calculator: 'events',
  completed: false
});

////////////////////////////////////////////////////////
var venue = new Category({
  displayName: 'Venue',
  slug: 'venue',
  viewList: new ViewList([
    {name: 'default',  view: new defaultVenueView()}
  ]),
  calculator: 'events',
  completed: false
});

////////////////////////////////////////////////////////
var water = new Category({
  displayName: 'Water',
  slug: 'water',
  viewList: new ViewList([
    {name: 'default',  view: new defaultWaterView()}
  ]),
  calculator: 'events',
  completed: false
});

////////////////////////////////////////////////////////
var meals = new Category({
  displayName: 'Meals',
  slug: 'meals',
  viewList: new ViewList([
    {name: 'default',  view: new defaultMealsView()}
  ]),
  calculator: 'events',
  completed: false
});

////////////////////////////////////////////////////////
module.exports = Calculator;