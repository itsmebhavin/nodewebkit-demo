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

exports.saveLocalActive = function(id) {
    var entry = localActive.findOne({activeTab: {$contains: ''}});
    if(entry === null) {
        localActive.insert({activeTab: id})
    } else {
        entry.activeTab = (id === undefined ? '0000' : id);
        localActive.update(entry);
    }
}

exports.saveLocalForm = function(info, form) {//id, form, type, title) {
    var entry = localForms.findOne({'formInfo.id': info.id});
    if(entry === null) {
        localForms.insert({form:form, formInfo:info})
    } else {
        entry.form = form;
        localForms.update(entry);
    }
}

exports.deleteLocalForm = function(id) {
    var x = localForms.findOne({'formInfo.id':id});
    if(x !== null) {
        localForms.remove(x);
    }
}

exports.saveForm = function() {
    var id = localActive.findOne({activeTab: {$contains: ''}}).activeTab;
    var localForm = localForms.findOne({'formInfo.id': id});
    // var savedForm = savedForms.findOne({$and:[{'formInfo':{$contains:'id'}},{'formInfo.id':id}]});
    var savedForm = savedForms.findOne({'formInfo.id': id});
    if(savedForm === null) {
        savedForms.insert({
            formInfo: {
                id:localForm.formInfo.id,
                title:localForm.formInfo.title,
                type:localForm.formInfo.type,
                dateIssued:new Date(),
                lastChanged:new Date()
            },
            form:localForm.form
        });
    } else {
        savedForm = localForm;
        savedForm.formInfo.lastchanged = new Date();
        savedForms.update(savedForm);
    }
    db.saveDatabase();
}

exports.finalizeForm = function(finalize) {
    var id = localActive.findOne({activeTab: {$contains: ''}}).activeTab;
    var localForm = localForms.findOne({'formInfo.id':id});
    var savedForm = savedForms.findOne({'formInfo.id':id});

    localForm.formInfo.finalized = finalize;
    localForm.formInfo.finalizedDate = finalize ? new Date() : null;

    if(savedForm === null) {
        savedForms.insert({
            formInfo: {
                id:localForm.id,
                title:localForm.title,
                type:localForm.type,
                dateIssued:new Date(),
                lastChanged:new Date(),
                finalized:true,
                finalizedDate:new Date()
            },
            form:localForm.form
        });
    } else {
        savedForm.formInfo.finalized = finalize;
        savedForm.formInfo.finalizedDate = finalize ? localForm.formInfo.finalizedDate : null;
    }
    db.saveDatabase();
}

exports.markTransferred = function(id) {
    var savedForm = savedForms.findOne({'formInfo.id':id});
    savedForm.formInfo.transferred = true;
    savedForm.formInfo.transferredDate = new Date();
    db.saveDatabase();
}

exports.loadFormList = function() {
    var forms = savedForms.find({});
    var result = forms.map(function(form) {return {title:form.formInfo.title,type:form.formInfo.type}});
    return result;
}

exports.loadForm = function(t) {
    var form = savedForms.findOne({'formInfo.title': t});
    return form;
}

exports.loadRecents = function() {
    var forms = savedForms.chain().find().simplesort('formInfo.lastchanged').limit(5).data();
    var result = forms.map(function(form) {return {title:form.formInfo.title, type:form.formInfo.type}});
    return result;
}

exports.loadLocalForms = function() {
    return localForms.find({});
}

exports.loadFinalizedForms = function() {
    return savedForms.find({
        'formInfo.finalized': true
    });
}

// DEBUGGING/TESTING FUNCTIONS
exports.dumpDatabase = function() {
    localdb.saveDatabase();
    db.saveDatabase();
}


exports.printReport = function () {
    report.printReport();
}
