var _ = require('underscore')
, Backbone = require('backbone');

var defaultVehicleView = require('../views/ind-vehicle-views').default
, carVehicleView = require('../views/ind-vehicle-views').car
, ecarVehicleView = require('../views/ind-vehicle-views').ecar
, boatVehicleView = require('../views/ind-vehicle-views').boat
, motorcycleVehicleView = require('../views/ind-vehicle-views').motorcycle
, classVehicleView = require('../views/ind-vehicle-views').class
, optionsVehicleView = require('../views/ind-vehicle-views').options
, typeVehicleView = require('../views/ind-vehicle-views').type
, listVehicleView = require('../views/ind-vehicle-views').list;

var defaultTransitView = require('../views/ind-transit-views').default;

var defaultTravelView = require('../views/ind-travel-views').default
, addTravelView = require('../views/ind-travel-views').add
, averageTravelView = require('../views/ind-travel-views').average
, lengthTravelView = require('../views/ind-travel-views').length
, milesTravelView = require('../views/ind-travel-views').miles
, fuelTravelView = require('../views/ind-travel-views').fuel
, listTravelView = require('../views/ind-travel-views').list;

var defaultHomeView = require('../views/ind-home-views').default
, addHomeView = require('../views/ind-home-views').add;

var Calculator = Backbone.Model.extend({  
  initialize: function() {
    this.set({categories: new Categories([vehicleCategory,transitCategory,travelCategory,homeCategory])});
    this.set({currentCategory: this.get('categories').first()});
    var catCodes = this.get('catCodes');
    if (catCodes) this.showSelectCategories(catCodes);
    var indThankYouView = require('../views/ind-thankyou-view');
    this.set({thankYouView: indThankYouView});
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
    var self = this;
    var viewModels = this.get('viewList');
    viewModels.each(function(viewModel){
       var view = viewModel.get('view')
       view.model = self;
    });
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

var Vehicle = Backbone.Model.extend({
  defaults: {
    vehicleType: 'car', //fueleconomy.gov and map
    year: 2013, //user entered
    make: 'Select a year', //user entered
    model: 'Select a make', //user entered
    mileage: 10000, //user entered
    mpg: 20, //will come from fueleconomy.gov
    fuelType: 'gas', //?!?!
    vehicleClass: 'car' //fueleconomy.gov and map
  }
});

var Vehicles = Backbone.Collection.extend({
  model: Vehicle
});

var vehicleCategory = new Category({
  displayName: 'Vehicle',
  slug: 'vehicle',
  viewList: new ViewList([
    {name: 'default',  view: new defaultVehicleView()},
    {name: 'car',  view: new carVehicleView()}, 
    {name: 'ecar',  view: new ecarVehicleView()}, 
    {name: 'motorcycle',  view: new motorcycleVehicleView()}, 
    {name: 'boat',  view: new boatVehicleView()}, 
    {name: 'class',  view: new classVehicleView()}, 
    {name: 'options',  view: new optionsVehicleView()},
    {name: 'type',  view: new typeVehicleView()},
    {name: 'list',  view: new listVehicleView()}
  ]),
  // calculator: 'individual',
  completed: false,
  vehicles: new Vehicles()
});

////////////////////////////////////////////////////////
var transitCategory = new Category({
  displayName: 'Public Transit',
  slug: 'transit',
  viewList: new ViewList([
    {name: 'default',  view: new defaultTransitView()}
  ]),
  // calculator: 'individual',
  completed: false
});

////////////////////////////////////////////////////////
var travelCategory = new Category({
  displayName: 'Air Travel',
  slug: 'travel',
  viewList: new ViewList([
    {name: 'default',  view: new defaultTravelView()}, 
    {name: 'add',  view: new addTravelView()}, 
    {name: 'average',  view: new averageTravelView()}, 
    {name: 'length',  view: new lengthTravelView()}, 
    {name: 'miles',  view: new milesTravelView()}, 
    {name: 'fuel',  view: new fuelTravelView()}, 
    {name: 'list',  view: new listTravelView()}
  ]),
  // calculator: 'individual',
  completed: false
});
  
////////////////////////////////////////////////////////
var homeCategory = new Category({
  displayName: 'Home Energy',
  slug: 'home',
  viewList: new ViewList([
    {name: 'default',  view: new defaultTransitView()}
  ]),
  // calculator: 'individual',
  completed: false
});

////////////////////////////////////////////////////////
module.exports = Calculator;