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
