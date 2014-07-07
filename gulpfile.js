// Include gulp plugins
var gulp = require('gulp')
, runSequence = require('run-sequence')
, jshint = require('gulp-jshint')
, browserify = require('gulp-browserify')
, uglify = require('gulp-uglifyjs')
, concat = require('gulp-concat-sourcemap')
, minifyCSS = require('gulp-minify-css')
, imageMin = require('gulp-imagemin')
, sass = require('gulp-sass')
, rename = require('gulp-rename')
, replace = require('gulp-replace')
, clean = require('gulp-clean')
, http = require('http')
, gulpIf = require('gulp-if')
, gulpIgnore = require('gulp-if')
, open = require('opn')
//http://rhumaric.com/2014/01/livereload-magic-gulp-style/
, livereload = require('gulp-livereload')
, karma = require('gulp-karma')
, shell = require('gulp-shell');

// Project configuration object
var config = {
    port:   9000,
    app:    {},
    dev:   {},
    build:   {},
    test:   {}
}

config.app.baseDir = 'app/'
config.app.styles = config.app.baseDir +'styles/'
config.app.js = config.app.baseDir + 'js/'
config.app.templates = config.app.baseDir + 'templates/'
config.app.views = config.app.baseDir + 'views/'
config.app.images = config.app.baseDir + 'img/'

config.dev.baseDir = 'dev/'
config.dev.styles = config.dev.baseDir +'css/'
config.dev.js = config.dev.baseDir + 'js/'
config.dev.images = config.dev.baseDir + 'img/'

// config.build.baseDir = './'
config.build.baseDir = 'dist/'
config.build.styles = config.build.baseDir +'css/'
config.build.js = config.build.baseDir + 'js/'
config.build.images = config.build.baseDir + 'img/'

config.test.baseDir = 'test/';

gulp.task('test-prep', function() {
  //runSequence('testPrepBrowserifyTests');
  return gulp.src('test/main.spec.js')
    .pipe(browserify({
      insertGlobals: true,
      transform: ['hbsfy'],
      extensions: ['.hbs']
    }))
    .pipe(gulp.dest('test/browserified-test'));
})

