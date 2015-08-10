var asrmodule = angular.module('application.asr',[]);
asrmodule.controller('asrCtrl', ['$scope', function($scope) {
    console.log('inside asr controller');

    $scope.title = "ASR"
}]);
