var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('coreScripts', function() {
    return gulp.src(['public/app/js/app.js','public/app/js/window.js','public/app/js/directives.js','public/app/js/routing.js','public/app/js/controllers.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('pluginScripts', function() {
    return gulp.src(['bower_components/angular/angular.min.js',
                    'public/lib/angular-ui-bootstrap/ui-bootstrap-tpls.min.js',
                    'public/lib/angular/angular-animate.js',
                    'public/lib/angular/angular-ui-router.min.js',
                    'public/lib/angular/angular-mocks.js',
                    'public/lib/angular-ui-switch/switch.js',
                    'public/lib/waves/waves.js',
                    'bower_components/velocity/velocity.min.js',
                    'bower_components/velocity/velocity.ui.min.js',
                    'bower_components/angular-velocity/angular-velocity.min.js',
                    'public/lib/ng-pageslide/ng-pageslide.js',
                    'bower_components/angular-auto-validate/dist/jcs-auto-validate.min.js',
                    'bower_components/angular-css/angular-css.min.js',
                    'public/lib/angular-hotkeys/build/hotkeys.min.js'])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('vinForm', function() {
    return gulp.src(['public/forms/vin/js/controller.js',
                    'public/forms/vin/js/factories.js',
                    'public/forms/vin/js/directives.js'])
        .pipe(concat('vinForm.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('asrForm', function() {
    return gulp.src(['public/forms/asr/js/controller.js'])
        .pipe(concat('asrForm.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('default',
    [
        'coreScripts',
        'vinForm',
        'asrForm'
    ]
);
