var $ = require('jquery')
  , _ = require('underscore')
  , Marionette = require('backbone.marionette')
  , App = require('../app')
  , template = require('../templates/menu-template.hbs')
  , MenuIconView = require('./menu-icon-view');

module.exports = Marionette.Layout.extend({
	template: template,
  ui: {
    li: 'li'
  },
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
      self.$('.menu li.'+categorySlug).append('<div class="checkmark"></div>');
    });
    self.$('.menu').append('<li class="help"><a href="#" class="btn btn-default btn-circle-36 ico-help" data-toggle="modal" data-target="#helpModal">Help</a></li>');
  
    var fast = 200;
    var faster = 50;
    self.$('.menu li').hover(function(){
      console.log('bapioadbhpioafhbapoiubh');
      $(this).stop().animate({width:'240px'},fast,function(){});
      $(this).find('a').stop().animate({width:'240px'},fast);
      $(this).find('.checkmark').stop()
        .animate({top:'6px'},faster)
        .animate({right:'6px'},faster);
    }, function() {
      $(this).stop().animate({width:'36px'},fast);
      $(this).find('a').stop().animate({width:'36px'},fast);
      $(this).find('.checkmark').stop()
        .animate({top:'-8px'},faster)
        .animate({right:'-8px'},faster);
    });


  }
});
