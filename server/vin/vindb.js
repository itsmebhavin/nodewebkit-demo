var loki, localdb, localActive, localForms, db, savedForms;
init();

var report = require('./vinreport');

function init() {
    loki = require('lokijs');
    localdb = new loki('local.json');
    localActive = localdb.addCollection('activeCollection');
    localForms = localdb.addCollection('localForms');
    db = new loki('loki.json');
    db.loadDatabase({}, function() {
        var nameList = db.collections.map(function(collection) {return collection.name});

        if(nameList.indexOf('forms') > -1) {
            savedForms = db.getCollection('forms');
        } else {
            savedForms = db.addCollection('forms');
        }
    });
}

var saveLocalActive = function(id) {
    var entry = localActive.findOne({activeTab: {$contains: ''}});
    if(entry === null) {
        localActive.insert({activeTab: id})
    } else {
        entry.activeTab = (id === undefined ? '0000' : id);
        localActive.update(entry);
    }
}

var saveLocalForm = function(info, form) {//id, form, type, title) {
    var entry = localForms.findOne({'formInfo.id': info.id});
    if(entry === null) {
        localForms.insert({form:form, formInfo:info})
    } else {
        entry.form = form;
        localForms.update(entry);
    }
}

var deleteLocalForm = function(id) {
    var x = localForms.findOne({'formInfo.id':id});
    if(x !== null) {
        localForms.remove(x);
    }
}

var saveForm = function() {
    var id = localActive.findOne({activeTab: {$contains: ''}}).activeTab;
    var localForm = localForms.findOne({'formInfo.id': id});
    var savedForm = savedForms.findOne({'formInfo.id': id});
    if(savedForm === null) {
        savedForms.insert({
            formInfo: {
                id:localForm.formInfo.id,
                title:localForm.formInfo.title,
                type:localForm.formInfo.type,
                dateIssued:new Date(),
                lastModifiedDate:new Date(),
                validity:localForm.formInfo.validity
            },
            form:localForm.form
        });
    } else {
        savedForm = localForm;
        savedForm.formInfo.lastModifiedDate = new Date();
        savedForms.update(savedForm);
    }
    db.saveDatabase();
}

var finalizeForm = function(finalize) {
    var id = localActive.findOne({activeTab: {$contains: ''}}).activeTab;
    var localForm = localForms.findOne({'formInfo.id':id});
    var savedForm = savedForms.findOne({'formInfo.id':id});

    if(finalize && localForm.formInfo.validity == "invalid") {
        return "Invalid";
    }

    localForm.formInfo.finalized = finalize;
    localForm.formInfo.finalizedDate = finalize ? new Date() : null;

    if(savedForm === null) {
        saveForm();
    } else {
        savedForm.formInfo.finalized = finalize;
        savedForm.formInfo.finalizedDate = finalize ? localForm.formInfo.finalizedDate : null;
    }
    db.saveDatabase();
}

var markTransferred = function(id) {
    var savedForm = savedForms.findOne({'formInfo.id':id});
    savedForm.formInfo.transferred = true;
    savedForm.formInfo.transferredDate = new Date();
    db.saveDatabase();
}

var loadFormList = function() {
    var forms = savedForms.find({});
    var result = forms.map(function(form) {return {title:form.formInfo.title,type:form.formInfo.type}});
    return result;
}

var loadForm = function(t) {
    var form = savedForms.findOne({'formInfo.title': t});
    if(form.form.inspectionDateTime) form.form.inspectionDateTime = new Date(form.form.inspectionDateTime);
    return form;
}

var loadRecents = function() {
    var forms = savedForms.chain().find().simplesort('formInfo.lastModifiedDate').limit(5).data();
    var result = forms.map(function(form) {return {title:form.formInfo.title, type:form.formInfo.type}});
    return result;
}

var loadLocalForms = function() {
    return localForms.find({});
}

var loadFinalizedForms = function() {
    return savedForms.find({
        'formInfo.finalized': true
    });
}

var printReport = function () {
    var id = localActive.findOne({activeTab: {$contains: ''}}).activeTab;
    var localForm = localForms.findOne({'formInfo.id': id});
    form = localForm.form;
    info = localForm.formInfo;
    if(!info.finalized) {
        console.log("Form not finalized");
        return;
    } else if(!form.vin || !form.vehicleColor || !form.vehicleMake || !form.vehicleModel) {
        console.log("Missing required data");
        return;
    }
    var data = {
        "VINObject": [
            {
                "VIN": form.vin,
                "VehicleColor": form.vehicleColor,
                "VehicleMake": form.vehicleMake,
                "VehicleModel": form.vehicleModel,
                "AgencyORI": form.verifyingAgency ? form.verifyingAgency : "",
                "BadgeNum": form.badgeID ? form.badgeID : "",
                "ControlNumber": "p0242342",
                "CreatedDate": (info.createDate ? info.createDate : new Date()),
                "IsFeeCollectedNo": form.feeCollected ? !form.feeCollected: false,
                "IsFeeCollectedYes": form.feeCollected ? form.feeCollected: true,
                "OfficerName": form.officerName ? form.officerName : "",
                "OfficerSign": "",
                "TitleOrCourtOrderNum": form.titleCourtOrderNum ? form.titleCourtOrderNum : "",
                "VehicleState": form.stateTitle ? form.stateTitle : "",
                "VehicleYear": form.vehicleYear ? form.vehicleYear : "",
                "WorkPhone": form.workPhone ? form.workPhone : ""
            }
        ]
    }
    report.printVINReport(data);
}

exports.saveLocalActive = saveLocalActive;
exports.saveLocalForm = saveLocalForm;
exports.deleteLocalForm = deleteLocalForm;
exports.saveForm = saveForm;
exports.finalizeForm = finalizeForm;
exports.markTransferred = markTransferred;
exports.loadFormList = loadFormList;
exports.loadForm = loadForm;
exports.loadRecents = loadRecents;
exports.loadLocalForms = loadLocalForms;
exports.loadFinalizedForms = loadFinalizedForms;
exports.printReport = printReport;

// DEBUGGING/TESTING FUNCTIONS
var dumpDatabase = function() {
    localdb.saveDatabase();
    db.saveDatabase();
}
