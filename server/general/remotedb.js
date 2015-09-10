var query = require('./queries.js')

exports.submitForm = function(data, type) {
    switch(type) {
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
    query.SUBMIT_VIN_FORM_DATA(form);
    query.SUBMIT_VIN_FORM_INFO(info);
}
