var $ = require('jquery')
, Marionette = require('backbone.marionette');

module.exports = Marionette.CollectionView.extend({
  tagName: 'ul',
  className: 'menu',
  onRender: function() {
    $(this.el).append('<li class="help"><a href="#" data-toggle="modal" data-target="#helpModal" class="btn btn-default btn-circle-36 ico-help">Help</a></li>');

    $(function(){
      var fast = 200;
      var faster = 50;
      $("#col-nav li").hover(function(){
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
    });

  }
});
