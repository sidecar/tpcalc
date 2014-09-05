var $ = require('jquery')
, App = require('../../app')
, Marionette = require('backbone.marionette')
, template = require('../../templates/shared/footer-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
	events: {
    "click .btn-next": "nextBtnClicked",
    "click .btn-prev": "prevBtnClicked"
	},
  modelEvents: {
    "change:currentCategory": "render"
  },
  nextBtnClicked: function() {
    App.vent.trigger('next');
  },
  prevBtnClicked: function() {
    App.vent.trigger('prev');
  },
  disablePrevBtn: function() {
    $('.btn-prev').attr('disabled', 'disabled');
    $('.btn-prev').removeClass('active');    
  },
  activatePrevBtn: function() {
    $('.btn-prev').removeAttr('disabled');
    $('.btn-prev').addClass('active');
  },
  disableNextBtn: function() {
    $('.btn-next').attr('disabled', 'disabled');
    $('.btn-next').removeClass('active');    
  },
  activateNextBtn: function() {
    $('.btn-next').removeAttr('disabled');
    $('.btn-next').addClass('active');
  },
  serializeData: function(){
    var calculatorDisplayName = this.model.get('displayName')
    , calculatorSlug = this.model.get('slug')
    , categoryModel = this.model.get('currentCategory')
    , categoryDisplayName = categoryModel.get('displayName')
    , categorySlug = categoryModel.get('slug');
    return {
      calculatorDisplayName: calculatorDisplayName,
      calculatorSlug: calculatorSlug,
      categoryDisplayName: categoryDisplayName,
      categorySlug: categorySlug
    }
  }

});
