var server = require('../server/server');

angular.module('application.vin', [
    'jcs-autoValidate',
    'vin.factories',
    'vin.directives',
    'vin.templates'
]);

angular.module('application.vin').run(['defaultErrorMessageResolver', 'validator', 'warningModifier', function(defaultErrorMessageResolver, validator, warningModifier) {
    defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
        errorMessages['minLengthWarning'] = 'Warning: Should be at least {0} characters';
    });
    validator.registerDomModifier(warningModifier.key, warningModifier);
    validator.setDefaultElementModifier(warningModifier.key);
}]);

angular.module('application.vin').controller('vinCtrl', ['$scope', '$http','vinFactory', '$timeout', function($scope, $http, vinFactory, $timeout) {
    /* SETUP */
    console.log('inside vin controller');
    $scope.stateList = ['AL', 'AK', 'AR'];
    $scope.vehicleMakes = ['Acura', 'Ford', 'Mercedes'];
    $scope.vehicleModels = ['A', 'List', 'Item'];
    $scope.vinForm = {};
    $scope.isCollapsed = true;
    $scope.tab = $scope.$parent.tab;
    var formId = $scope.tab.form.formInfo.id;
    var formType = $scope.tab.form.formInfo.type;
    var formTitle = $scope.tab.form.formInfo.title;
    console.log(formId);

    // If exists, load existing form
    if($scope.$parent.tab.form.form !== null) {
        // $scope.vinForm = angular.fromJson($scope.tab.form.form);
        $scope.vinForm = $scope.tab.form.form;
    }

    // Retrieve local validation rules for VIN
    vinFactory.getLocalValidationRules().then(function(data) {
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
    $scope.$watchCollection('vinForm', function(val) { // Data bindings for elements in form
        server.vindb.saveLocalForm($scope.tab.form.formInfo, val);
    });
    $scope.panelClass = function() {
        if($scope.vinFrm.$valid) {
            $scope.tab.form.formInfo.validity = "valid";
            return 'panel-success';
        } else if (checkForErrors()) {
            $scope.tab.form.formInfo.validity = "invalid";
            return 'panel-danger';
        } else {
            $scope.tab.form.formInfo.validity = "warning";
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
