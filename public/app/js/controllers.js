var server = require('../server/server');
var uuid = require('node-uuid');

angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null
}
angular.module('demoapp').controller('checkUpdatesCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    // Check for updates controller.
    $scope.version = $rootScope.currentVersion;
    $scope.checkForUpdates = function () {
        server.appsettingsdb.checkUpdates($scope.version, false)
            .then(function (result) {
                console.log(result);
            });
    }
}]);
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

angular.module('demoapp').controller('defaultCtrl', ['$scope', '$stateParams', '$state', function ($scope, $stateParams, $state) {
    console.log("Hello Default..!!");
    $scope.doctype = $stateParams.type;
    var newform = $stateParams.newform;
    $scope.tabs = [];

    $scope.$watch('tabs', function (nVal, oVal) {
        if ($scope.doctype === '') return;
        var active = $scope.tabs.filter(function (tab) {
            return tab.active;
        })[0];
        try {
            server.vindb.saveLocalActive(active.form.formInfo.id);
        } catch (e) {
            server.vindb.saveLocalActive(0);
        }
    }, true);

    $scope.init = function () {
        if ($scope.doctype === '') return;
        var storedForms = server.vindb.loadLocalForms();
        angular.forEach(storedForms, function (form) {
            // $scope.addTab(form.type, form.id, form.title, form.form);
            $scope.addTab(form);
        });
        if (newform == 'true') {
            // $scope.addTab($scope.doctype, uuid.v4());
            $scope.addTab({ formInfo: { type: $scope.doctype }, form: {} })
        }
    }

    // $scope.addTab = function (type, id, title, form) {
    $scope.addTab = function (form) {
        if (form.constructor === String) {
            var formType = form;
            form = {
                formInfo: { type: formType },
                form: {}
            }
        }
        if (!form.formInfo.title) {
            form.formInfo.id = uuid.v4();
            var d = new Date();
            //form# format change
            d.setMonth(d.getMonth() + 1);
            title = d.getFullYear() + '' + addLeadingChars(d.getMonth()) + '' + addLeadingChars(d.getDate()) + '' + addLeadingChars(d.getHours()) + '' + addLeadingChars(d.getMinutes()) + '' + addLeadingChars(d.getSeconds()) + '' + form.formInfo.type;
            form.formInfo.title = title;
        }
        // $scope.tabs.push({ title: title, active: true, type: type, id: id, form: form });
        $scope.tabs.push({ active: true, form: form });
    }
    $scope.removeTab = function (index) {
        var formId = $scope.tabs[index].form.formInfo.id;
        console.log(formId);
        server.vindb.deleteLocalForm(formId);
        $scope.tabs.splice(index, 1);
    }

    $scope.init();
    function addLeadingChars(string, nrOfChars, leadingChar) {
        string = string + '';
        return Array(Math.max(0, (nrOfChars || 2) - string.length + 1)).join(leadingChar || '0') + string;
    }
}]);

angular.module('demoapp').controller('openFormLocalCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.recent = server.vindb.loadFormList();
    $scope.selectedForm;
    $scope.selectedFormTitle;

    $scope.showFormDetails = function (title) {
        var formEntry = server.vindb.loadForm(title);
        $scope.selectedFormTitle = formEntry.formInfo.title;
        $scope.selectedForm = angular.fromJson(formEntry.form);
    }

    $scope.openForm = function (title) {
        var form = server.vindb.loadForm(title);
        server.vindb.saveLocalForm(form.formInfo, form.form);
        $state.go('default', { type: 'VIN', newform: false });
    }

}]);
angular.module('demoapp').controller('openFormServerCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.documents;
    $scope.selectedForm;

    server.remotedb.loadFormsForUser('zm0307').then(function (data) {
        $scope.documents = data;
    });

    $scope.openForm = function (docId) {
        server.remotedb.loadForm(docId).then(function (data) {
            var form = {
                form: {
                    vin: data.vehicle.Vin,
                    stateTitle: data.form.TitleState,
                    titleCourt: data.form.IsTitleorCourtNum == 'T',
                    titleCourtOrderNum: data.form.TitleOrCourtNum,
                    inspectionDateTime: data.form.InspectionDateTime,
                    verifyingAgency: null,
                    workPhone: data.form.WorkPhone,
                    vehicleYear: data.vehicle.Year,
                    vehicleMake: data.vehicle.Make,
                    vehicleModel: data.vehicle.Model,
                    vehicleColor: data.vehicle.Color,
                    officerName: data.info.OffcerName,
                    badgeID: null,
                    feeCollected: data.form.Is25FeeCollected
                },
                formInfo: {
                    id: data.info.DocumentID,
                    title: data.info.TicketNum,
                    createDate: data.info.CreateDate,
                    finalized: data.info.Finalized,
                    finalizedDate: data.info.FinalizedDate,
                    transferred: data.info.Transferred,
                    transferredDate: data.info.TransferredDate,
                    type: 'VIN',
                    lastModifiedDate: data.info.LastModifiedDate
                },
            }
            console.log(form);
            server.vindb.saveLocalForm(form.formInfo, form.form);
            $state.go('default', { type: 'VIN', newform: false });
        }, function (err) {
            console.log("openForm: " + err);
        });
    }


    $scope.showFormDetails = function (doc) {
        $scope.selectedForm = doc;
    }
}]);
angular.module('demoapp').controller('applicationSettingsCtrl', ['$scope', 'hotkeys', function ($scope, hotkeys) {
    //TODO: application settings related code.
}]);

angular.module('demoapp').controller('userSettingsCtrl', ['$scope', function ($scope) {
    //TODO: user settings related code.
}]);
angular.module('demoapp').controller('toolbarCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.saveForm = server.vindb.saveForm;
    $scope.finalizeForm = function (finalize) {
        var ret = server.vindb.finalizeForm(finalize);
        if (ret === 'Invalid') console.log("Invalid Form, not finalized");
    }
    $scope.openTransferPanel = function () {
        $rootScope.$broadcast('openTransferPanel', {});
    }
    $scope.printForm = function () {
        server.vindb.printReport();
    }
}]);
angular.module('demoapp').controller('releaseNotesCtrl', ['$scope', function ($scope) {
    //TODO: user settings related code.
}]);
angular.module('demoapp').controller('transferCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.checked = false;
    $scope.transferList = [];

    $scope.open = function () {
        $scope.finalizedForms = server.vindb.loadFinalizedForms();
        $scope.checked = !$scope.checked
    }

    $scope.transfer = function () {
        for (var i = 0; i < $scope.transferList.length; i++) {
            if ($scope.transferList[i]) {
                server.remotedb.submitForm($scope.finalizedForms[i]);
                server.vindb.markTransferred($scope.finalizedForms[i].formInfo.id);
            }
        }
    }

    $rootScope.$on('openTransferPanel', function (event, data) {
        $scope.open();
    });
}]);
