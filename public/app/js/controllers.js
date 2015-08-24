var server = require('../server/server');
var uuid = require('node-uuid');

angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null
}

app.controller('cssBundleCtrl', ['$scope', '$css', function ($scope, $css) {
    // set the default bootswatch name
    var dbtheme = server.appsettingsdb.loadTheme();
    console.log('-----theme----');
    console.log(dbtheme);
    $scope.css = dbtheme == 'undefined' ? 'darkly' : dbtheme;
    // create the list of bootswatches
    $scope.bootstraps = [
        { name: 'Light (cosmo)', url: 'cosmo' },
        { name: 'Dark (darkly)', url: 'darkly' },
        { name: 'Material (paper)', url: 'paper' }
    ];

    $scope.CssCollection = [
        'css/material-design-color-palette.min.css',
        'css/animate.css',
        'lib/font-awesome/css/font-awesome.min.css',
        'lib/waves/waves.css',
        'css/booleanswitch.css',
        'lib/angular-ui-switch/switch.css',
        'lib/angular-hotkeys/build/hotkeys.css',
        'css/app.css'
    ];

    $scope.$watch('css', function (newval, oldval) {
        console.log('new css = ' + newval);
        if (newval == null) newval = 'darkly'; // default

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
        server.appsettingsdb.saveTheme(theme);
    }
}]);

app.controller('indexCtrl', ['$scope', 'hotkeys', function ($scope, hotkeys) {
    $scope.welcome = "eForms-nw.js";
    hotkeys.add({
        combo: 'shift+v',
        description: 'Create new VIN form',
        callback: function () { }
    });
}]);

app.controller('mainCtrl', ['$scope', '$state', 'hotkeys', function ($scope, $state, hotkeys) {
    $scope.today = new Date();
    $scope.format = 'M/d/yy h:mm:ss a';
}]);

app.controller('defaultCtrl', ['$scope', '$stateParams', '$state', function ($scope, $stateParams, $state) {
    console.log("Hello Default..!!");
    $scope.doctype = $stateParams.type;
    var newform = $stateParams.newform;
    $scope.tabs = [];

    $scope.$watch('tabs', function (nVal, oVal) {
        if ($scope.doctype === '') return;
        var active = $scope.tabs.filter(function (tab) {
            return tab.active;
        })[0];

        server.vindb.saveLocalActive(active);
    }, true);

    $scope.init = function () {
        if ($scope.doctype === '') return;
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

app.controller('openFormCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.recent = server.vindb.loadFormList();

    $scope.openForm = function (title) {
        var form = server.vindb.loadForm(title);
        server.vindb.saveLocalForm(form.id, form.form, form.type, form.title);
        $state.go('default', { type: 'VIN', newform: false });
    }

}]);
app.controller('applicationSettingsCtrl', ['$scope', 'hotkeys', function ($scope, hotkeys) {
    //TODO: application settings related code.

    //server.dumpDatabase();
}]);

app.controller('userSettingsCtrl', ['$scope', function ($scope) {
    //TODO: user settings related code.
}]);
app.controller('toolbarCtrl', ['$scope', function ($scope) {
    $scope.saveForm = server.vindb.saveForm;
    $scope.openForm = server.vindb.openForm;
}]);

app.controller('releaseNotesCtrl', ['$scope', function ($scope) {
    //TODO: user settings related code.
}]);
