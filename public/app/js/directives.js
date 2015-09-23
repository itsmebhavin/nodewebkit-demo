angular.module('application.directives', [])
.directive('newCard', function ($templateCache) {
    return {
        transclude: true,
        scope: {
            cardcolor: '@',
            cardtitle: '@',
            cardcontent: '@',
            cardaction: '@',
            // cardactionclick:'&'
        },
        restrict: 'E',
        //templateUrl: 'app/directive_tmpl/general/newcard.tmpl.html'
        template: $templateCache.get('newcard.tmpl.html')
    }
})

.directive('winresize', function ($window) {
    return function (scope, element, attr) {

        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'h': window.innerHeight,
                'w': window.innerWidth
            };
        }, function (newValue, oldValue) {
            console.log(newValue, oldValue);
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.resizeWithOffset = function (offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})
.directive('wellCard', function ($templateCache) {
    return {
        transclude: true,
        scope: {
            label: '@',
            labelclass: '@',
            iconclass: '@',
            wellheader: '@',
            wellcontent: '@'
        },
        restrict: 'E',
        template: $templateCache.get('smallwell.tmpl.html')
        //templateUrl: 'app/directive_tmpl/general/smallwell.tmpl.html'
    }
})
.directive('uppercased', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform", "uppercase");
        }
    }
})
.directive('textboxWithLabel', function ($templateCache) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            placeholder: '@',
            ngMinlength: '=',
            ngMaxlength: '=',
            required: '@',
            ngModel: '=',
            ngModelOptions: '=',
            ngMinlengthErrType: '@',
            static: '@',
            type: '@'
        },
        //templateUrl: 'app/directive_tmpl/form_controls/textboxwithlabel.tmpl.html',
        template: $templateCache.get('textboxwithlabel.tmpl.html'),
        link: function (scope, element, attrs) {
            if (attrs.required === undefined) {
                attrs.required = false;
            }
            if (attrs.static === undefined) {
                attrs.static = false;
            }
        }
    }
})
.directive('dropdownWithLabel', function ($templateCache) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            items: '=',
            ngModel: '=',
            required: '@'
        },
        //templateUrl: 'app/directive_tmpl/form_controls/dropdownwithlabel.tmpl.html',
        template: $templateCache.get('dropdownwithlabel.tmpl.html'),
        link: function (scope, element, attrs) {
            if (attrs.required === undefined) {
                attrs.required = false;
            }
        }
    }
})
.directive('switchWithLabel', function ($templateCache) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            on: '@',
            off: '@',
            required: '@',
            ngModel: '='
        },
        //templateUrl: 'app/directive_tmpl/form_controls/switchwithlabel.tmpl.html',
        template: $templateCache.get('switchwithlabel.tmpl.html'),
        link: function (scope, element, attrs) {
            if (attrs.required === undefined) {
                attrs.required = false;
            }
        }
    }
})
.directive('sortableTab', function ($timeout, $document) {
    return {
        link: function (scope, element, attrs, controller) {
            // Attempt to integrate with ngRepeat
            // https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
            var match = attrs.ngRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            var tabs;
            scope.$watch(match[2], function (newTabs) {
                tabs = newTabs;
            });

            var index = scope.$index;
            scope.$watch('$index', function (newIndex) {
                index = newIndex;
            });

            attrs.$set('draggable', true);

            // Wrapped in $apply so Angular reacts to changes
            var wrappedListeners = {
                // On item being dragged
                dragstart: function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.dropEffect = 'move';
                    e.dataTransfer.setData('application/json', index);
                    element.addClass('dragging');
                },
                dragend: function (e) {
                    //e.stopPropagation();
                    element.removeClass('dragging');
                },

                // On item being dragged over / dropped onto
                dragenter: function (e) {
                },
                dragleave: function (e) {
                    element.removeClass('hover');
                },
                drop: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var sourceIndex = e.dataTransfer.getData('application/json');
                    move(sourceIndex, index);
                    element.removeClass('hover');
                }
            };

            // For performance purposes, do not
            // call $apply for these
            var unwrappedListeners = {
                dragover: function (e) {
                    e.preventDefault();
                    element.addClass('hover');
                },
                /* Use .hover instead of :hover. :hover doesn't play well with
                moving DOM from under mouse when hovered */
                mouseenter: function () {
                    element.addClass('hover');
                },
                mouseleave: function () {
                    element.removeClass('hover');
                }
            };

            angular.forEach(wrappedListeners, function (listener, event) {
                element.on(event, wrap(listener));
            });

            angular.forEach(unwrappedListeners, function (listener, event) {
                element.on(event, listener);
            });

            function wrap(fn) {
                return function (e) {
                    scope.$apply(function () {
                        fn(e);
                    });
                };
            }

            function move(fromIndex, toIndex) {
                // http://stackoverflow.com/a/7180095/1319998
                tabs.splice(toIndex, 0, tabs.splice(fromIndex, 1)[0]);
            };

        }
    }
})
.directive('myCurrentTime', ['$interval', 'dateFilter',
function ($interval, dateFilter) {
    return function (scope, element, attrs) {
        var format,  // date format
        stopTime; // so that we can cancel the time updates

        // used to update the UI
        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }

        // watch the expression, and update the UI on change.
        scope.$watch(attrs.myCurrentTime, function (value) {
            format = value;
            updateTime();
        });

        stopTime = $interval(updateTime, 1000);

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time after the DOM element was removed.
        element.on('$destroy', function () {
            $interval.cancel(stopTime);
        });
    }
}]);
