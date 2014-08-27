var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, template = require('../../templates/shared/category-icon-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  events: {
    'click a': 'categoryClicked'//,
    // 'mouseenter #col-nav li': 'animateMouseOver',
    // 'mouseout #col-nav li': 'animateMouseOut'
  },
  modelEvents: {
    "change:completed": "categoryCompleted"
  },
  categoryClicked: function(event) {
    event.preventDefault();
    App.vent.trigger('category', event);
  },
  categoryCompleted: function() {
    $(this.el).children('.checkmark').show();
  },
  // animateMouseOver: function(event) {
  //   console.log('bla');
  //   var fast = 200
  //   , faster = 50;
  //   $target = $(event.target);
  //   $li = $target.parent('li');
  //   $li.stop().animate({width:'240px'},fast,function(){});
  //   $li.find('a').stop().animate({width:'240px'},fast);
  //   $li.find('.checkmark').stop()
  //     .animate({top:'6px'},faster)
  //     .animate({right:'6px'},faster);
  // },
  // animateMouseOut: function(event) {
  //   var fast = 200
  //   , faster = 50;
  //   $target = $(event.target);
  //   $li = $target.parent('li');
  //   $li.stop().animate({width:'36px'},fast);
  //   $li.find('a').stop().animate({width:'36px'},fast);
  //   $li.find('.checkmark').stop()
  //     .animate({top:'-8px'},faster)
  //     .animate({right:'-8px'},faster);
  // },
  onRender: function () {
    // Get rid of that pesky wrapping-div.
    // Assumes 1 child element present in template.
    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely 
    // nesting elements during re-render.
    this.$el.unwrap();
    //setElement is the key
    this.setElement(this.$el);
  }
});
