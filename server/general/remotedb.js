var sql = require('mssql');
var query = require('./queries.js');
var config = require('./dbconfig.js');
var queue = require('q');

exports.submitForm = function(data) {
    switch(data.formInfo.type) {
        case 'VIN':
            submitVin(data);
            break;
        default:
            return null;
    }
}
exports.loadFormsForUser = function(username) {
    var q = queue.defer();
    executeQuery(query.SELECT_DOCUMENTS_BY_USER(username)).then(function(records) {
        q.resolve(records);
    }, function(err) {
        console.log("loadFormsForUser: " + err);
        q.reject(err);
    });
    return q.promise;
}
exports.loadForm = function(docId) {
    var q = queue.defer();
    var ret = {
        form: {},
        info: {},
        vehicle: {}
    };
    executeQuery(query.SELECT_VIN_DATA_BY_ID(docId)).then(function(data) {
        if(data) ret.form = data[0];
        return executeQuery(query.SELECT_VIN_FORM_INFO_BY_ID(docId));
    }, function(err) {
        q.reject(err);
    }).then(function(data) {
        if(data) ret.info = data[0];
        return executeQuery(query.SELECT_VIN_VEHICLES_BY_ID(docId));
    }, function(err) {
        q.reject(err);
    }).then(function(data) {
        if(data) ret.vehicle = data[0];
        q.resolve(ret);
    }).then(function(err) {
        q.reject(err);
    });
    return q.promise;
}

function submitVin(data) {
    var form, info;

    form = data.form;
    info = data.formInfo;
    var existsQ = query.DOES_DOCUMENT_EXIST(info.id);
    var insertFormQ = query.INSERT_VIN_FORM_DATA(form, info.id);
    var updateFormQ = query.UPDATE_VIN_FORM_DATA(form, info.id);
    var insertInfoQ = query.INSERT_VIN_FORM_INFO(info);
    var updateInfoQ = query.UPDATE_VIN_FORM_INFO(info);
    var insertVehicleQ = query.INSERT_VEHICLE_DATA(form, info.id);
    var updateVehicleQ = query.UPDATE_VEHICLE_DATA(form, info.id);

    executeQuery(existsQ).then(function(data) {
        if(data.length > 0) {
            executeQuery(updateFormQ).then(function(ufq) {
                return executeQuery(updateInfoQ);
            }, function(err) {
                console.log("Update Form Query: " + err);
            }).then(function(uiq) {
                return executeQuery(updateVehicleQ);
            }, function (err) {
                console.log("Update Info Query: " + err);
            }).then(function(uvq) {
                // Do nothing
            }, function (err) {
                console.log("Update Vehicle Query: " + err);
            });
        } else {
            executeQuery(insertFormQ).then(function(ifq) {
                return executeQuery(insertInfoQ);
            }, function(err) {
                console.log("Insert Form Query: " + err);
            }).then(function(iiq) {
                return executeQuery(insertVehicleQ);
            }, function(err) {
                console.log("Insert Info Query: " + err);
            }).then(function(ivq) {
                // Do Nothing
            }, function(err) {
                console.log("Insert Vehicle Query: " + err);
            });
        }
    });
}

function executeQuery(query) {
    console.log(query);
    var q = queue.defer();
    try {
        var connection = new sql.Connection(config.database, function(err) {
            if(!err) {
                var request = new sql.Request(connection);
                request.query(query, function(err, recordsets, returnValue) {
                    if(err) {
                        q.reject('ERROR(sql)' + err);
                    } else {
                        q.resolve(recordsets);
                    }
                });
            } else {
                q.reject('ERROR(sql-conn)' + err);
            }
        });
    } catch (e) {
        q.reject('EXCEPTION(submitVin):' + e);
    }
    return q.promise;
}
