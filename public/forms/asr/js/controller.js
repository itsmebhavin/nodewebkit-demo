var asrmodule = angular.module('application.asr',['jcs-autoValidate']);
asrmodule.controller('asrCtrl', ['$scope', function($scope) {
    console.log('inside asr controller');

    $scope.title = "ASR"

    $scope.stateList = ['Alabama', 'Alaska', 'Arizona'];
    $scope.setVehicleMake = function(item) {
        $scope.vinForm.vehicleMake = item;
    }

    $scope.submit = function() {
        alert($scope.isFormValid($scope.frm))
    }

    $scope.isFormValid = function(form) {
        var keys = Object.keys(form);
        var key;
        for(var i = 0; i < keys.length; i++) {
            key = keys[i];
            if(form[key] !== undefined && form[key].$invalid) {
                return false;
            }
        }
        return true;
    }
}]);
