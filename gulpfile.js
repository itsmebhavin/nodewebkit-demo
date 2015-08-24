var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('coreScripts', function() {
    return gulp.src(['public/app/js/app.js','public/app/js/window.js','public/app/js/directives.js','public/app/js/routing.js','public/app/js/controllers.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('pluginScripts', function() {
    return gulp.src(['bower_components/angular/angular.min.js'
                    ,'public/lib/angular-ui-bootstrap/ui-bootstrap-tpls.min.js'
                    ,'public/lib/angular/angular-animate.js'
                    ,'public/lib/angular/angular-ui-router.js'
                    ,'public/lib/angular/angular-mocks.js'
                    ,'public/lib/angular-ui-switch/switch.js'
                    ,'public/lib/waves/waves.js'
                    ,'bower_components/velocity/velocity.js'
                    ,'bower_components/velocity/velocity.ui.js'
                    ,'bower_components/angular-velocity/angular-velocity.js'
                    ,'bower_components/angular-auto-validate/dist/jcs-auto-validate.js'
                    ,'bower_components/angular-css/angular-css.js'
                    ,'public/lib/angular-hotkeys/build/hotkeys.js'
                ])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('vinForm', function() {
    return gulp.src(['public/forms/vin/js/controller.js'
                    ,'public/forms/vin/js/factories.js'
                    ,'public/forms/vin/js/directives.js'])
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
        'pluginScripts',
        'coreScripts',
        'vinForm',
        'asrForm'
    ]
);
