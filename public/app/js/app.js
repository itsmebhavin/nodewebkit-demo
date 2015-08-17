var app = angular.module('demoapp',[
    'ui.router',
    'ngAnimate',
    'components.window',
    'application.routing',
    'application.directives',
    'application.vin',
    'application.asr',
    'ui.bootstrap',
    'uiSwitch',
    'angular-velocity',
    'pageslide-directive',
    'door3.css'
])
.run(['$window','$rootScope',function($window, $rootScope) {
    $rootScope.online = navigator.onLine;

    $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);
}]);
