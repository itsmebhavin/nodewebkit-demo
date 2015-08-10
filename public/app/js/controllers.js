var server = require('../server/server');
var uuid = require('node-uuid');
app.controller('indexCtrl',['$scope','windowFactory',function($scope,windowFactory){
    $scope.welcome = "eForms-nw.js";
}]);
app.controller('mainCtrl',['$scope','$state',function($scope,$state){
    // console.log('inside main controller');
    $scope.today = new Date();
    server.usersdb.getAll();
    $scope.createNewVIN = function(){
        //var docid = uuid.v4();
        console.log('navigating to default page now.');
        $state.go('default',{type:'VIN',docid:uuid.v4()});
        // $state.go('home',{type:'VIN',docid:uuid.v4()});
    };
}]);
app.controller('defaultCtrl',['$scope','$stateParams', '$state' ,function($scope,$stateParams,$state){
    $scope.hello = "Hello Default..!!";
    $scope.doctype = $stateParams.type;
    $scope.docid = $stateParams.docid;


    $scope.tabs = [];

    $scope.addTab = function(type) {
        var d = new Date();
        var title = '' + type + ' - ' + d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + ' - ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        $scope.tabs.push({title: title, active:true, type:type});
    }
    $scope.removeTab = function(index) {
        $scope.tabs.splice(index, 1);
    }
}]);
