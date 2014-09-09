var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

module.exports = Marionette.CollectionView.extend({
  tagName: 'ul',
  className: 'menu',
  onShow: function() {
    $(this.el).append('<li><a href="#" class="methodology-btn btn btn-default btn-circle-36 category-nav-btn ico-methodology methodology-bg">Methodology</a></li>');

    $(function(){
      var fast = 200;
      var faster = 50;
      console.log($("#col-nav li"));
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

    var appRef = App;
    $('.methodology-btn').on('click', function(event) {
      event.preventDefault();
      var topic = appRef.currentCalc.model.get('currentCategory').get('slug');
      appRef.vent.trigger('methodologyModal', topic);
    });
  }
});
