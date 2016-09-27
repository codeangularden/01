/**
 * Created by shivanip.
 */
'use strict'
let co = require('co');
let joi = require('joi');
let JWT   = require('jsonwebtoken');
let configHelper = require('./../../../../JOS/configHelper');
let index = require('./../../index');
let collegeService = require("./../../services/sCollege/collegeService");

let getOneCollegeRoute = {
    method: "GET", path: index+"/college/{id}", config: {
        auth: false,
        description: 'This API will return data of college having provided id',
        notes: 'shivanip did not put any notes for this API',
        tags: ['college','tag1', 'tag2'],
        validate: {
            params: {
                    id: joi.string().required()
            },
            failAction: function (request, reply, source, error) {
                let key = "errorMessages:college:"+error.output.payload.validation.keys[0];
                error.output.payload.message = configHelper.getConfig(key);
                return reply(error);
            }
        }
    },
    handler: function(request, reply) {
        co(function* () {
            try {
            //put your logic here
            
                let id = request.params.id;
                let result = yield collegeService.getOne(id);
                console.log(JSON.stringify(result));
                //Fetch data using id and send back as a reply
                reply("fetched one data"+JSON.stringify(result));
            }catch (e) {
                console.error(e.stack);
                reply({text: 'error'});
            }
        });
    }
};


//written by shivanip

let getAllCollegeRoute = {
    method: "GET", path: index+"/college", config: {
        auth: false,
        description: ' get all data',
        notes: 'shivanip did not put any notes for this API ',
        tags: ['college','tag1', 'tag2'],
    },
    handler: function(request, reply) {
        co(function* () {
            try {

                //Fetch all data and send back as a reply
                //at least put some intellegence here

                let list = yield collegeService.getList();
                reply(list);
            }catch (e) {
                console.error(e.stack);
                reply(e);
            }
        });
    }
};


//written by shivanip
let saveCollegeRoute = {
    method: "POST", path: index+"/college", config: {
        auth: false,
        description: 'This API saves college information',
        notes: 'shivanip did not put any notes for this API ',
        tags: ['college','tag1', 'tag2']
       /* validate: {
            payload: {
                    _id: joi.string().required()
            },
            failAction: function (request, reply, source, error) {
                error.output.payload.message = configHelper.getConfig(error.output.payload.validation.keys[0]);
                return reply(error);
            }

        }*/
    },
    handler: function(request, reply) {
        co(function* () {
            try {
                
                let college = request.payload.college;
                let result = yield collegeService.save(college);
                console.log(JSON.stringify(result));
                reply("ok");
            }catch (e) {
                console.error(e.stack);
                reply({text: 'error'});
            }
        });
    }
};


//written by shivanip
let deleteCollegeRoute = {
    method: "POST", path: index+"/delCollege", config: {
        auth: false,
        description: 'This API deletes College information',
        notes: 'shivanip did not put any notes for this API ',
        tags: ['college','delete', 'tag2']
       /* validate: {
            payload: {
                    _id: joi.string().required()
            },
            failAction: function (request, reply, source, error) {
                error.output.payload.message = configHelper.getConfig(error.output.payload.validation.keys[0]);
                return reply(error);
            }

        }*/
    },
    handler: function(request, reply) {
        co(function* () {
            try {
                
                let id = request.payload.id;
                let result = yield collegeService.remove(id);
                console.log(JSON.stringify(result));
                reply("ok");
            }catch (e) {
                console.error(e.stack);
                reply({text: 'error'});
            }
        });
    }
};
    //written by shivanip
    let updateCollegeRoute = {
    method: "POST", path: index+"/updateCollege", config: {
        auth: false,
        description: 'This API updates college object',
        notes: 'shivanip did not put any notes for this API ',
        tags: ['updateCollege','tag1', 'tag2']
    },
    handler: function(request, reply) {
        co(function* () {
            try {
           
                let collegeObject = request.payload.collegeObject;
                 console.log(collegeObject);
                let result = yield collegeService.udpate(collegeObject);
                reply("data replaced");
            } catch (e) {
                console.error(e.stack);
                reply({text: 'error'});
            }
        });
    }
};

module.exports = [getOneCollegeRoute,getAllCollegeRoute,saveCollegeRoute,deleteCollegeRoute,updateCollegeRoute];


