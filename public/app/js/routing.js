angular.module('application.routing',[])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main');
    $stateProvider
    .state('main', {
        url:'/main',
        templateUrl:'./app/views/main.html',
        controller: 'mainCtrl'
    })
    .state('home',{
        url:'/home',
        templateUrl:'./app/views/test.html'
    })
    .state('openform',{
        url:'/openform',
        templateUrl:'./app/views/openform.html',
        controller:'openFormCtrl'
    })
    .state('applicationsettings',{
        url:'/appsetting',
        templateUrl:'./app/views/applicationsettings.html',
        controller:'applicationSettingsCtrl'
    })
    .state('usersettings',{
      url:'/usersetting',
      templateUrl:'./app/views/usersettings.html',
      controller:'userSettingsCtrl'
    })
    .state('default',{
        url:'/default/:type/:newform',
        views:{
            '':{
                templateUrl: './app/views/default.html',
                controller:'defaultCtrl'
            },
            'toolbar@default':{
                templateUrl: './app/partial_views/toolbar.html',
                controller: 'toolbarCtrl'
            },
            'releasenotes@default':{
                templateUrl: './app/partial_views/releasenotes.html',
                controller:'releaseNotesCtrl'
            },
            'recentforms@default':{
                templateUrl: './app/partial_views/recentforms.html'
            },
            'vin@default':{
                templateUrl: './forms/vin/partial_views/vin_main.html',
                controller:'vinCtrl'
            },
            'asr@default':{
                templateUrl: './forms/asr/partial_views/asr_main.html',
                controller:'asrCtrl'
            }
        }

    });

}]);
