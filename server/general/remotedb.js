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

    form = data.form;
    info = data.formInfo;
    var existsQ = query.DOES_DOCUMENT_EXIST(info.id);
    var insertFormQ = query.INSERT_VIN_FORM_DATA(form, info.id);
    var updateFormQ = query.UPDATE_VIN_FORM_DATA(form, info.id);
    var insertInfoQ = query.INSERT_VIN_FORM_INFO(info);
    var updateInfoQ = query.UPDATE_VIN_FORM_INFO(info);

    executeQuery(existsQ).then(function(data) {
        if(data.length > 0) {
            executeQuery(updateFormQ).then(function(ufq) {
                return executeQuery(updateInfoQ);
            }, function(err) {
                console.log("Update Form Query: " + err);
            }).then(function(uiq) {

            }, function (err) {
                console.log("Update Info Query: " + err);
            });
        } else {
            executeQuery(insertFormQ).then(function(a,b,c) {
                return executeQuery(insertInfoQ);
            }, function(err) {
                console.log("Insert Form Query: " + err);
            }).then(function(iiq) {

            }, function(err) {
                console.log("Insert Info Query: " + err);
            });
        }
    });
}
