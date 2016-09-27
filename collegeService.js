/**
 * Created by shivanip.
 */

'use strict'
let co = require('co');
let coDal = require('./../../../../JOS/DALNoSql');
let mongodb = require('mongodb');
let helperService = require('./../sHelpers/helperService.js');
// written by shivanip
exports.getOne = co.wrap(function*(college) {

    let requestStatus = {
        status: false
    }

    if (college === undefined || college == null || college.toString().trim() == "") {
        requestStatus.reason = "Invalid object field value";
        return requestStatus;
    }

    try {

        let db = yield coDal.getNoSqlDB();
        let result = yield db.collegeMaster.findOne({ "_id": college });
        requestStatus.result = result;
        requestStatus.status = true;


    } catch (err) {
        console.error(err.stack);
        requestStatus.reason = err.stack;
    }

    return requestStatus;

});

// written by shivanip
exports.getList = co.wrap(function*() {


    let result = [];
    try {

        let db = yield coDal.getNoSqlDB();
        result = yield db.collegeMaster.find().toArray();


    } catch (err) {
        console.error(err.stack);

    }

    return result;

});



// written by shivanip
exports.save = co.wrap(function*(college) {

    let requestStatus = {
        status: false
    }

    if (college === undefined || college == null || college.toString().trim() == "") {
        requestStatus.reason = "Invalid object";
        return requestStatus;
    } else if (college._id === undefined || college._id == null || college._id.toString().trim() == "") {
        college._id = helperService.getGUID();
    }


    try {

        let db = yield coDal.getNoSqlDB();

        let result = yield db.collegeMaster.insert(college);

        requestStatus.status = true;

    } catch (err) {
        console.error(err.stack);
        requestStatus.reason = err.stack;
    }

    return requestStatus;

});

// written by shivanip
exports.remove = co.wrap(function*(id) {

    let requestStatus = {
        status: false
    }

    if (id === undefined || id == null || id.toString().trim() == "") {
        requestStatus.reason = "Invalid id Value";
        return requestStatus;
    }


    try {

        let db = yield coDal.getNoSqlDB();

        let result = yield db.collegeMaster.remove({ "_id": id });

        requestStatus.status = true;

    } catch (err) {
        console.error(err.stack);
        requestStatus.reason = err.stack;
    }

    return requestStatus;

});

// written by shivanip        
exports.udpate = co.wrap(function*(college) {

    let requestStatus = {
        status: false
    }

    if (college === undefined || college == null || college.toString().trim() == "") {
        requestStatus.reason = "Invalid object";
        return requestStatus;
    } else if (college._id === undefined || college._id == null || college._id.toString().trim() == "") {
        requestStatus.reason = "_id not set";
        return requestStatus;
    }


    try {

        let db = yield coDal.getNoSqlDB();
console.log(college);
        let result = yield db.collegeMaster.update({ "_id": college._id }, college

        );

        requestStatus.status = true;

    } catch (err) {
        console.error(err.stack);
        requestStatus.reason = err.stack;
    }

    return requestStatus;

});
