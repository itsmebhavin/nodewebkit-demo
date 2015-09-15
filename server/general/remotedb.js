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
    var formQuery = query.SUBMIT_VIN_FORM_DATA(form, info.id);
    var infoQuery = query.SUBMIT_VIN_FORM_INFO(info);

    executeQuery(formQuery).then(function(data) {
        return executeQuery(infoQuery);
    });
}
