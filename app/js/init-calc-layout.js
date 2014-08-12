'use strict';
var App = require('./app');

var MainLayout = require('./views/shared/main-layout')
  , HeaderView = require('./views/shared/header-view')
  , FooterView = require('./views/shared/footer-view')
  , CategoriesMenuView = require('./views/shared/categories-menu-view')
  , CategoryIconView = require('./views/shared/category-icon-view')
  , SummaryLayout = require('./views/summary/summary-layout')
  , HelpView = require('./views/shared/help-view')
  , GraphView = require('./views/summary/graph-view')
  , EmissionsView = require('./views/summary/emissions-view');

module.exports = function(Calc) {
  var calcModel = Calc.model
  , currentCategory = calcModel.get('currentCategory')
  , inputViewModel = currentCategory.getCurrentInputView();

  // instantiate views
  var mainLayout = Calc.mainLayout = new MainLayout();  
  var categoriesMenuView = Calc.categoriesMenuView = new CategoriesMenuView({
    collection: calcModel.get('categories'), 
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
  mainLayout.menuRegion.show(categoriesMenuView);
  mainLayout.inputRegion.show(inputViewModel.get('view'));

  // Set up the summary layout
  var summaryLayout = Calc.summaryLayout = new SummaryLayout({model: calcModel});
  mainLayout.summaryRegion.show(summaryLayout);
};


