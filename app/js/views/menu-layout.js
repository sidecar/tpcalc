var _ = require('underscore')
  , Marionette = require('backbone.marionette')
  , App = require('../app')
  , template = require('../templates/menu-template.hbs')
  , MenuIconView = require('./menu-icon-view');

module.exports = Marionette.Layout.extend({
	template: template,
  events: {
  },
  initialize: function(options) {
    this.options = options;
  },
  onRender: function() {
    var self = this
    , categoryModels = this.options.categories;
    _.each(categoryModels, function(categoryModel) {
      var category = categoryModel.get('category');
      var displayName = category.displayName;
      var categorySlug = category.slug;
      self.$('.menu').append('<li class='+categorySlug+'></li>');
      self.addRegion(categorySlug, '.'+categorySlug);
      self[categorySlug].show(new MenuIconView({model: categoryModel, categorySlug: categorySlug, displayName: displayName}));
    });
    self.$('.menu').append('<li class="help"><a href="#" class="btn btn-default btn-circle-36 ico-help" data-toggle="modal" data-target="#helpModal">Help</a></li>');
  }
});
