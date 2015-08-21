'use strict'
var Datastore = require('nedb')
  , path = require('path');

var dbPath = path.join(path.join(getUserDataPath(), 'users.db'))
var db = new Datastore({ filename: dbPath ,  autoload: true });
console.log('nedb@' + dbPath);

//  private functions for this node module.
function getUserDataPath() {
    return path.dirname(process.execPath);
}

function getCountsByCondition(condition){
  var response = {
    "error":1,
    "count":0
  };

  db.count(condition,function(err,count){
    if(err){
      response.count = err;
    }
    else{
      response.count = count;
      response.error = 0;
    }
    return response;
  });
}
function getRecordsByCondition (condition){
  var response = {
    "error":1,
    "data":""
  };

  db.find(condition,function(err,docs){
    if(err){
      response.data = err;
    }
    else{
      response.data = docs;
      response.error = 0;
    }
    return response;
  });
}


//  CRUD exports functions. All functions below are public and exports only.
exports.getAll= function(){
  return getRecordsByCondition({});
}

exports.getByDBID = function(id){
  return getRecordsByCondition({_id:id});
}

exports.getByDocumentID = function(docid){
  return getRecordsByCondition({DocumentID: docid});
}
