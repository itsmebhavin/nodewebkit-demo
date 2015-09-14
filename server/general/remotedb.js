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
    form = data.form;
    info = data.formInfo;
    var formQuery = query.SUBMIT_VIN_FORM_DATA(form, info.id);
    var infoQuery = query.SUBMIT_VIN_FORM_INFO(info);
    console.log("==========");
    console.log(formQuery);
    console.log(infoQuery);
    console.log("==========");

    // var q = queue.defer();
    try {
        var connection = new sql.Connection(config.database, function(err) {
            if(!err) {
                var request = new sql.Request(connection);
                request.query(formQuery, function(err, recordsets, returnValue) {
                    if(err) {
                        console.log("error");
                        console.log(err);
                        // q.reject('ERROR(sql)' + err);
                    } else {
                        console.log("success");
                        // q.resolve(recordsets);
                    }
                });
            } else {
                console.log("failed");
                // q.reject('ERROR(sql-conn)' + err);
            }
        });
    } catch (e) {
        console.log("catch");
        // q.reject('EXCEPTION(submitVin):' + e);
    }
    // return q.promise;
}
