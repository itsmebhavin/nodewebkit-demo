angular.module('application.asr',['jcs-autoValidate']).controller('asrCtrl', ['$scope', function($scope) {
    console.log('inside asr controller');

    $scope.title = "ASR"
    $scope.isCollapsed = true;

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
    $scope.panelClass = function() {
        if($scope.frm.$valid) {
            return 'panel-success';
        } else if (checkForErrors()) {
            return 'panel-danger';
        } else {
            return 'panel-warning';
        }
    }
    function checkForErrors() {
        var req = $scope.frm.$error.required;
        if(req === undefined) {
            return false;
        }
        var rl = req.length;
        for(var i = 0; i<rl; i++) {
            if(req[i].$name === '')
            continue;
            return true;
        }
        return false;
    }
}]);
