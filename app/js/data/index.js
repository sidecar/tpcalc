"use strict";
var Marionette = require('backbone.marionette'),
	App = require('../app');

modules.exports = App.module('Data', function(Data) {
	Data.addInitializer(function(options){

	});
	Data.addFinalizer(function(){
		//Delete data classes
	});
});