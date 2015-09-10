var squel = require('squel');

/* VIN (start) */
exports.SUBMIT_VIN_FORM_DATA = function(form, id) {
    console.log(form);
    return squel.insert();
                .into("VINInspections")
                .set('DocumentID', id)
                .set('TitleState', form.stateTitle)
                .set('IsTitleorCourtNum', form.titleCourt)
                .set('TitleOrCourtNum', form.titleCourtOrderNum)
                .set('InspectionDateTime', form.inpsectionDateTime)
                .set('WorkPhone', form.WorkPhone)
                .set('AIRSWebServiceResponseID', 1)
                .set('AIRSWebServiceRequestCounter', 1)
                .set('AIRSWebServiceRequestStatusID', 1)
                .set('AIRSWebServiceRequestNote', 1)
                .set('AIRSWebServiceInvalidateNote', 1)
                .set('Is25FeeCollected', form.feeCollected);
}
exports.SUBMIT_VIN_FORM_INFO = function(info) {
    console.log(info);
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
                .set('CreateUserID', 1)
                .set('OfficerName', 1)
                .set('AgencyOri', 1)
                .set('OfficerId', 1)
                .set('Deleted', 1)
                .set('LastModifiedDate', new Date())
                .set('Username', 1)
                .set('VersionNumber', 1);
}
/* VIN (end) */
