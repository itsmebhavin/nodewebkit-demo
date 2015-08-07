angular.module('application.routing',[])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
   $urlRouterProvider.otherwise('/main');
   $stateProvider
       .state('main', {
           url:'/main',
           templateUrl:'../public/app/views/main.html',
           controller: 'mainCtrl'
       })
       .state('home',{
         url:'/home/:type/:docid',
         templateUrl:'../public/app/views/default.html'
       })
       .state('default',{
         url:'/default/:type/:docid',
         views:{
           '':{
             templateUrl: '../public/app/views/default.html',
             controller:'defaultCtrl'
           },
           'toolbar@default':{
             templateUrl: '../public/app/partial_views/toolbar.html'
           },
           'forms@default':{
             templateUrl: '../public/vin/partial_views/vin_main.html'
           }
         }

       });
}]);
