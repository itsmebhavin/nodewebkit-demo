var server = require('../server/server');

var vinmodule = angular.module('application.vin',['jcs-autoValidate','vin.factories','vin.directives']);

vinmodule.run(['defaultErrorMessageResolver', 'validator', 'warningModifier', function(defaultErrorMessageResolver, validator, warningModifier) {
    defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
        errorMessages['minLengthWarning'] = 'Warning: Should be at least {0} characters';
    });
    validator.registerDomModifier(warningModifier.key, warningModifier);
    validator.setDefaultElementModifier(warningModifier.key);
}]);

vinmodule.controller('vinCtrl', ['$scope', '$http','vinFactory', '$timeout', function($scope, $http, vinFactory, $timeout) {
    /* SETUP */
    console.log('inside vin controller');
    $scope.stateList = ['Alabama', 'Alaska', 'Arizona'];
    $scope.vehicleMakes = ['Acura', 'Ford', 'Mercedes'];
    $scope.vehicleModels = ['A', 'List', 'Item'];
    $scope.vinForm = {};
    $scope.isCollapsed = true;
    var formId = $scope.$parent.tab.id;
    var formType = $scope.$parent.tab.type;
    var formTitle = $scope.$parent.tab.title;

    // If exists, load existing form
    if($scope.$parent.tab.form !== null) {
        $scope.vinForm = angular.fromJson($scope.$parent.tab.form);
    }

    // Retrieve local validation rules for VIN
    vinFactory.getLocalValidationRules().then(function(data){
        $scope.validation = data;
    },function(err) {
        console.error(err);
    });
    /* END SETUP */

    /* HELPER FUNCTIONS */
    $scope.focusOn = function(id) {
        var el = document.getElementsByName(id)[0];
        el.focus();
        // $scope.isCollapsed = true;
    }
    $scope.submitForm = function() {
        alert('test');
    }
    $scope.$watchCollection('vinForm', function(nVal, oVal) {
        server.vindb.saveLocalForm(formId, angular.toJson(nVal), formType, formTitle);
    });
    $scope.panelClass = function() {
        if($scope.vinFrm.$valid) {
            return 'panel-success';
        } else if (checkForErrors()) {
            return 'panel-danger';
        } else {
            return 'panel-warning';
        }
    }
    function checkForErrors() {
        var req = $scope.vinFrm.$error.required;
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
    /* END HELPER FUNCTIONS */
}]);
