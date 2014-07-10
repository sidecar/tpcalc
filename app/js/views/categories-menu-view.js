var $ = require('jquery')
, Marionette = require('backbone.marionette');

module.exports = Marionette.CollectionView.extend({
  tagName: 'ul',
  className: 'menu',
  onRender: function() {
    $(this.el).append('<li class="help"><a href="#" data-toggle="modal" data-target="#helpModal" class="btn btn-default btn-circle-36 ico-help">Help</a></li>');
  }
});
