var gulp = require('gulp');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var gutil = require('gulp-util');
var NwBuilder = require('nw-builder');
var templateCache = require('gulp-angular-templatecache');

/*
  gulp nw
  Description: for creating installer .exe
*/
gulp.task('nw', function () {
    var nw = new NwBuilder({
        appName: 'nwjsapp',
        files: [
            "package.json",
            "./build/**/*",
            "./public/**/*",
            "./server/**/*",
            "./node_modules/lokijs/**/*",
            "./node_modules/node-uuid/**/*",
            "./node_modules/q/**/*",
            "bower.json",
            "loki.json",
            "run.bat"
        ],
        platforms: ["win32", "win64"],
        version: "0.12.3"
    })
    // Log stuff you want
    nw.on('log', function (msg) {
        console.log('nw-builder:' + msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        console.log('nw-builder:' + err);
    });
});

gulp.task('coreTemplates', function () {
    gulp.src([
        'public/app/directive_tmpl/form_controls/*.html',
        'public/app/directive_tmpl/general/*.html',
    ])
      .pipe(templateCache('coreTemplates.js', {
          standalone: true,
          module: 'application.templates'
      }))
      .pipe(gulp.dest('build/js/'));
});

gulp.task('coreScripts', function () {
    return gulp.src('public/app/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('coreHtmlMin', function () {
    return gulp.src([
        'public/app/directive_tmpl/form_controls/*.html',
        'public/app/directive_tmpl/general/*.html',
        'public/app/partial_views/*.html'
    ])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/html/core'));
});


gulp.task('pluginScripts', function () {
    return gulp.src(['bower_components/angular/angular.min.js'
                    , 'public/lib/angular-ui-bootstrap/ui-bootstrap-tpls.min.js'
                    , 'public/lib/angular/angular-animate.js'
                    , 'public/lib/angular/angular-ui-router.js'
                    , 'public/lib/angular/angular-mocks.js'
                    , 'public/lib/angular-ui-switch/switch.js'
                    , 'public/lib/waves/waves.js'
                    , 'bower_components/velocity/velocity.js'
                    , 'bower_components/velocity/velocity.ui.js'
                    , 'bower_components/angular-velocity/angular-velocity.js'
                    , 'bower_components/angular-auto-validate/dist/jcs-auto-validate.js'
                    , 'bower_components/angular-css/angular-css.js'
                    , 'public/lib/angular-hotkeys/build/hotkeys.js'
                    , 'public/lib/ng-pageslide/angular-pageslide.js'
    ])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('vinForm', function () {
    return gulp.src('public/forms/vin/js/*.js')
        .pipe(concat('vinForm.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('vinTemplates', function () {
    gulp.src([
        'public/forms/vin/directive_tmpl/*.html'
    ])
      .pipe(templateCache('vinTemplates.js', {
          standalone: true,
          module: 'vin.templates'
      }))
      .pipe(gulp.dest('build/js/'));
});

gulp.task('vinHtmlMin', function () {
    return gulp.src([
        'public/forms/vin/partial_views/*.html',
        'public/forms/vin/directive_tmpl/*.html'
    ])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/html/vin'));
});

gulp.task('asrForm', function () {
    return gulp.src('public/forms/asr/js/*.js')
        .pipe(concat('asrForm.js'))
        .pipe(gulp.dest('build/js'));
});


gulp.task('asrHtmlMin', function () {
    return gulp.src([
        'public/forms/asr/partial_views/*.html',
        'public/forms/asr/directive_tmpl/*.html'
    ])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/html/asr'));
})

gulp.task('default',
    [
        //Html
        'coreHtmlMin',
        'vinHtmlMin',
        'asrHtmlMin',
        //JS
        'pluginScripts',
        'coreTemplates',
        'coreScripts',
        'vinForm',
        'vinTemplates',
        'asrForm'
    ]
);

gulp.task('watch', function() {
    gulp.watch('./public/**/*', ['default']);
    gulp.watch('./server/**/*', ['default']);
});
