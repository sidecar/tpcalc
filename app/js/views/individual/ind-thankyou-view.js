'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, numeral = require('numeral')
, isEmail = require( "sane-email-validation" );

var template = require('../../templates/individual/ind-thankyou-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  events : {
    'blur input[name="email"]': 'validateEmail',
    'click #send-results-btn': 'submitData'
  },
  ui: {
    emailInput: 'input[name="email"]'
  },
  validateEmail: function(event) {
    var $target = $(event.target)
    , email = $target.val();
    if(isEmail(email)) {
      this.displaySuccess($target);
      return true;
    } else {
      this.displayError($target);
      return false;
    }
  },
  displaySuccess: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('default-label');
        })
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
  },
  displayError: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('error-msg');
        })
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {
    return;
  },
  submitData: function() {
    var email = this.ui.emailInput.val();

    if(isEmail(email)) {
      this.displaySuccess(this.ui.emailInput);
      var trees = numeral(this.model.get('totalEmissions')/0.039).format('0,0');
      var categories = this.model.get('categories');
      var data = [];
      categories.each(function(cat) {
        var emissions = cat.get('totalEmissions') || 0;
        data[cat.get('slug')] = emissions;
      });

      $.ajax({
        url: '/result/individual/'+encodeURIComponent(email)+'/'+trees+'/'+data['vehicle']+'/'+data['transit']+'/'+data['travel']+'/'+data['home'],
        success: function() { 
          $('.send-results').hide(500, function() {$('#thankyou-message').show(300)});
        }
      });
    } else {
      this.displayError(this.ui.emailInput);
    }
  }
});
