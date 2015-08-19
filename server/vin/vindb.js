var loki, localdb, localActive, localForms, db, savedForms;
init();

function init() {
    loki = require('lokijs');
    localdb = new loki('local.json');
    localActive = localdb.addCollection('activeCollection');
    localForms = localdb.addCollection('localForms');
    db = new loki('loki.json');
    db.loadDatabase({}, function() {
        if(db.collections.length > 0) {
            savedForms = db.getCollection('forms');
        } else {
            savedForms = db.addCollection('forms');
        }
    });
}

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
        savedForms.insert({id:localForm.id, form:localForm.form, title:localForm.title, type:localForm.type, lastchanged:new Date()});
    } else {
        savedForm = localForm;
        savedForm.lastchanged = new Date();
        savedForms.update(savedForm);
    }
    db.saveDatabase();
}

exports.loadFormList = function() {
    var forms = savedForms.find({});
    var result = forms.map(function(form) {return {title:form.title,type:form.type}});
    return result;
}

exports.loadForm = function(t) {
    var form = savedForms.findOne({title: {$eq: t}});
    return form;
}

exports.loadRecents = function() {
    var forms = savedForms.chain().find().simplesort('lastchanged').limit(5).data();
    var result = forms.map(function(form) {return {title:form.title, type:form.type}});
    return result;
}

exports.loadLocalForms = function() {
    return localForms.find({});
}

// DEBUGGING/TESTING FUNCTIONS
exports.dumpDatabase = function() {
    localdb.saveDatabase();
    db.saveDatabase();
}
exports.loadDatabase = function() {
    loki.loadDatabase();
}
