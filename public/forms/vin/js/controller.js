var vinmodule = angular.module('application.vin',['jcs-autoValidate']);

vinmodule.controller('vinCtrl', ['$scope', '$http', function($scope, $http) {
    /* SETUP */
    console.log('inside vin controller');
    $scope.stateList = ['Alabama', 'Alaska', 'Arizona'];
    $scope.vehicleMakes = ['Acura', 'Ford', 'Mercedes'];
    $scope.vehicleModels = ['A', 'List', 'Item'];
    $scope.vinForm = {}
    $scope.validationOpened = false;

    $http.get('./forms/vin/js/validation.json').then(function(json) {
        $scope.validation = json.data;
        console.log($scope.validation);
    }, function(err) {
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
