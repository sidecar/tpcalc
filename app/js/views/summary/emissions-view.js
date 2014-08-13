var Marionette = require('backbone.marionette')
, template = require('../../templates/summary/emissions-template.hbs')
, itemView = require('./emissions-category-view')
, App = require('../../app');

module.exports = Marionette.CompositeView.extend({
  template: template,
  itemView: itemView,
  itemViewContainer: '.offset',
  events: {
    'click .toggleEmissionsUnit': 'toggleEmissionsUnit'
  },
  toggleEmissionsUnit: function(event) {
    event.preventDefault();
    App.vent.trigger('toggleEmissionsUnit');
  },
  serializeData: function() {
    var alternateUnit = (this.model.get('emissionsUnit') === 'pounds') ? 'mT' : 'lbs' ;
    return {
      alternateUnit: alternateUnit
    }
  }
});
