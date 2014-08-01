"use strict";
var App = require('./app');
// This entire file is here because for some fucking hard to understand reason you cannot start app.js 
// and then export it to be referenced as a module at the end of app.js. 
// It doesn't work you have to start it somewhere else. 
// No clue why this is.
App.start(); 