'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')

module.exports.a = Backbone.View.prototype.displaySuccess = function($elem) {
  $elem.parent()
    .prev('label')
    .html(function() {
        return $(this).data('default-label');
      })
    .parent('div')
    .addClass('has-success')
    .removeClass('has-error');
};

module.exports.b = Backbone.View.prototype.displayError = function($elem, err) {
  $elem.parent()
    .prev('label')
    .html(err)
    .parent('div')
    .addClass('has-error')
    .removeClass('has-success');
};
