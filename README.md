# _TerraPass Carbon Emissions Calculator_



## Steps to getting an app running on OpenShift with a custom Node.js version
Based on https://github.com/ramr/nodejs-custom-version-openshift

Create a github repo. In this case git://github.com/sidecar/tpcalc.git.git
Create an account at http://openshift.redhat.com/
Create a namespace, if you haven't already do so for example 'sidecar'
	rhc domain create <yournamespace>
Create a nodejs application (you can name it anything via -a) and choose node versino with -t
	rhc app create -a <yourappname>  -t nodejs-0.10
Open shift will create a local repo called '<yourappname>' 
Merge the github repo as the upsteam of the existing local repo

	cd tpcalc
	git remote add upstream -m master git://github.com/sidecar/tpcalc.git.git
	git pull -s recursive -X theirs upstream master

Optionally, specify the custom version of Node.js you want to run with (Default is v0.10.25). If you want to more later version of Node (example v0.11.11), you can change to that by just writing it to the end of the NODEJS_VERSION file and committing that change.

echo 0.11.11 >> .openshift/markers/NODEJS_VERSION
git commit . -m 'use Node version 0.11.11'

Then push the repo to OpenShift
	git push

This application will then run at http://<yourappname>-<yournamespace>.rhcloud.com
( See env @ http://<yourappname>-<yourappname>.rhcloud.com/env )


## Build concerns 
I based the build concerns for this project on http://davidtucker.net/articles/automating-with-grunt/
note: This list can and should be edited/ammeded and is not 100% fufilled
- lint JavaScript code 
- compile my SASS/Compass code to a standard file that includes the Bootstrap framework.
- utilize Browserify to manage dependencies between different logic groups of my JavaScript code using CommonJS modules and compile that to a single JavaScript file that I can load for my site. 
- create a build then launch the preview server 
- be able to automatically compile my SASS code when .scss files are changed
- minify images that are included in my static site after the site is built but before it is deployed to the host. 
- automatically package JavaScript code with Browserify when any of those files in my work directory change
- be able to automatically compress and minify my JavaScript when building 
- minify all CSS files that are compiled from the SASS code before deployment
- delete the contents of the build directory before I initiate a new build process. 
- Nice to haves:
- be able to utilize a hash of my CSS/JS files' filename to help ensure that the viewers of my site don't end up loaded an older cached version of these files. 
- be able to deploy to both a staging or production environment

## Tech Stack
- NPM - Package Mangagement
- Gulp - Task Runner
- Browserify - Common JS Module management
- Browserify Shim - to shim in vender javascript to be used like a Common JS module
- SASS- CSS Preprocessing handled by gulp-sass
- Backbone (jQuery, Underscore) - MV* framework
- Backbone.Marionette (Backbone, Backbone.BabySitter, Backbone.Wreqr) - Adds structure to Backbone
- Handlebars - Templating
- hbsfy - Handlebars template transform for browserify
- Bootstrap for standardized UI component css
- jQueryUI for Browserify https://www.npmjs.org/package/jquery-ui specifically for the range slider
- Backbone.databinding for two-way databinding
- numerals.js and JS-Quantities for number formatting
- node.js for server side needs such as querying RESTful API's
note: jQuery Mobile could be used for UI elements that need to be touch enabled for mobile
note: there is another way to do handlebars templateting in Marionette, see 'Building Better Backbone Apps With Marionette pg. 38'

## Project Setup

### Install node
- If you're using the excellent homebrew package manager, you can install node with one command: 
	brew install node
- Or follow the directions here: http://howtonode.org/how-to-install-nodejs

### Install npm
	curl http://npmjs.org/install.sh | sh
More info here: http://howtonode.org/introduction-to-npm

### Install nodemon
	npm install -g nodemon

### Install gulp
	npm install -g gulp

### Install dependencies
	npm install

## Run the project locally for development
	gulp server
Project will be running at port 3000 on localhost
gulp-livereload serves a script at port 35729, to use it a web page can call it with this script:
  <script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
more info here:
http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually-

## NPM packaged dependencies are listed in package.json, dev dependencies are those packages which are used only in developemnet such as those for the gulp tasks or for testing

## Testing
Test suite is built with Jasmine and the test runner is Karma
	gulp test

## Building
	gulp build
Produces a complete project in the /dist directory

## Features

## Mobile 
	<meta name="viewport"  content="width=490">
Using the viewport meta tag to control layout on mobile browsers
https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag

## Configurable via url parameters
Categories should can be turned on and off based on url params

## Dump csv of data ready for pivot table

## Contributing changes

## License
