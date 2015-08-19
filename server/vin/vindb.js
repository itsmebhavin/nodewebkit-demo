var loki = require('lokijs');
var localdb = new loki('local.json');
var localActive = localdb.addCollection('activeCollection');
var localForms = localdb.addCollection('localForms');
var db = new loki('loki.json');
var savedForms = db.addCollection('forms');

exports.saveLocalActive = function(active) {
    var entry = localActive.findOne({activeTab: {$contains: ''}});
    if(entry === null) {
        localActive.insert({activeTab: active.id})
    } else {
        entry.activeTab = (active === undefined ? '0000' : active.id);
        localActive.update(entry);
    }
}

exports.saveLocalForm = function(id, form, type, title) {
    var entry = localForms.findOne({id: {$eq: id}});
    if(entry === null) {
        localForms.insert({id:id, form:form, type:type, title:title});
    } else {
        entry.form = form;
        localForms.update(entry);
    }
}

exports.deleteLocalForm = function(id) {
    var x = localForms.findOne({'id':id});
    localForms.remove(x);
}

exports.saveForm = function() {
    var id = localActive.findOne({activeTab: {$contains: ''}}).activeTab;
    var localForm = localForms.findOne({id: {$eq: id}});
    var savedForm = savedForms.findOne({id: {$eq: id}});
    if(savedForm === null) {
        savedForms.insert({id:localForm.id, form:localForm.form});
    } else {
        savedForm = localForm;
        savedForms.update(savedForm);
    }
}

exports.openForm = function() {
    
}

exports.loadLocalForms = function() {
    return localForms.find({});
}

// DEBUGGING/TESTING FUNCTIONS
exports.dumpDatabase = function() {
    localdb.saveDatabase();
    db.saveDatabase();
}
