var sql = require('mssql');
var query = require('./queries.js');
var config = require('./dbconfig.js');
var queue = require('q');

exports.submitForm = function(data) {
    switch(data.formInfo.type) {
        case 'VIN':
            submitVin(data);
        default:
            return null;
    }
}

function submitVin(data) {
    var form, info;

    function executeQuery(query) {
        console.log(query);
        var q = queue.defer();
        try {
            var connection = new sql.Connection(config.database, function(err) {
                if(!err) {
                    var request = new sql.Request(connection);
                    request.query(query, function(err, recordsets, returnValue) {
                        if(err) {
                            console.log('remotedb - line 27')
                            console.log(err);
                            q.reject('ERROR(sql)' + err);
                        } else {
                            q.resolve(recordsets);
                        }
                    });
                } else {
                    console.log('remotedb - line 35')
                    console.log(err);
                    q.reject('ERROR(sql-conn)' + err);
                }
            });
        } catch (e) {
            console.log('remotedb - line 41')
            console.log(e);
            q.reject('EXCEPTION(submitVin):' + e);
        }
        return q.promise;
    }

    form = data.form;
    info = data.formInfo;
    var existsQuery = query.DOES_DOCUMENT_EXIST(info.id);
    var exists = false;

    executeQuery(existsQuery).then(function(data) {
        if(data.length > 0) exists = true;
        if(exists) {
            return executeQuery(query.UPDATE_VIN_FORM_DATA(form, info.id));
        } else {
            return executeQuery(query.INSERT_VIN_FORM_DATA(form, info.id));
        }
    }).then(function(data) {
        if(exists) {
            return executeQuery(query.UPDATE_VIN_FORM_INFO(info));
        } else {
            console.log("Doesn't Exist");
            return executeQuery(query.INSERT_VIN_FORM_INFO(info));
        }
    }).then(function(data) {
        console.log(data);
    });
}
