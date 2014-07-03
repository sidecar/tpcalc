var Marionette = require('backbone.marionette')
, template = require('../templates/header-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
	initialize: function(options){
		this.options = options;
    },
    serializeData: function(){
    	var calculatorName = this.model.get('displayName')
      , categoryModel = this.model.get('currentCategory')
      , categoryName = categoryModel.getDisplayName();
    	return {
    		calculatorName: calculatorName,
    		categoryName: categoryName
    	}
    } 
});
