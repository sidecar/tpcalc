"use strict";
var App = require('./app');
// You cannot start app.js and then export it to be referenced as a module at the end of app.js.
// You have to start it in a seperate file.
App.start();