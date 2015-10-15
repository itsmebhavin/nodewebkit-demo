'use strict'
var loki, db, appsettings;
var q = require('q');
init();

function init() {
    try {
        console.log('Initializing database');
        loki = require('lokijs');
        db = new loki('loki.json');
        db.loadDatabase({}, function() {
            var nameList = db.collections.map(function(collection) {return collection.name});
            if (nameList.indexOf('appsettings') > -1) {
                appsettings = db.getCollection('appsettings');
            } else {
                appsettings = db.addCollection('appsettings');
            }
        });
    }
    catch (e) {
        console.log('Exception(appSettings_init):' + e);
    }
}
exports.saveTheme = function (theme) {
    var defer = q.defer();
    try{
        var entry = appsettings.findOne({ activetheme: { $contains: '' } });
        if (entry === null) {
            appsettings.insert({ activetheme: theme })
        } else {
            entry.activetheme = theme;
            appsettings.update(entry);
        }
        db.saveDatabase();
        defer.resolve(true);
    }
    catch (e) {
        defer.reject('Exception(saveTheme):' + e);
    }
    return defer.promise;
}
exports.loadTheme = function () {
    var defer = q.defer();
    try{
        var entry = appsettings.findOne({ activetheme: { $contains: '' } });
        if (entry === null) {
            defer.resolve(null);
        }
        else {
            defer.resolve(entry.activetheme);
        }
    }
    catch (e) {
        defer.reject('Exception(loadTheme):' + e);
    }
    return defer.promise;
}
exports.checkUpdates = function (currentVersion,checkforupdate) {
    var defer = q.defer();
    try {
        var updater = require('nw-updater')({
            'channel': 'beta',
            "currentVersion": currentVersion,
            'endpoint': 'http://artsappssteeringcommittee.caps.ua.edu/update.json'
        })
        console.log(currentVersion);

        var chk = updater.check();

        if (checkforupdate == true)
        {
            updater.update();
            updater.on("download", function (version) {
                console.log("OH YEAH! going to download version " + version)
            })
            updater.on("installed", function () {
                console.log("SUCCCESSFULLY installed, please restart")
            })
            defer.resolve("Application updated successfully");
        }
        else {
            defer.resolve(chk);
        }
    }
    catch (e) {
        defer.reject(e);
    }
    return defer.promise;
}