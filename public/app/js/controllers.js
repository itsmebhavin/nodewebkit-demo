var server = require('../server/server');
var uuid = require('node-uuid');

angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null
}

angular.module('demoapp').controller('cssBundleCtrl', ['$scope', '$css', function ($scope, $css) {
    // set the default bootswatch name
    var dbtheme = server.appsettingsdb.loadTheme().then(function (theme) {
        localStorage.setItem('theme', theme);
    });
    $scope.css = localStorage.getItem('theme');

    // create the list of bootswatches
    $scope.bootstraps = [
        { name: 'Light (cosmo)', url: 'cosmo' },
        { name: 'Dark (darkly)', url: 'darkly' },
        { name: 'Material (paper)', url: 'paper' }
    ];

    $scope.CssCollection = [
        'css/material-design-color-palette.min.css',
        'lib/font-awesome/css/font-awesome.min.css',
        'lib/waves/waves.css',
        'css/booleanswitch.css',
        'lib/angular-ui-switch/switch.css',
        'lib/angular-hotkeys/build/hotkeys.css',
        'css/app.css'
    ];

    $scope.$watch('css', function (newval, oldval) {
        console.log('new css = ' + newval);
        if (newval == 'null') newval = 'darkly'; // default
        
        //remove old css collections
        $css.remove($scope.CssCollection);
        $css.remove([
            'css/bootstrap.darkly.min.css',
            'css/bootstrap.cosmo.min.css',
            'css/bootstrap.paper.min.css'
        ]);

        //prepare for new  css collections
        var newCssCollection = [];
        newCssCollection.push('css/bootstrap.' + newval + '.min.css');
        angular.forEach($scope.CssCollection, function (val) {
            newCssCollection.push(val);
        });
        //add new css collections
        $css.add(newCssCollection);
    })

    $scope.saveTheme = function (theme) {
        localStorage.setItem('theme', theme);
        server.appsettingsdb.saveTheme(theme).then(function (response) {
            if (response) {
                var notification = new Notification('NW.JS eForms', {
                    icon: "icon32.png",
                    body: "Theme changed successfully to - " + theme
                });
                notification.onclick = function () {
                    console.log("theme - Notification clicked");
                };
                notification.onshow = function () {
                    console.log('Show');
                    setTimeout(function () { notification.close(); }, 1000);
                };
            }
        });
    }
}]);

angular.module('demoapp').controller('indexCtrl', ['$scope', 'hotkeys', function ($scope, hotkeys) {
    $scope.welcome = "eForms-nw.js";
    hotkeys.add({
        combo: 'shift+v',
        description: 'Create new VIN form',
        callback: function () { }
    });
}]);

angular.module('demoapp').controller('mainCtrl', ['$scope', '$state', 'hotkeys', function ($scope, $state, hotkeys) {
    $scope.today = new Date();
    $scope.format = 'M/d/yy h:mm:ss a';
}]);

angular.module('demoapp').controller('defaultCtrl', ['$scope', '$stateParams', '$state', '$rootScope', function ($scope, $stateParams, $state, $rootScope) {
    $scope.doctype = $stateParams.type;
    var newform = $stateParams.newform;
    $scope.tabs = [];

    $rootScope.saveButtonStatus = false;

    $scope.$watch('tabs', function (nVal, oVal) {
        if ($scope.doctype === '') {
            return;
        };
        var active = $scope.tabs.filter(function (tab) {
            return tab.active;
        })[0];
        server.vindb.saveLocalActive(active);
    }, true);

    $scope.init = function () {
        if ($scope.doctype === '') {
            return;
        }
        var storedForms = server.vindb.loadLocalForms();
        angular.forEach(storedForms, function (form) {
            $scope.addTab(form.type, form.id, form.title, form.form);
        });
        console.log(newform);
        if (newform) {
            $scope.addTab($scope.doctype, uuid.v4());
        }
    }

    $scope.addTab = function (type, id, title, form) {
        if (!title) {
            var d = new Date();
            //form# format change
            d.setMonth(d.getMonth() + 1);
            title = d.getFullYear() + '' + addLeadingChars(d.getMonth()) + '' + addLeadingChars(d.getDate()) + '' + addLeadingChars(d.getHours()) + '' + addLeadingChars(d.getMinutes()) + '' + addLeadingChars(d.getSeconds()) + '' + type;
        }
        $scope.tabs.push({ title: title, active: true, type: type, id: id, form: form });
    }

    $scope.removeTab = function (index) {
        var formId = $scope.tabs[index].id;
        server.vindb.deleteLocalForm(formId);
        $scope.tabs.splice(index, 1);
    }

    $scope.init();

    function addLeadingChars(string, nrOfChars, leadingChar) {
        string = string + '';
        return Array(Math.max(0, (nrOfChars || 2) - string.length + 1)).join(leadingChar || '0') + string;
    }
}]);

angular.module('demoapp').controller('openFormCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.recent = server.vindb.loadFormList();
    $scope.selectedForm;
    $scope.selectedFormTitle;

    $scope.showFormDetails = function(title) {
        var formEntry = server.vindb.loadForm(title);
        $scope.selectedFormTitle = title;
        $scope.selectedForm = angular.fromJson(formEntry.form);
    }

    $scope.openForm = function (title) {
        var form = server.vindb.loadForm(title);
        server.vindb.saveLocalForm(form.id, form.form, form.type, form.title);
        $state.go('default', { type: 'VIN', newform: false });
    }

}]);

angular.module('demoapp').controller('applicationSettingsCtrl', ['$scope', 'hotkeys', function ($scope, hotkeys) {
    //TODO: application settings related code.

    //server.dumpDatabase();
}]);

angular.module('demoapp').controller('userSettingsCtrl', ['$scope', function ($scope) {
    //TODO: user settings related code.
}]);

angular.module('demoapp').controller('toolbarCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.saveForm = server.vindb.saveForm;
    $rootScope.saveButtonStatus = false;
}]);

angular.module('demoapp').controller('releaseNotesCtrl', ['$scope', function ($scope) {
    //TODO: user settings related code.
}]);