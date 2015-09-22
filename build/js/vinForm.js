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

(function (angular) {
    angular.module('vin.directives', [])
    .directive('validation', function ($templateCache) {
        return {
            transclude: true,
            scope: {
                panelheadertext: '@',
                ngClass: '&',
                form: '=',
                validationrules: '=',
                focusOnFn: '&'
            },
            restrict: 'E',
            //templateUrl: 'forms/vin/directive_tmpl/validation.tmpl.html'
            template: $templateCache.get('validation.tmpl.html')
        }
    })
}(angular));

(function(angular){
    angular.module('vin.factories',[])
    .factory('vinFactory',['$http','$q',function($http,$q){
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
    }])
    .factory('warningModifier', [function() {
        var pattern = new RegExp("Warning");

        var reset = function (el) {
            angular.forEach(el.find('span'), function (spanEl) {
                spanEl = angular.element(spanEl);
                if (spanEl.hasClass('error-msg') || spanEl.hasClass('form-control-feedback') || spanEl.hasClass('control-feedback')) {
                    spanEl.remove();
                }
            });
            el.removeClass('has-success has-error has-feedback has-warning');
        },
        findWithClassElementAsc = function (el, klass) {
            var returnEl,
            parent = el;
            for (var i = 0; i <= 10; i += 1) {
                if (parent !== undefined && parent.hasClass(klass)) {
                    returnEl = parent;
                    break;
                } else if (parent !== undefined) {
                    parent = parent.parent();
                }
            }

            return returnEl;
        },
        findWithClassElementDesc = function (el, klass) {
            var child;
            for (var i = 0; i < el.children.length; i += 1) {
                child = el.children[i];
                if (child !== undefined && angular.element(child).hasClass(klass)) {
                    break;
                } else if (child.children !== undefined) {
                    child = findWithClassElementDesc(child, klass);
                    if (child.length > 0) {
                        break;
                    }
                }
            }

            return angular.element(child);
        },
        findFormGroupElement = function (el) {
            return findWithClassElementAsc(el, 'form-group');
        },
        findInputGroupElement = function (el) {
            return findWithClassElementDesc(el, 'input-group');
        },
        insertAfter = function (referenceNode, newNode) {
            referenceNode[0].parentNode.insertBefore(newNode[0], referenceNode[0].nextSibling);
        },
        makeValid = function (el) {
            var frmGroupEl = findFormGroupElement(el),
            inputGroupEl;

            if (frmGroupEl) {
                reset(frmGroupEl);
                inputGroupEl = findInputGroupElement(frmGroupEl[0]);
                frmGroupEl.addClass('has-success ' + (inputGroupEl.length > 0 ? '' : 'has-feedback'));
            } else {
                $log.error('Angular-auto-validate: invalid bs3 form structure elements must be wrapped by a form-group class');
            }
        },
        makeInvalid = function (el, errorMsg) {
            var frmGroupEl = findFormGroupElement(el),
            helpTextEl = angular.element('<span class="help-block has-error error-msg">' + errorMsg + '</span>'),
            inputGroupEl;

            if (frmGroupEl) {
                reset(frmGroupEl);
                inputGroupEl = findInputGroupElement(frmGroupEl[0]);
                if(pattern.test(errorMsg)) {
                    frmGroupEl.addClass('has-warning ' + (inputGroupEl.length > 0 ? '' : 'has-feedback'));
                } else {
                    frmGroupEl.addClass('has-error ' + (inputGroupEl.length > 0 ? '' : 'has-feedback'));
                }
                insertAfter(inputGroupEl.length > 0 ? inputGroupEl : el, helpTextEl);
            } else {
                $log.error('Angular-auto-validate: invalid bs3 form structure elements must be wrapped by a form-group class');
            }
        },
        makeDefault = function (el) {
            var frmGroupEl = findFormGroupElement(el);
            if (frmGroupEl) {
                reset(frmGroupEl);
            } else {
                $log.error('Angular-auto-validate: invalid bs3 form structure elements must be wrapped by a form-group class');
            }
        };

        return {
            makeValid:makeValid,
            makeInvalid:makeInvalid,
            makeDefault:makeDefault,
            key:'warningModifierKey'
        };
    }]);
}(angular))
