var Marionette = require('backbone.marionette')
, template = require('../templates/graph-template.hbs')
, ItemView = require('./graph-category-view');

module.exports = Marionette.CompositeView.extend({
  template: template,
  itemView: ItemView,
  itemViewContainer: 'tr.graph'
});
