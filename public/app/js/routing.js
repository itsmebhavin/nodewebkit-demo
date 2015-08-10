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
    .state('default',{
        url:'/default/:type/:docid',
        views:{
            '':{
                templateUrl: './app/views/default.html',
                controller:'defaultCtrl'
            },
            'toolbar@default':{
                templateUrl: './app/partial_views/toolbar.html'
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
