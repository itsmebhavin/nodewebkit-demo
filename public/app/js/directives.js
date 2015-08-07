angular.module('application.directives',[])
.directive('newCard',function(){
  return{
    transclude:true,
    scope:{
      cardcolor:'@',
      cardtitle:'@',
      cardcontent:'@',
      cardaction:'@',
      // cardactionclick:'&'
    },
    restrict:'E',
    templateUrl:'app/directive_tmpl/general/newcard.tmpl.html'
  }
})
.directive('wellCard',function(){
  return{
    transclude:true,
    scope:{
      label:'@',
      labelclass:'@',
      iconclass:'@',
      // isIncludelabel:'@',
      wellheader:'@',
      wellcontent:'@'
    },
    restrict:'E',
    templateUrl:'app/directive_tmpl/general/smallwell.tmpl.html'
  }
})
.directive('textboxWithLabel', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label:'@',
            id:'@',
            ngModel:'='
        },
        templateUrl:'app/directive_tmpl/form_controls/textboxwithlabel.tmpl.html'
    }
})
.directive('dropdownWithLabel',function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label:'@',
            id:'@',
            items:'=',
            setmodel:'&'
        },
        templateUrl: 'app/directive_tmpl/form_controls/dropdownwithlabel.tmpl.html',
        link: function(scope) {
            scope.updateLocal = function(item) {
                scope.selected = item;
            }
        }
    }
})
.directive('switchWithLabel', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label:'@',
            id:'@',
            on:'@',
            off:'@',
            ngModel:'='
        },
        templateUrl: 'app/directive_tmpl/form_controls/switchwithlabel.tmpl.html'
    }
})

// .directive('waveButton', function () {
//     return {
//         restrict: 'C',
//         link: function (scope, element) {
//             Waves.attach(element, ['waves-block','waves-button', 'waves-float']);
//             Waves.init();
//         }
//     }
// })
// .directive('waveIconButton', function () {
//     return {
//         restrict: 'C',
//         link: function (scope, element) {
//             Waves.attach(element, ['waves-circle','waves-block']);
//             Waves.init();
//         }
//     }
// });
