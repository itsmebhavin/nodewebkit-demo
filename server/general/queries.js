var squel = require('squel');
var uuid = require('node-uuid');

/* VIN (start) */
exports.INSERT_VIN_FORM_DATA = function(form, id) {
    return squel.insert()
                .into("VINInspections")
                .set('VinInspectionID', uuid.v4())
                .set('DocumentID', id)
                .set('TitleState', (form.stateTitle ? form.stateTitle : ''))
                .set('IsTitleorCourtNum', (form.titleCourt ? 'T' : 'C'))
                .set('TitleOrCourtNum', (form.titleCourtOrderNum ? form.titleCourtOrderNum : ''))
                .set('InspectionDateTime', (form.inpsectionDateTime ? form.InspectionDateTime : null))
                .set('WorkPhone', (form.WorkPhone ? form.WorkPhone : null))
                .set('Is25FeeCollected', (form.feeCollected ? form.feeCollected.toString() : 'false'))
                .toString();
}
exports.UPDATE_VIN_FORM_DATA = function(form, id) {
    return squel.update()
                .table('VINInspections')
                .set('VinInspectionID', uuid.v4())
                .set('DocumentID', id)
                .set('TitleState', (form.stateTitle ? form.stateTitle : ''))
                .set('IsTitleorCourtNum', (form.titleCourt ? 'T' : 'C'))
                .set('TitleOrCourtNum', (form.titleCourtOrderNum ? form.titleCourtOrderNum : ''))
                .set('InspectionDateTime', (form.inpsectionDateTime ? form.InspectionDateTime : null))
                .set('WorkPhone', (form.WorkPhone ? form.WorkPhone : null))
                .set('Is25FeeCollected', (form.feeCollected ? form.feeCollected.toString() : 'false'))
                .toString();
}
exports.INSERT_VIN_FORM_INFO = function(info) {
    return squel.insert()
                .into("Documents")
                .set('DocumentID', info.id)
                .set('TicketNum', info.title)
                .set('CreateDate', (info.createDate ? info.createDate : (new Date()).toISOString()))
                .set('Finalized', info.finalized.toString())
                .set('FinalizedDate', info.finalizedDate.toISOString())
                .set('Transferred', 'true')
                .set('TransferDate', (info.transferredDate ? info.transferredDate : (new Date()).toISOString()))
                .set('StatusID', 4)
                .set('StatusText', 'Transferred')
                .set('TypeID', 8)
                .set('TypeText', 'Vin Inspection')
                .set('CreateUserID', uuid.v4())     // JUNK DATA - CHANGE LATER
                .set('OfficerName', 'asdf')         // JUNK DATA - CHANGE LATER
                .set('AgencyOri', 'asdf')           // JUNK DATA - CHANGE LATER
                .set('OfficerId', 'asdf')           // JUNK DATA - CHANGE LATER
                .set('Deleted', 'false')            // JUNK DATA - CHANGE LATER
                .set('LastModifiedDate', (new Date()).toISOString())
                .set('Username', 'asdf')            // JUNK DATA - CHANGE LATER
                .set('VersionNumber', 'asdf')       // JUNK DATA - CHANGE LATER
                .toString();
}
exports.UPDATE_VIN_FORM_INFO = function(info) {
    return squel.update()
                .into("Documents")
                .set('DocumentID', info.id)
                .set('TicketNum', info.title)
                .set('CreateDate', (info.createDate ? info.createDate : (new Date()).toISOString()))
                .set('Finalized', info.finalized.toString())
                .set('FinalizedDate', info.finalizedDate)
                .set('Transferred', 'true')
                .set('TransferDate', (info.transferredDate ? info.transferredDate : (new Date()).toISOString()))
                .set('StatusID', 4)
                .set('StatusText', 'Transferred')
                .set('TypeID', 8)
                .set('TypeText', 'Vin Inspection')
                .set('CreateUserID', uuid.v4())     // JUNK DATA - CHANGE LATER
                .set('OfficerName', 'asdf')         // JUNK DATA - CHANGE LATER
                .set('AgencyOri', 'asdf')           // JUNK DATA - CHANGE LATER
                .set('OfficerId', 'asdf')           // JUNK DATA - CHANGE LATER
                .set('Deleted', 'false')            // JUNK DATA - CHANGE LATER
                .set('LastModifiedDate', (new Date()).toISOString())
                .set('Username', 'asdf')            // JUNK DATA - CHANGE LATER
                .set('VersionNumber', 'asdf')       // JUNK DATA - CHANGE LATER
                .toString();
}
exports.DOES_DOCUMENT_EXIST = function(id) {
    return squel.select()
                .from('Documents')
                .where('DocumentID = ?', id)
                .toString();
}
/* VIN (end) */
