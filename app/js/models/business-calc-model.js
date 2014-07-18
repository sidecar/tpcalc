var _ = require('underscore')
, Backbone = require('backbone');

var defaultSiteView = require('../views/biz-site-views').default
, energySiteView = require('../views/biz-site-views').energy;

var defaultFleetView = require('../views/biz-fleet-views').default
, carFleetView = require('../views/biz-fleet-views').car
, ecarFleetView = require('../views/biz-fleet-views').ecar
, boatFleetView = require('../views/biz-fleet-views').boat
, planeFleetView = require('../views/biz-fleet-views').plane
, listFleetView = require('../views/biz-fleet-views').list;

var defaultTravelView = require('../views/biz-travel-views').default
, employeeTravelView = require('../views/biz-travel-views').employee
, milesTravelView = require('../views/biz-travel-views').miles;

var defaultCommuteView = require('../views/biz-commute-views').default;

var defaultShippingView = require('../views/biz-shipping-views').default;

var defaultServerView = require('../views/biz-server-views').default;

var Calculator = Backbone.Model.extend({  
  initialize: function() {
    this.set({categories: new Categories([site,fleet,travel,commute,shipping,server])});
    this.set({currentCategory: this.get('categories').first()});
    var catCodes = this.get('catCodes');
    if (catCodes) this.showSelectCategories(catCodes);
    var bizThankYouView = require('../views/biz-thankyou-view');
    this.set({thankYouView: bizThankYouView});
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
var site = new Category({
  displayName: 'Site',
  slug: 'site',
  viewList: new ViewList([
    {name: 'default',  view: new defaultSiteView()},
    {name: 'energy',  view: new energySiteView()}
  ]),
  calculator: 'business',
  completed: false
});

////////////////////////////////////////////////////////
var fleet = new Category({
  displayName: 'Fleet',
  slug: 'fleet',
  viewList: new ViewList([
    {name: 'default',  view: new defaultFleetView()},
    {name: 'car',  view: new carFleetView()},
    {name: 'ecar',  view: new ecarFleetView()},
    {name: 'boat',  view: new boatFleetView()},
    {name: 'plane',  view: new planeFleetView()},
    {name: 'list',  view: new listFleetView()}
  ]),
  calculator: 'business',
  completed: false
});

////////////////////////////////////////////////////////
var travel = new Category({
  displayName: 'Air Travel',
  slug: 'travel',
  viewList: new ViewList([
    {name: 'default',  view: new defaultTravelView()}, 
    {name: 'employee',  view: new employeeTravelView()}, 
    {name: 'miles',  view: new milesTravelView()}
  ]),
  calculator: 'business',
  completed: false
});
  
////////////////////////////////////////////////////////
var commute = new Category({
  displayName: 'Commute',
  slug: 'commute',
  viewList: new ViewList([
    {name: 'default',  view: new defaultCommuteView()}
  ]),
  calculator: 'business',
  completed: false
});
  
////////////////////////////////////////////////////////
var shipping = new Category({
  displayName: 'Shipping',
  slug: 'shipping',
  viewList: new ViewList([
    {name: 'default',  view: new defaultShippingView()}
  ]),
  calculator: 'business',
  completed: false
});
  
////////////////////////////////////////////////////////
var server = new Category({
  displayName: 'Server',
  slug: 'server',
  viewList: new ViewList([
    {name: 'default',  view: new defaultServerView()}
  ]),
  calculator: 'business',
  completed: false
});

////////////////////////////////////////////////////////
module.exports = Calculator;