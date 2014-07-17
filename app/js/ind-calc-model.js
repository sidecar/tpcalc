var Backbone = require('backbone');

var defaultVehicleView = require('./views/ind-vehicle-views').default
, carVehicleView = require('./views/ind-vehicle-views').car
, ecarVehicleView = require('./views/ind-vehicle-views').ecar
, boatVehicleView = require('./views/ind-vehicle-views').boat
, motorcycleVehicleView = require('./views/ind-vehicle-views').motorcycle
, classVehicleView = require('./views/ind-vehicle-views').class
, optionsVehicleView = require('./views/ind-vehicle-views').options
, typeVehicleView = require('./views/ind-vehicle-views').type
, listVehicleView = require('./views/ind-vehicle-views').list;

var defaultTransitView = require('./views/ind-transit-views').default;

var defaultTravelView = require('./views/ind-travel-views').default
, addTravelView = require('./views/ind-travel-views').add
, averageTravelView = require('./views/ind-travel-views').average
, lengthTravelView = require('./views/ind-travel-views').length
, milesTravelView = require('./views/ind-travel-views').miles
, fuelTravelView = require('./views/ind-travel-views').fuel
, listTravelView = require('./views/ind-travel-views').list;

var defaultHomeView = require('./views/ind-home-views').default
, addHomeView = require('./views/ind-home-views').add;

var Calculator = Backbone.Model.extend({      
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
var indThankYouView = require('./views/ind-thankyou-view');
var individual = new Calculator({
  displayName: 'Individual',
  slug: 'individual',
  thankYouView: new indThankYouView(),
  categories: new Categories()
});

////////////////////////////////////////////////////////
var vehicle = new Category({
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
  calculator: 'individual',
  completed: false
});

////////////////////////////////////////////////////////
var transit = new Category({
  displayName: 'Public Transit',
  slug: 'transit',
  viewList: new ViewList([
    {name: 'default',  view: new defaultTransitView()}
  ]),
  calculator: 'individual',
  completed: false
});

////////////////////////////////////////////////////////
var travel = new Category({
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
  calculator: 'individual',
  completed: false
});
  
////////////////////////////////////////////////////////
var home = new Category({
  displayName: 'Home Energy',
  slug: 'home',
  viewList: new ViewList([
    {name: 'default',  view: new defaultTransitView()}
  ]),
  calculator: 'individual',
  completed: false
});

individual.set({categories : new Categories([vehicle,transit,travel,home])});
  
module.exports = individual;



  // Calc.initModels = function(options) {
    
  //   var Calculator = Backbone.Model.extend({      
  //     getCategoryBySlug: function(slug) {
  //       var categories = this.get('categories')
  //       , category = categories.findWhere({slug: slug});
  //       return category;
  //     },
  //     getViewModelBySlug: function(slug) {
  //       var currentCategory = this.get('currentCategoryModel')
  //       , views = currentCategory.get('viewList')
  //       , view = views.findWhere({name: slug});
  //       return view;
  //     }
  //   });

  //   var Category = Backbone.Model.extend({      
  //     getCurrentInputView: function() {
  //       var views = this.get('viewList');
  //       if(this.get('currentInputViewModel') === undefined) {
  //         return views.first();
  //       } else {
  //         return this.get('currentInputViewModel')
  //       }
  //     }
  //   });

  //   var Categories = Backbone.Collection.extend({      
  //     model: Category
  //   });

  //   var ViewModel = Backbone.Model;
  //   var ViewList = Backbone.Collection.extend({
  //     model: ViewModel
  //   });

  //   /////////////////////////////////////////////
  //   var calcModel = Calc.model = new Calculator({
  //     displayName: options.displayName, 
  //     slug: options.slug,
  //     thankYouView: options.thankYouView
  //   });

  //   var categories = Calc.categories = new Categories();

  //   _.each(options.categories, function(category) {
  //     var viewList = new ViewList();
      
  //     // new instances of ViewModel model for each view associated with the category
  //     _.each(category.views, function(view) {
  //       var viewModel = new ViewModel({
  //         name: view.name,
  //         view: view.view
  //       });
  //       // add each ViewModel the collection of ViewModels that is set on the Category model
  //       viewList.add(viewModel);
  //     });

  //     // new instance of the Category model
  //     var category = new Category({
  //       displayName: category.displayName,
  //       slug: category.slug,
  //       views: category.views,
  //       // add the collection of ViewModel models
  //       viewList: viewList,
  //       currentInputViewModel: viewList.first(),
  //       calculator: Calc.model.get('slug'),
  //       completed: false
  //     });
  //     // add the Category instance to the collectin of catgories set on the Calculator model
  //     categories.add(category);
  //   });

  //   calcModel.set({categories: categories});
  //   calcModel.set({currentCategoryModel: categories.first()}); 

  // };//end Calc.initModels