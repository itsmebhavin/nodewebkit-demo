var server = require('../server/server');

var vinmodule = angular.module('application.vin',['jcs-autoValidate','vin.factories']);

vinmodule.factory('warningModifier', [function() {
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

    // var pattern = new RegExp("Warning");
    // var makeValid = function(el) {
    //     var el = el[0];
    //     el.style.backgroundColor = '';
    // }
    // var makeInvalid = function(el, err) {
    //     var el = el[0];
    //     if(pattern.test(err)) {
    //         el.style.backgroundColor = 'yellow';
    //     } else {
    //         el.style.backgroundColor = 'red';
    //     }
    // }
    // var makeDefault = function(el) {
    //     var el = el[0];
    //     el.style.backgroundColor = '';
    // }

    return {
        makeValid:makeValid,
        makeInvalid:makeInvalid,
        makeDefault:makeDefault,
        key:'warningModifierKey'
    };
}]);

vinmodule.run(['defaultErrorMessageResolver', 'validator', 'warningModifier', function(defaultErrorMessageResolver, validator, warningModifier) {
    defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
        errorMessages['minLengthWarning'] = 'Warning: Should be at least {0} characters';
    });
    validator.registerDomModifier(warningModifier.key, warningModifier);
    validator.setDefaultElementModifier(warningModifier.key);
}]);

vinmodule.controller('vinCtrl', ['$scope', '$http','vinFactory', function($scope, $http, vinFactory) {
    /* SETUP */
    console.log('inside vin controller');
    $scope.stateList = ['Alabama', 'Alaska', 'Arizona'];
    $scope.vehicleMakes = ['Acura', 'Ford', 'Mercedes'];
    $scope.vehicleModels = ['A', 'List', 'Item'];
    $scope.vinForm = {};
    $scope.isCollapsed = true;
    var formId = $scope.$parent.tab.id;
    var formType = $scope.$parent.tab.type;
    var formTitle = $scope.$parent.tab.title;

    // If exists, load existing form
    if($scope.$parent.tab.form !== null) {
        $scope.vinForm = angular.fromJson($scope.$parent.tab.form);
    }

    // Retrieve local validation rules for Vin
    vinFactory.getLocalValidationRules().then(function(data){
        $scope.validation = data;
    },function(err) {
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
    $scope.$watchCollection('vinForm', function(nVal, oVal) {
        server.vindb.saveLocalForm(formId, angular.toJson(nVal), formType, formTitle);
    });
    /* END HELPER FUNCTIONS */
}]);
