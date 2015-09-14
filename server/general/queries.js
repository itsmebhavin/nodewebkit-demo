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
                .set('AIRSWebServiceResponseID', null)
                .set('AIRSWebServiceRequestCounter', null)
                .set('AIRSWebServiceRequestStatusID', null)
                .set('AIRSWebServiceRequestNote', null)
                .set('AIRSWebServiceInvalidateNote', null)
                .set('Is25FeeCollected', form.feeCollected.toString()).toString();
}
exports.SUBMIT_VIN_FORM_INFO = function(info) {
    var modified = new Date();
    return squel.insert()
                .into("Documents")
                .set('DocumentID', info.id)
                .set('TicketNum', info.title)
                .set('CreateDate', info.createDate)
                .set('Finalized', info.finalized)
                .set('FinalizedDate', info.finalizedDate)
                .set('Transferred', info.transferred)
                .set('TransferDate', info.transferredDate)
                .set('StatusID', 4)
                .set('StatusText', 'Transferred')
                .set('TypeID', 8)
                .set('TypeText', 'Vin Inspection')
                .set('CreateUserID', null)
                .set('OfficerName', null)
                .set('AgencyOri', null)
                .set('OfficerId', null)
                .set('Deleted', false)
                .set('LastModifiedDate', modified.toISOString())
                .set('Username', 1)
                .set('VersionNumber', 1).toString();
}
/* VIN (end) */
