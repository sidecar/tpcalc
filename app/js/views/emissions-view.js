var Marionette = require('backbone.marionette')
, template = require('../templates/emissions-template.hbs')
, itemView = require('./emissions-category-view');

module.exports = Marionette.CompositeView.extend({
  template: template,
  itemView: itemView,
  itemViewContainer: '.offset'
});