gulp.task('karma', function() {
  return gulp.src(['test/browserified-test/*spec.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('test', function () {
  runSequence('test-prep', 'karma');
})

// Lint JavaScript and log lint errors
gulp.task('lint', function() {
  return gulp.src([config.app.js + '**/*.js', '!./'+config.app.js + 'vendor/**/*.js'])
      .pipe(jshint({ strict: false }))
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// gulp.task('package-vendor-libs', function() {
//   gulp.src([config.app.js + 'vendor/jquery-1.10.1.min.js', config.app.js + 'vendor/jquery.magnific-popup.min.js', config.app.js + 'vendor/bootstrap.min.js', config.app.js + 'vendor/bootstrap-slider.js'])
//     // .pipe(concat('libs.js'))
//     // .pipe(gulp.dest(config.dev.js));
//     // Concatenate AND minify files and create a source map
//     .pipe(uglify('libs.min.js', {
//       outSourceMap: 'libs.min.js.map'
//     }))
//     .pipe(gulp.dest(config.dev.js));
// });

gulp.task('copy-html-to-dev', function(){
    // Copy the index.html file into the dist dir
  return gulp.src(config.app.baseDir + '*.html')
    .pipe(gulp.dest(config.dev.baseDir));
});

gulp.task('copy-php-to-dev', function(){
    // Copy the index.html file into the dist dir
  return gulp.src(config.app.baseDir + 'php/**/*.{php,html}')
    .pipe(gulp.dest(config.dev.baseDir + 'php/'));
});

gulp.task('copy-images-to-dev', function() {
  //copy images to the dev folder
  return gulp.src(config.app.images + '**/*.{jpg,png,gif,jpeg,ico}')
    .pipe(gulp.dest(config.dev.images));
});

gulp.task('copy-fonts-to-dev', function() {
  //copy images to the dev folder
  return gulp.src(config.app.styles + 'bootstrap-sass/fonts/bootstrap/**/*.{eot,svg,ttf,woff}')
    .pipe(gulp.dest(config.dev.styles + 'fonts/bootstrap/'));
});

// Compile sass then concatenate and minify all css
gulp.task('sass', function() {
    // return gulp.src([config.app.styles + '**/*.scss', config.app.styles + '**/*.scss'])
    return gulp.src(config.app.styles + 'main.scss')
        // Only compile sass for scss files
        //http://stackoverflow.com/questions/21719833/gulp-how-to-add-src-files-in-the-middle-of-a-pipe?lq=1
        .pipe(gulpIf(/[.]scss$/, sass({quiet: true})))
        .pipe(concat('styles.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.dev.styles))
});

gulp.task('clean-dev', function() {
    return gulp.src(config.dev.baseDir).pipe(clean());
//  ^^^^^^
//   This is the key here, to make sure tasks run asynchronously!
});

gulp.task('clean-build', function() {
  //return gulp.src(['index.html', 'css', 'js', 'php']).pipe(clean());
  return gulp.src(config.build.baseDir).pipe(clean());
});

// Bundle javascript
//for now trying to install all packages with NPM here goes
gulp.task('browserify', function() {  
    // give browserify a start point not a list of files
    return gulp.src(config.app.js + 'init.js')
        .pipe(browserify({
          insertGlobals: true,
          transform: ['hbsfy'],
          // Allows you to skip .hbs in require statement along with .js and .json
          extensions: ['.hbs']
        }))
        .pipe(gulp.dest(config.dev.js));
});

// Minify javascript after its been browserfied
gulp.task('minify-js', function() {
  //grab init.js and libs.js mash em into one ugly messs
  return gulp.src(config.dev.js + 'init.js')
      // Concatenate AND minify files and create a source map
      .pipe(uglify('init.min.js', {
        outSourceMap: 'init.min.js.map'
      }))
      .pipe(gulp.dest(config.build.js));
});

gulp.task('optimize-images', function() {
  //squish down images and place in build folder
  return gulp.src(config.app.images + '**/*.{jpg,png,gif,jpeg,ico}')
    .pipe(imageMin())
    .pipe(gulp.dest(config.build.images));
});

// Create web server
// Using gulp-livereload  in the watch task instead of connect-livereload middleware 
//.use(require('connect-livereload')({ port: 35729 }))
// gulp.task('connect', function() {
// var connect = require('connect'), server = connect();
//         //??? Not what connect.directory is for ???
//         server.use(connect.static(config.dev.baseDir))
//         //.use(connect.directory(config.dev.baseDir));
//     //??? Why dont I have to include the http module to use createServer method ???
//     http.createServer(server)
//         .listen(config.port)
//         .on('listening', function() {
//             console.log('Started connect web server on http://localhost:' + config.port + '.');
//             // Open default browser at this address
//             opn('http://localhost:' + config.port);
//         });
// });

gulp.task('xampp', shell.task([
  'sudo xampp start'
]));

gulp.task('start-node-server', shell.task([
  "CONTEXT='local' nodemon server.js"
]));

//Can't get this to work with the ser
gulp.task('open-browser', function() {
  var options = {
    url: "http://localhost:8080",
    app: "google-chrome"
  };
  gulp.src("./dev/index.html")
  .pipe(open("", options));
});

gulp.task('watch-for-changes', function() {
    // this does not work for me without the client side script but I don't see that documented Arghhh :-/
    var server = livereload();
    // If html files are changed copy them to the dev folder
    gulp.watch(config.app.baseDir + '**/*.html').on('change', function (file) {
      // ??? why am I able to access server inside this callback ???
      runSequence(['copy-html-to-dev', 'copy-php-to-dev'], function() {
        server.changed(file.path);
      });
    }); 
    // If sass files are changed run sass task
    gulp.watch(config.app.styles + '**/*.scss').on('change', function (file) {
      // ??? why am I able to access server inside this callback ???
      runSequence('sass', function() {
        server.changed(file.path);
      });
    }); 
    // If js files are changed run scripts task
    gulp.watch(config.app.js + '**/*.js').on('change', function (file) {
      // ??? why am I able to access server inside this callback ??
      runSequence('lint', 'browserify', function() {
        server.changed(file.path);
      });
    }); 
});

// Build a dev version of the app and serve it locally 
gulp.task('server', function() {
    //run these subtasks in sequence
    //runSequence('clean-dev', ['sass', 'browserify', 'package-vendor-libs', 'copy-html-to-dev', 'copy-php-to-dev'], 'connect','watch-for-changes');
    // runSequence('clean-dev', ['sass', 'browserify', 'package-vendor-libs', 'copy-html-to-dev', 'copy-php-to-dev', 'copy-images-to-dev'],'watch-for-changes', 'start-node-server', 'open-browser');
    //runSequence('clean-dev', ['sass', 'browserify', 'package-vendor-libs', 'copy-html-to-dev', 'copy-php-to-dev', 'copy-images-to-dev'],'watch-for-changes', 'start-node-server');
    runSequence('clean-dev', ['sass', 'browserify', 'copy-html-to-dev', 'copy-php-to-dev', 'copy-images-to-dev', 'copy-fonts-to-dev'],'watch-for-changes', 'start-node-server');
});

//Copy necessary files to build dir
gulp.task('copy-to-build', function() {
    gulp.src(config.app.baseDir + '*.html')
      // Replace the script calls in index to pull in the concatenated and minified single js script
      //.pipe(replace('init.js','init.min.js'))
      .pipe(gulpIf(/index.html$/, replace('init.js','init.min.js')))
      .pipe(gulp.dest(config.build.baseDir));
    //copy the php files  
    gulp.src(config.app.baseDir + 'php/**/*.{php,html}')
      .pipe(gulp.dest(config.build.baseDir + 'php/'));
    // Copy css into build dir
    gulp.src(config.dev.styles + '**/*').pipe(gulp.dest(config.build.styles));

    // Copy unbrowserfied lib javascript into build dir
    //gulp.src([config.dev.js + 'libs.min.js', config.dev.js + 'libs.min.js.map']).pipe(gulp.dest(config.build.js));
    //gulp.src(config.dev.js + 'libs.min.js.map').pipe(gulp.dest(config.build.js));
})

// Build a production version of the app 
// I should be able to run build task without running server task first 
gulp.task('build', function() {
    runSequence('clean-build',['sass', 'browserify'], 'minify-js', 'copy-to-build', 'optimize-images' );
});

