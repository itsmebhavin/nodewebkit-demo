'use strict'
var loki, db, appsettings;

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
        console.log('----- Error : ' + e);
    }
}
exports.saveTheme = function (theme) {
    console.log(appsettings);
    console.log('Save theme called with theme - ' + theme);
    var entry = appsettings.findOne({ activetheme: { $contains: '' } });
    if (entry === null) {
        appsettings.insert({ activetheme: theme })
    } else {
        entry.activetheme = theme;
        appsettings.update(entry);
    }
    db.saveDatabase();
    this.loadTheme();
}
exports.loadTheme = function () {
    var entry = appsettings.findOne({ activetheme: { $contains: '' } });
    console.log('===>');
    if (entry === null) {
        console.log('theme is not available')
    }
    else {
        console.log('Theme found');
        console.log(entry.activetheme);
        return entry.activetheme;
    }
}
