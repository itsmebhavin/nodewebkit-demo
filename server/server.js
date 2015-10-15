'use strict'
console.log('inside server and server.js is launched.')

exports.vindb = require('./vin/vindb.js');
exports.appsettingsdb = require('./general/applicationsettingsdb.js');
exports.remotedb = require('./general/remotedb.js');


//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('eForms.sqlite');

//db.serialize(function () {
//    db.run("CREATE TABLE lorem (info TEXT)");

//    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//    for (var i = 0; i < 10; i++) {
//        stmt.run("Ipsum " + i);
//    }
//    stmt.finalize();

//    db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//        console.log(row.id + ": " + row.info);
//    });
//});

//db.close();


