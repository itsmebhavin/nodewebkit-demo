var squel = require('squel');

/* VIN (start) */
exports.SUBMIT_VIN_FORM_DATA = function(form) {
    console.log(form);
    return squel.insert();
                // .into("Documents")
                // .set("VINInspectionID")
                // .set("DocumentID");
}
exports.SUBMIT_VIN_FORM_INFO = function(info) {
    console.log(info);
    return sql.insert();
}
/* VIN (end) */
