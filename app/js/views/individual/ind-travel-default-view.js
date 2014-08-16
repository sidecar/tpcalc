'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var defaultTemplate = require('../../templates/individual/ind-travel-default-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: defaultTemplate,
  ui: {
    methodSelect: 'input[name="method"]',
    useRfi: 'input[name="use_rfi"]'
  },
  onShow: function() {
    this.modelBinder = new Databinding.ModelBinder(this, this.category);
    this.modelBinder.watch('checked: estimationMethod', {selector: '[name="method"]'});
    this.modelBinder.watch('checked: useRFI', {selector: '[name="use_rfi"]'});
  },
  getNextInputView: function() {
    var estimationMethod = $('[name="method"]:checked').val();
    var useRFI = ($('[name="use_rfi"]:checked').val() == 'true') ? true : false ;
    this.category.set({
      estimationMethod: estimationMethod,
      useRFI: useRFI
    });
    App.vent.trigger('showInputView', estimationMethod);
  }
});