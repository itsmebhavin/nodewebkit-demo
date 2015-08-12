var server = require('../server/server');
var uuid = require('node-uuid');
angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null
}
app.controller('cssBundleCtrl',['$scope','$css',function($scope,$css){
  // set the default bootswatch name
  $scope.css = angular.isUndefinedOrNull(localStorage['theme'])? localStorage['theme'] :'darkly';
  // create the list of bootswatches
  $scope.bootstraps = [
    { name: 'Light (cosmo)', url: 'cosmo' },
    { name: 'Dark (darkly)', url: 'darkly' },
    { name: 'Material (paper)', url: 'paper' }
  ];

  $scope.CssCollection = [
    'css/material-design-color-palette.min.css',
    'css/app.css',
    'css/animate.css',
    'lib/font-awesome/css/font-awesome.min.css',
    'lib/waves/waves.css',
    'css/booleanswitch.css',
    'lib/angular-ui-switch/switch.css'
  ];

  $scope.$watch('css',function(newval, oldval){
    console.log('new css = ' + newval);
    localStorage['theme'] = newval;

    $css.remove($scope.CssCollection);
    $css.remove(['css/bootstrap.darkly.min.css','css/bootstrap.cosmo.min.css','css/bootstrap.paper.min.css']);

    var newCssCollection = [];
    newCssCollection.push('css/bootstrap.' + newval + '.min.css');
    angular.forEach($scope.CssCollection,function(val){
      newCssCollection.push(val);
    })

    console.log(newCssCollection);
    $css.add(newCssCollection);
  })




}]);
app.controller('indexCtrl',['$scope','windowFactory',function($scope,windowFactory){
  $scope.welcome = "eForms-nw.js";
}]);
app.controller('mainCtrl',['$scope','$state',function($scope,$state){
  $scope.today = new Date();
  server.usersdb.getAll();
  $scope.createNewVIN = function(){
    console.log('navigating to default page now.');
    $state.go('default',{type:'VIN',docid:uuid.v4()});
  };
}]);
app.controller('defaultCtrl',['$scope','$stateParams', '$state' ,function($scope,$stateParams,$state){
  $scope.hello = "Hello Default..!!";
  $scope.doctype = $stateParams.type;
  $scope.docid = $stateParams.docid;
  $scope.tabs = [];


  $scope.init = function() {
    $scope.addTab($scope.doctype);
  }

  $scope.addTab = function(type) {
    var d = new Date();
    var title = '' + type + ' - ' + d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + ' - ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    $scope.tabs.push({title: title, active:true, type:type});
  }
  $scope.removeTab = function(index) {
    $scope.tabs.splice(index, 1);
  }


  $scope.init();
}]);
app.controller('applicationSettingsCtrl',['$scope','$rootScope',function($scope, $rootScope){
  $rootScope.myTheme = 'darkly';
  //  $rootScope.$watch('myTheme', function(value) {
  //    if (value != undefined) {
  //      $rootScope.myTheme = value;
  //    }
  //  });

}])
