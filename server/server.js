'use strict'
console.log('inside server and server.js is launched.')

exports.vindb = require('./vin/vindb.js');
exports.appsettingsdb = require('./general/applicationsettingsdb.js');

