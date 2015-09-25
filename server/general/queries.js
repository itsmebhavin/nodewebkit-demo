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
                .set('InspectionDateTime', (form.inpsectionDateTime ? form.inspectionDateTime : null))
                .set('WorkPhone', (form.WorkPhone ? form.WorkPhone : null))
                .set('Is25FeeCollected', (form.feeCollected ? form.feeCollected.toString() : 'false'))
                .toString();
}
exports.UPDATE_VIN_FORM_DATA = function(form, id) {
    return squel.update()
                .table('VINInspections')
                .set('TitleState', (form.stateTitle ? form.stateTitle : ''))
                .set('IsTitleorCourtNum', (form.titleCourt ? 'T' : 'C'))
                .set('TitleOrCourtNum', (form.titleCourtOrderNum ? form.titleCourtOrderNum : ''))
                .set('InspectionDateTime', (form.inpsectionDateTime ? form.inspectionDateTime : null))
                .set('WorkPhone', (form.WorkPhone ? form.WorkPhone : null))
                .set('Is25FeeCollected', (form.feeCollected ? form.feeCollected.toString() : 'false'))
                .where('DocumentID = ?', id)
                .toString();
}
exports.INSERT_VEHICLE_DATA = function(form, id) {
    return squel.insert()
                .into('Vehicles')
                .set('ID', uuid.v4())
                .set('DocumentID', id)
                // .set('Body')
                // .set('MakeCode')
                .set('Make', form.vehicleMake)
                .set('Model', form.vehicleModel)
                .set('Color', form.vehicleColor)
                // .set('Owner')
                // .set('Address')
                .set('Year', form.vehicleYear)
                // .set('TagNumber')
                // .set('TagState')
                // .set('TagYear')
                .set('Vin', form.vin)
                .set('IsDaycare', 'false')
                .set('IsSchoolBus', 'false')
                .set('IsPrivate', 'false')
                .set('IsCommercial', 'false')
                .set('CdlRequired', 'false')
                .set('HazMat', 'false')
                // .set('ModelCode')
                // .set('TypeName')
                // .set('TypeCode')
                .set('IsDamageToVehicle', 'false')
                // .set('VehicleDamage')
                .set('IsAbandonedVehicle', 'false')
                .set('IsMakeUnknown', 'false')
                .set('IsModelUnknown', 'false')
                .toString();
}
exports.UPDATE_VEHICLE_DATA = function(form, id) {
    return squel.update()
                .table('Vehicles')
                // .set('Body')
                // .set('MakeCode')
                .set('Make', form.vehicleMake)
                .set('Model', form.vehicleModel)
                .set('Color', form.vehicleColor)
                // .set('Owner')
                // .set('Address')
                .set('Year', form.vehicleYear)
                // .set('TagNumber')
                // .set('TagState')
                // .set('TagYear')
                .set('Vin', form.vin)
                .set('IsDaycare', 'false')
                .set('IsSchoolBus', 'false')
                .set('IsPrivate', 'false')
                .set('IsCommercial', 'false')
                .set('CdlRequired', 'false')
                .set('HazMat', 'false')
                // .set('ModelCode')
                // .set('TypeName')
                // .set('TypeCode')
                .set('IsDamageToVehicle', 'false')
                // .set('VehicleDamage')
                .set('IsAbandonedVehicle', 'false')
                .set('IsMakeUnknown', 'false')
                .set('IsModelUnknown', 'false')
                .where('DocumentID = ?', id)
                .toString();
}
exports.INSERT_VIN_FORM_INFO = function(info) {
    return squel.insert()
                .into("Documents")
                .set('DocumentID', info.id)
                .set('TicketNum', info.title)
                .set('CreateDate', (info.createDate ? info.createDate.toISOString() : (new Date()).toISOString()))
                .set('Finalized', info.finalized.toString())
                .set('FinalizedDate', (info.finalizedDate ? info.finalizedDate.toISOString() : (new Date()).toISOString()))
                .set('Transferred', 'true')
                .set('TransferDate', (info.transferredDate ? info.transferredDate.toISOString() : (new Date()).toISOString()))
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
                .table("Documents")
                .set('TicketNum', info.title)
                .set('CreateDate', (info.createDate ? info.createDate.toISOString() : (new Date()).toISOString()))
                .set('Finalized', info.finalized.toString())
                .set('FinalizedDate', (info.finalizedDate ? info.finalizedDate.toISOString() : (new Date()).toISOString()))
                .set('Transferred', 'true')
                .set('TransferDate', (info.transferredDate ? info.transferredDate.toISOString() : (new Date()).toISOString()))
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
                .where('DocumentID = ?', id)
                .toString();
}
exports.DOES_DOCUMENT_EXIST = function(id) {
    return squel.select()
                .from('Documents')
                .where('DocumentID = ?', id)
                .toString();
}
exports.SELECT_DOCUMENTS_BY_USER = function(username) {
    return squel.select()
                .from('Documents')
                .where('Username = ?', username)
                .where('TypeID = ?', 8)
                .toString();
}
/* VIN (end) */
/* LOAD FROM SERVER (begin) */
exports.SELECT_VIN_DATA_BY_ID = function(docId) {
    return squel.select('top 1 *')
                .from('VINInspections')
                .where('DocumentID = ?', docId)
                .toString();
}
exports.SELECT_VIN_FORM_INFO_BY_ID = function(docId) {
    return squel.select('top 1 *')
        .from('Documents')
        .where('DocumentID = ?', docId)
        .toString();
}
exports.SELECT_VIN_VEHICLES_BY_ID = function(docId) {
    return squel.select('top 1 *')
                .from('Vehicles')
                .where('DocumentID = ?', docId)
                .toString();
}
/* LOAD FROM SERVER (end) */
