var vinmodule = angular.module('application.vin',['jcs-autoValidate','vin.factories']);
vinmodule.controller('vinCtrl', ['$scope', '$http','vinFactory', function($scope, $http, vinFactory) {
    /* SETUP */
    console.log('inside vin controller');
    $scope.stateList = ['Alabama', 'Alaska', 'Arizona'];
    $scope.vehicleMakes = ['Acura', 'Ford', 'Mercedes'];
    $scope.vehicleModels = ['A', 'List', 'Item'];
    $scope.vinForm = {}
    $scope.validationOpened = false;

    //Retrieve local validation rules for Vin
    vinFactory.getLocalValidationRules().then(function(data){
        $scope.validation = data;
    },function(err){
        console.error(err);
    });
    /* END SETUP */

    /* HELPER FUNCTIONS */
    $scope.focusOn = function(id) {
        var el = document.getElementsByName(id)[0];
        console.log(el);
        el.focus();
        $scope.validationOpened = false;
    }
    /* END HELPER FUNCTIONS */
}]);
