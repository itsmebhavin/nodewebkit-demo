var vinmodule = angular.module('application.vin',[]);
vinmodule.controller('vinCtrl', ['$scope', function($scope) {
    console.log('inside vin controller');
    $scope.stateList = ['Alabama', 'Alaska', 'Arizona'];
    $scope.vehicleMakes = ['Acura', 'Ford', 'Mercedes'];
    $scope.vehicleModels = ['A', 'List', 'Item'];
    $scope.vinForm = {}

    $scope.setVehicleMake = function(item) {
        $scope.vinForm.vehicleMake = item;
    }
    $scope.setStateTitle = function(item) {
        $scope.vinForm.stateTitle = item;
    }
    $scope.setVehicleModel = function(item) {
        $scope.vinForm.vehicleModel = item;
    }
}]);
