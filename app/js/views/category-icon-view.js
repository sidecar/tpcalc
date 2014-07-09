var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../app')
, template = require('../templates/category-icon-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  events: {
    'click a': 'categoryClicked',
    'mouseover li': 'animateMouseOver',
    'mouseout li': 'animateMouseOut'
  },
  categoryClicked: function(event) {
    event.preventDefault();
    App.vent.trigger('category', event);
  },
  animateMouseOver: function(event) {
    var fast = 200
    , faster = 50;
    $target = $(event.target);
    $li = $target.parent('li');
    $li.stop().animate({width:'240px'},fast,function(){});
    $li.find('a').stop().animate({width:'240px'},fast);
    $li.find('.checkmark').stop()
      .animate({top:'6px'},faster)
      .animate({right:'6px'},faster);
  },
  animateMouseOut: function(event) {
    var fast = 200
    , faster = 50;
    $target = $(event.target);
    $li = $target.parent('li');
    $li.stop().animate({width:'36px'},fast);
    $li.find('a').stop().animate({width:'36px'},fast);
    $li.find('.checkmark').stop()
      .animate({top:'-8px'},faster)
      .animate({right:'-8px'},faster);
  }
});
