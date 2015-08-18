(function(angular){
  angular.module('vin.directives',[])
  .directive('validation',function(){
    return{
      transclude : true,
      scope : {
          panelheadertext : '@',
          ngClass : '&',
          form : '=',
          validationrules : '='
      },
      restrict:'E',
      templateUrl:'forms/vin/directive_tmpl/validation.tmpl.html'
    }
  })
}(angular));
