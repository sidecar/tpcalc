"use strict";
var _ = require('underscore') 
  ,$ = require('jquery')
  , Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('./app')
  , MainLayout = require('./views/main-layout')
  , HeaderView = require('./views/header-view')
  , FooterView = require('./views/footer-view')
  , CategoriesCollectionView = require('./views/categories-collection-view')
  , CategoryIconView = require('./views/category-icon-view')
  , SummaryLayout = require('./views/summary-layout')
  , HelpView = require('./views/help-view')
  , EmissionsView = require('./views/emissions-view')
  , EmissionsCategoryView = require('./views/emissions-category-view')
  , Bootstrap = require('bootstrap')
  , utils = require('./utils/utility');

module.exports = App.module('Calc', function(Calc) {
  // Calculator must be manually started
  Calc.startWithParent = false;

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      // ':categoriesCodes/:calculator/:category/:inputView': 'showInputView'
      ':calculator/complete/thankyou': 'showThankYouView',
      ':calculator/:category/:inputView': 'showInputView'
    }
  }); 

  var Controller = Marionette.Controller.extend({
    // showInputView: function(catCodes, calculator, category, inputView) {
    showInputView: function(calculator, categorySlug, inputViewSlug) {
      var categoryModel = Calc.model.getCategoryBySlug(categorySlug);
      Calc.model.set({currentCategoryModel: categoryModel});
      var inputViewModel = Calc.model.getViewModelBySlug(inputViewSlug);
      categoryModel.set({currentInputViewModel: inputViewModel});
      Calc.mainLayout.inputRegion.show(inputViewModel.get('view')); 
      Calc.mainLayout.headerRegion.$el.show();
      Calc.setFooterButtonStates(inputViewModel.get('name'));
    },
    showThankYouView: function(calculator) {
      var thankYouView = Calc.model.get('thankYouView');
      Calc.mainLayout.inputRegion.show(thankYouView); 
      Calc.mainLayout.headerRegion.$el.hide();
      Calc.setFooterButtonStates('thankyou');
    },
    // When the module stops, we need to clean up our views
    hide: function() {
      App.body.close();
      this.data = this.view = null;
    },
    // Makes sure that this subapp is running so that we can perform everything we need to
    _ensureAppModuleIsRunning: function() {
      App.execute('appModule:start', 'Calc');
    }
  }); 

  Calc.controller = new Controller();
  Calc.router = new Router({controller: Calc.controller});

  Calc.goToNextCategory = function() {
    var categories = Calc.model.get('categories');
    var index = categories.indexOf(Calc.model.get('currentCategoryModel'));
    var newCategory = categories.at(index+1);

    if(newCategory === undefined) {
      App.router.navigate(Calc.baseRoute+'/complete/thankyou', {trigger: true});
      return;
    }
    Calc.model.set({currentCategoryModel: newCategory});
    var newCategorySlug = newCategory.get('slug');
    var inputViewModel = newCategory.getCurrentInputView();
    App.router.navigate(Calc.baseRoute+'/'+newCategorySlug+'/'+inputViewModel.get('name'), {trigger: true});
  };

  Calc.goToPrevCategory = function() {
    var categories = Calc.model.get('categories');
    var index = categories.indexOf(Calc.model.get('currentCategoryModel'));
    var prevCategory = categories.at(index-1);

    if(prevCategory === undefined) {
      alert('this is the first category');
      return;
    }
    Calc.model.set({currentCategoryModel: prevCategory});
    var prevCategorySlug = prevCategory.get('slug');
    var inputViewModel = prevCategory.getCurrentInputView();
    App.router.navigate(Calc.baseRoute+'/'+prevCategorySlug+'/'+inputViewModel.get('name'), {trigger: true});
  };

  Calc.setFooterButtonStates = function(inputName) {
    var categories = Calc.model.get('categories');
    var initialCat = categories.first();
    var currentCat = this.model.get('currentCategoryModel');
    var views = currentCat.get('viewList');
    //TODO turn this views bizness into a collection
    var initialViewObject = views.first();
    if (inputName === initialViewObject.get('name') && currentCat.get('slug') === initialCat.get('slug')) {
      Calc.footerView.disablePrevBtn();
    } else if (inputName === 'thankyou') {
      Calc.footerView.disableNextBtn();
    } else {
      Calc.footerView.activatePrevBtn();
      Calc.footerView.activateNextBtn();
    }
  };

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
      displayName: options.displayName, 
      slug: options.slug,
      thankYouView: options.thankYouView
    });

    // Set up models for each category
    var Category = Backbone.Model.extend({
      initialize: function(options){
        this.set({viewList: options.viewList});
        this.set({slug: options.slug});
        this.set({displayName: options.displayName});
        this.set({currentInputViewModel: options.viewList.first()});
      },
      getCurrentInputView: function() {
        var views = this.get('viewList');
        if(this.get('currentInputViewModel') === undefined) {
          return views.first();
        } else {
          return this.get('currentInputViewModel')
        }
      }
    });

    var Categories = Backbone.Collection.extend({
      model: Category
    });

    var categories = Calc.categories = new Categories();

    var ViewModel = Backbone.Model;

    var ViewList = Backbone.Collection.extend({
      model: ViewModel
    });

    _.each(options.categories, function(category) {
      
      var viewList = new ViewList();

      _.each(category.views, function(view) {
        var viewModel = new ViewModel({
          name: view.name,
          view: view.view
        });

        viewList.add(viewModel);
      })

      var category = new Category({
        displayName: category.displayName,
        slug: category.slug,
        views: category.views,
        viewList: viewList
      });

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
    var categoriesCollectionView = Calc.categoriesCollectionView = new CategoriesCollectionView({
      collection: Calc.categories, 
      itemView: CategoryIconView
    });
    var headerView = Calc.headerView = new HeaderView({model: calcModel});
    var helpView = Calc.helpView = new HelpView({model: calcModel});
    var footerView = Calc.footerView = new FooterView({model: calcModel});
    var summaryLayout = Calc.summaryLayout = new SummaryLayout({model: calcModel});
    var emissionsView = Calc.emissionsView = new EmissionsView({
      collection: Calc.categories, 
      itemView: EmissionsCategoryView
    });
    // Set up main layout
    App.body.show(mainLayout); // have to call show on a layout before it can do anything else
    mainLayout.headerRegion.show(headerView);
    mainLayout.helpRegion.show(helpView);
    mainLayout.footerRegion.show(footerView);
    mainLayout.menuRegion.show(categoriesCollectionView);
    mainLayout.inputRegion.show(inputViewModel.get('view'));
    mainLayout.summaryRegion.show(summaryLayout);
    // Set up the summary layout
    summaryLayout.emissionsRegion.show(emissionsView); 
    // Additional layout setup
    Calc.setFooterButtonStates(inputViewModel.get('name'));
  };

  Calc.initEventListeners = function() {
    App.vent.on('next', function(event) {
      var currentCategoryModel = Calc.model.get('currentCategoryModel');
      var currentCategorySlug = currentCategoryModel.get('slug');
      var currentViewModel = currentCategoryModel.get('currentInputViewModel');
      var currentView = currentViewModel.get('view');
      var nextViewSlug = currentView.getNextViewSlug();
      
      if(nextViewSlug === '' || nextViewSlug === undefined || nextViewSlug === false) {
        Calc.goToNextCategory();
        return;
      }
      
      var nextViewModel = Calc.model.getViewModelBySlug(nextViewSlug);
      nextViewModel.set({previousViewModel: currentViewModel});
      currentCategoryModel.set({currentInputViewModel: nextViewModel});
      App.router.navigate(Calc.baseRoute+'/'+currentCategorySlug+'/'+nextViewModel.get('name'), {trigger: true});
    });
    
    App.vent.on('prev', function(event) {     
      var currentCategoryModel = Calc.model.get('currentCategoryModel');
      var currentCategorySlug = currentCategoryModel.get('slug');
      var currentViewModel = currentCategoryModel.get('currentInputViewModel');
      var previousViewModel = currentViewModel.get('previousViewModel');
      if(previousViewModel === undefined){ 
        Calc.goToPrevCategory();
        return;
      }
      currentCategoryModel.set({currentInputViewModel: previousViewModel});
      App.router.navigate(Calc.baseRoute+'/'+currentCategorySlug+'/'+previousViewModel.get('name'), {trigger: true});
    });

    App.vent.on('category', function(event) { 
      var newCategorySlug = $(event.target).data('category');
      var oldCategory = Calc.model.get('currentCategoryModel');
      var oldCategorySlug = oldCategory.get('slug');
      if(newCategorySlug === oldCategorySlug) return; 
      var newCategory = Calc.model.getCategoryBySlug(newCategorySlug);
      var currentViewModel = newCategory.getCurrentInputView();

      Calc.model.set({currentCategoryModel: newCategory});
      App.router.navigate(Calc.baseRoute+'/'+newCategorySlug+'/'+currentViewModel.get('name'), {trigger: true});
    });  

    App.vent.on('help', function(event) { 
      $('#helpModal').modal(options);
    });  

  };

  Calc.addInitializer(function(options){
    console.log(options.slug + 'Calc  initializing');
    Calc.baseRoute = '#/'+options.slug;
    Calc.initModels(options);
    Calc.initLayout(options);
    Calc.initEventListeners();
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