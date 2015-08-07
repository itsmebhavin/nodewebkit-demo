var server = require('../server/server');
app.controller('indexCtrl',['$scope','windowFactory',function($scope,windowFactory){
  $scope.welcome = "eForms-nw.js";
}]);
app.controller('mainCtrl',['$scope','$state',function($scope,$state){
  var uuid = require('node-uuid');
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
app.controller('defaultCtrl',['$scope','$stateParams',function($scope,$stateParams){
  $scope.hello = "Hello Default..!!";
  $scope.doctype = $stateParams.type;
  $scope.docid = $stateParams.docid;
}]);
