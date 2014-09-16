'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, numeral = require('numeral')
, isEmail = require('sane-email-validation')
, http = require('http');
http.post = require('http-post');

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

    var self = this;

    var email = this.ui.emailInput.val();

    if(isEmail(email)) {
      this.displaySuccess(this.ui.emailInput);
      var trees = numeral(this.model.get('totalEmissions')/0.039).format('0,0');
      var categories = this.model.get('categories');
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //categories.each(function(cat) {


        //var emissions = cat.get('totalEmissions') || 0;
        //data[cat.get('slug')] = emissions;
      //});

      // var url = '/result/individual/'+encodeURIComponent(email)
      //   +'/'
      //   +trees
      //   +'/'
      //   +data['vehicle']
      //   +'/'
      //   +data['transit']
      //   +'/'
      //   +data['travel']
      //   +'/'+
      //   data['home'];


      // http.post(
      //   '/test', 
      //   { 
      //     name: 'Sam', 
      //     email: 'sam@emberlabs.org' 
      //   }, 
      //   function(res){
      //     console.log('http.post to /test');
      //     response.setEncoding('utf8');
      //     res.on('data', function(chunk) {
      //       console.log(chunk);
      //       $('.send-results').hide(500, function() {$('#thankyou-message').show(300)});
      //     });
      //   }
      // );

      var url = '/test';
      var data = {
        foo: 'bar', 
        x: 'y'
      };


      $.ajax({
        url: url,
        data: data,
        success: function() { 
          $('.send-results').hide(500, function() {$('#thankyou-message').show(300)});
        }
      });

    } else {
      this.displayError(this.ui.emailInput);
    }
  }
});


      // var url = '/result/individual/'+encodeURIComponent(email)
      //   +'/'
      //   +trees
      //   +'/'
      //   +data['vehicle']
      //   +'/'
      //   +data['transit']
      //   +'/'
      //   +data['travel']
      //   +'/'+
      //   data['home'];






























