'use strict';
var _ = require('underscore') 
  , $ = require('jquery')
  , Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('./app');

var MainLayout = require('./views/main-layout')
  , HeaderView = require('./views/header-view')
  , FooterView = require('./views/footer-view')
  , CategoriesMenuView = require('./views/categories-menu-view')
  , CategoryIconView = require('./views/category-icon-view')
  , SummaryLayout = require('./views/summary-layout')
  , HelpView = require('./views/help-view')
  , GraphView = require('./views/graph-view')
  , EmissionsView = require('./views/emissions-view');

module.exports = App.module('Calc', function(Calc) {
  // Calculator must be manually started
  Calc.startWithParent = false;

  var Controller = require('./router').controller;
  var Router = require('./router').router;
  Calc.controller = new Controller();
  Calc.router = new Router({controller: Calc.controller});

  Calc.initModels = function(options) {
    // set up the calculator model that contains category models
    var Calculator = Backbone.Model.extend({      
      getCategoryBySlug: function(slug) {
        var categories = this.get('categories');
        var category = categories.findWhere({slug: slug});
        return category;
      },
      getViewModelBySlug: function(slug) {
        var currentCategory = this.get('currentCategoryModel');
        var views = currentCategory.get('viewList');
        var view = views.findWhere({name: slug});
        return view;
      }
    });

    var calcModel = Calc.model = new Calculator({
      id: 1,      
      displayName: options.displayName, 
      slug: options.slug,
      thankYouView: options.thankYouView
    });

    // set up models for each category
    var Category = Backbone.Model.extend({      
      getCurrentInputView: function() {
        var views = this.get('viewList');
        if(this.get('currentInputViewModel') === undefined) {
          return views.first();
        } else {
          return this.get('currentInputViewModel')
        }
      }
    });

    // create a collection of categories to be set on the Calculator model
    var Categories = Backbone.Collection.extend({      
      model: Category
    });
    var categories = Calc.categories = new Categories();
    // create ViewModel models and a collection of them called ViewList to be set on each category    
    var ViewModel = Backbone.Model;
    var ViewList = Backbone.Collection.extend({
      model: ViewModel
    });
    _.each(options.categories, function(category) {
      var viewList = new ViewList();
      // new instances of ViewModel model for each view associated with the category
      _.each(category.views, function(view) {
        var viewModel = new ViewModel({
          name: view.name,
          view: view.view,
        });
        // add each ViewModel the collection of ViewModels that is set on the Category model
        viewList.add(viewModel);
      })
      // new instance of the Category model
      var category = new Category({
        displayName: category.displayName,
        slug: category.slug,
        views: category.views,
        // add the collection of ViewModel models
        viewList: viewList,
        currentInputViewModel: viewList.first(),
        calculator: Calc.model.get('slug'),
        completed: false
      });
      // add the Category instance to the collectin of catgories set on the Calculator model
      categories.add(category);
    });

    calcModel.set({categories: categories});
    calcModel.set({currentCategoryModel: categories.first()}); 
  };

  Calc.initLayout = function(options) {
    var calcModel = Calc.model
    , currentCategoryModel = calcModel.get('currentCategoryModel')
    , inputViewModel = currentCategoryModel.getCurrentInputView();
    
    // instantiate views
    var mainLayout = Calc.mainLayout = new MainLayout();  
    var categoriesCollectionView = Calc.categoriesCollectionView = new CategoriesMenuView({
      collection: Calc.categories, 
      itemView: CategoryIconView
    });
    var headerView = Calc.headerView = new HeaderView({model: calcModel});
    var helpView = Calc.helpView = new HelpView({model: calcModel});
    var footerView = Calc.footerView = new FooterView({model: calcModel});
    
    // Set up main layout
    App.body.show(mainLayout); // have to call show on a layout before it can do anything else
    mainLayout.headerRegion.show(headerView);
    mainLayout.helpRegion.show(helpView);
    mainLayout.footerRegion.show(footerView);
    mainLayout.menuRegion.show(categoriesCollectionView);
    mainLayout.inputRegion.show(inputViewModel.get('view'));
    
    // Set up the summary layout
    var summaryLayout = Calc.summaryLayout = new SummaryLayout({model: calcModel});
    
    var graphView = Calc.graphView = new GraphView({
      model: calcModel,
      collection: Calc.categories 
    });

    var emissionsView = Calc.emissionsView = new EmissionsView({
      model: calcModel,
      collection: Calc.categories 
    });

    mainLayout.summaryRegion.show(summaryLayout);
    summaryLayout.graphsRegion.show(graphView); 
    summaryLayout.emissionsRegion.show(emissionsView); 

    // Additional layout setup
    Calc.controller.setFooterButtonStates(inputViewModel.get('name'));

  };

  Calc.addInitializer(function(options){
    console.log(options.slug + 'Calc  initializing');
    Calc.baseRoute = '#/'+options.slug;
    Calc.initModels(options);
    Calc.initLayout(options);
    Calc.initGlobalEvents = require('./global-events');
    Calc.initGlobalEvents();
  });

  Calc.on('start', function(options) {
    console.log(options.slug + 'Calc  started');
  });

  Calc.addFinalizer(function(){
    console.log('Calc.addFinalizer');
    Calc.controller.hide();
    Calc.stopListening();
  }); 
});