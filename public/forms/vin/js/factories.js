angular.module('vin.factories',[])
.factory('vinFactory',['$http','$q',function($scope,$q){
  var factory = {};
  factory.getLocalValidationRules = function(){
    var q = $q.defer();
    $http.get('./forms/vin/js/validation.json').then(function(json) {
        q.resolve(json.data);
    }, function(err) {
        q.reject(err)
    });
    return q.promise;
  }
  return factory;
})
