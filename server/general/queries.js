var squel = require('squel');
var uuid = require('node-uuid');

/* VIN (start) */
exports.SUBMIT_VIN_FORM_DATA = function(form, id) {
    return squel.insert()
                .into("VINInspections")
                .set('VinInspectionID', uuid.v4())
                .set('DocumentID', id)
                .set('TitleState', form.stateTitle)
                .set('IsTitleorCourtNum', (form.titleCourt ? 'T' : 'C'))
                .set('TitleOrCourtNum', form.titleCourtOrderNum)
                .set('InspectionDateTime', (form.inpsectionDateTime ? form.InspectionDateTime : null))
                .set('WorkPhone', (form.WorkPhone ? form.WorkPhone : null))
                .set('Is25FeeCollected', form.feeCollected.toString())
                .toString();
}
exports.SUBMIT_VIN_FORM_INFO = function(info) {
    var modified = new Date();
    var createDate = info.createDate ? info.createDate : (new Date()).toISOString();
    var transferredDate = info.transferredDate ? info.transferredDate : (new Date()).toISOString();
    return squel.insert()
                .into("Documents")
                .set('DocumentID', info.id)
                .set('TicketNum', info.title)
                .set('CreateDate', createDate)
                .set('Finalized', info.finalized.toString())
                .set('FinalizedDate', info.finalizedDate)
                .set('Transferred', 'true')
                .set('TransferDate', transferredDate)
                .set('StatusID', 4)
                .set('StatusText', 'Transferred')
                .set('TypeID', 8)
                .set('TypeText', 'Vin Inspection')
                .set('CreateUserID', uuid.v4())     // JUNK DATA - CHANGE LATER
                .set('OfficerName', 'asdf')         // JUNK DATA - CHANGE LATER
                .set('AgencyOri', 'asdf')           // JUNK DATA - CHANGE LATER
                .set('OfficerId', 'asdf')           // JUNK DATA - CHANGE LATER
                .set('Deleted', 'false')            // JUNK DATA - CHANGE LATER
                .set('LastModifiedDate', modified.toISOString())
                .set('Username', 'asdf')            // JUNK DATA - CHANGE LATER
                .set('VersionNumber', 'asdf')       // JUNK DATA - CHANGE LATER
                .toString();
}
/* VIN (end) */
