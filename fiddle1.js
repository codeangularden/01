college.component.js
-----------------------

import template from './college.html';
import controller from './college.controller';
//import './college.styl';

let collegeComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default collegeComponent;
==========================================================================================================
college.controller.js
-------------------------

/**
 * Created by authorName.
 */

class CollegeController {
    /*@ngInject*/
    constructor($filter, $scope, $state, Restangular, User, $translate, $translatePartialLoader) {
        this.name = 'college';
        this.collegeRest = Restangular.all('college');
        this.collegedelRest = Restangular;
        this.updateCollege = Restangular.all('updateCollege');
        this.collegeObject = {};
        this.self = this;
        this.fetchAllCollege();
        this.collegeList = [];
        this.stateList = stateList;
        this.countryList = countryList;
        this.districtList = districtList;
        this.showme = true;


        //this.db = pouchDB('ObjectName'); 
        this.collType = [
            { _id: '1', value: 'College' },
            { _id: '2', value: 'Institute' },
            { _id: '3', value: 'Department' }
        ];

        this.instrList = [
            { _id: '1', mediumName: 'Hindi' },
            { _id: '2', mediumName: 'English' },
            { _id: '3', mediumName: 'Marathi' }
        ];

    }

    change(c) {
        this.showme = false;
        this.collegeObject = c;
        this.collegeObject.collRegDate = new Date(c.collRegDate);
    }

    fetchAllCollege() {

        this.collegeRest.getList().then(function(collegeList) {
            this.collegeList = collegeList;
        }.bind(this.self));
    }

    save() {
        this.collegeObject._id = new Date().getTime().toString();
        this.collegeRest.post({ "college": this.collegeObject }).then(function(response) {
            this.fetchAllCollege();
            this.collegeObject = {};
        }.bind(this.self));
    }

    delete(val) {
        /*example : var user = {_id:"a3",name:"aaaa", age:23;}*/
        this.collegedelRest.one("delCollege").customPOST({ "id": val }).then(function(response) {
            this.fetchAllCollege();
        }.bind(this.self));


    }

    update() { /*example : var user = {_id:"a3",name:"aaaa", age:23;}*/
        this.updateCollege.post({ "collegeObject": this.collegeObject }).then(function(response) {
            console.log(response);

        });
        this.fetchAllCollege();


    }
}

export default CollegeController;
==============================================================================================================================
college.js (module)
-----------------------
/**
* Created by authorName.
*/
		
import angular from 'angular';
import uiRouter from 'angular-ui-router';
//import moduleNameComponent from './moduleName.component';
import ocLazyLoad from 'oclazyload';
import checklistModel from 'checklist-model';

let collegeModule = angular.module('college', [
  uiRouter
  , ocLazyLoad,checklistModel
])

.config(($stateProvider, $compileProvider) => {
  "ngInject";
  $stateProvider
    .state('college', {
      url: '/college',
      template: '<college></college>'
      ,

     resolve: {

        loadComponent: ($q, $ocLazyLoad,$translatePartialLoader) => {
          $translatePartialLoader.addPart('college');

           var deferred = $q.defer();

           require.ensure([], function(require) {
           let component = require('./college.component');

              $ocLazyLoad.inject([
               // component.name
             ])
            .then(

            	() => $compileProvider.directive('college', 
            		    function (){
            			   return component;
					          }
            		)
            	)

            .then(deferred.resolve);

          }, 'college'); // Name our bundle so it shows up pretty in the network tab

           return deferred.promise
         }
      }
    });
});
export default collegeModule;
=================================================================================================================
college.html
-------------

<!-- <div>
    <h1>Hello {{ vm.name }}</h1>
    <input type="text" ng-model="vm.collegeObject.firstName">
    <br/>
    <button ng-click="vm.save()">Save</button>
    <hr>
    <table class="table table-bordered">
        <tr ng-repeat="college in vm.collegeList">
            <td>{{college.firstName}}</td>
            <td>
                <button ng-click="vm.delete(college._id)">Delete</button>
            </td>
        </tr>
    </table>
</div> -->
<!-- <div>
    <h1>Hello {{ vm.name }}</h1>
    <input type="text" ng-model="vm.collegeObject.firstName">
    <br/>
    <button ng-click="vm.save()">Save</button>
    <hr>
    <table class="table table-bordered">
        <tr ng-repeat="college in vm.collegeList">
            <td>{{college.firstName}}</td>
            <td>
                <button ng-click="vm.delete(college._id)">Delete</button>
            </td>
        </tr>
    </table>
</div> -->
<!-- <div class="form-group">
    <div class="row">
        <div class="col-md-3">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-md-3">
                            <i class="fa fa-comments fa-5x"></i>
                        </div>
                        <div class="col-md-9">
                            <div class="text-right">
                                <h2>26</h2></div>
                            <div class="text-right">New Comments!</div>
                        </div>
                    </div>
                </div>
                <a href="#">
                    <div class="panel-footer">
                        <span class="pull-left">View Details</span>
                        <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                        <div class="clearfix"></div>
                    </div>
                </a>
            </div>
        </div>
        <div class="col-md-3">
        </div>
        <div class="col-md-3">
        </div>
    </div>
</div> -->
<div>
    <h1>College Other Details</h1>
    <br>
    <form class="form-horizontal col-md-12">
        <div class="form-group">
            <label class="col-md-3 control-label">Enter College Name: </label>
            <div class="form-group">
                <input class="col-md-6" type="text" ng-model="vm.collegeObject.collname">
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Enter College Code: </label>
            <div class="form-group col-md-6">
                <input type="text" ng-model="vm.collegeObject.collcode">
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Enter Date of Registration: </label>
            <div class="form-group col-md-6">
                <input class="col-md-6" type="date" ng-model="vm.collegeObject.collRegDate">
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Enter Email ID: </label>
            <div class="form-group col-md-6">
                <input type="email" ng-model="vm.collegeObject.collEmail">
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Select Country: </label>
            <div class="form-group">
                <select class="col-md-6" ng-model="vm.collegeObject.country" ng-options="c as c.Country_Description for c in vm.countryList track by c.pk_Country_ID">
                    <option value="">---Select---</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Select State: </label>
            <div class="form-group">
                <select class="col-md-6" ng-model="vm.collegeObject.state" ng-options="s as s.State_Name for s in vm.stateList|filter:{Country_ID:vm.collegeObject.country.pk_Country_ID}:true track by s.State_ID" ng-disabled="!vm.collegeObject.country">
                    <option value="">---Select---</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Select District: </label>
            <div class="form-group">
                <select class="col-md-6" ng-model="vm.collegeObject.district" ng-options="d as d.District_Name for d in vm.districtList|filter:{State_ID:vm.collegeObject.state.State_ID}:true track by d.District_ID" ng-disabled="!vm.collegeObject.state">
                    <option value="">---Select---</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Medium of Instructions: </label>
            <div class="col-md-6">
                <label ng-repeat="instr in vm.instrList" class="form-check-inline">
                    <input type="checkbox" class="form-check-input" checklist-model="vm.collegeObject.instrMedium" checklist-value="instr"> {{instr.mediumName}}
                </label>
            </div>
        </div>
        <br>
        <div class="form-group">
            <label class="col-md-3 control-label" for="radios">College Type: </label>
            <div class="col-md-6" style="padding-left:15px;">
                <label ng-repeat="c in vm.collType" class="radio-inline">
                    <input type="radio" ng-model="vm.collegeObject.collType" ng-value="c.value"> {{c.value}}
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">Vision:</label>
            <div class="col-md-6">
                <textarea class="form-control" rows="3" id="comment" ng-model="vm.collegeObject.vision"></textarea>
            </div>
        </div>
        <br>
        <div class="form-group">
            <div class="col-md-6"></div>
            <div class="col-md-6">
                <button class="btn btn-success btn-lg" ng-click="vm.save(vm.collegeObject)" ng-show=vm.showme>Save</button>
                <button class="btn btn-info  btn-lg" ng-click="vm.update()" ng-hide=vm.showme>Update</button>
            </div>
        </div>
        <br> {{vm.collegeObject}}
    </form>
    <!--    {{vm.instrName}} -->
    <table class="table table-striped">
        <tr>
            <td>Sr.No.</td>
            <td>College Name</td>
            <td>College Code</td>
            <td>Date of Registration</td>
            <td>Country</td>
            <td>State</td>
            <td>District</td>
            <td>Edit</td>
            <td>Delete</td>
        </tr>
        <tr ng-repeat="c in vm.collegeList">
            <td>{{$index+1}}</td>
            <td>{{c.collname}}</td>
            <td>{{c.collcode}}</td>
            <td>{{c.collRegDate|date : 'dd/MM/yyyy'}}</td>
            <td>{{c.country.Country_Description}}</td>
            <td>{{c.state.State_Name}}</td>
            <td>{{c.district.District_Name}}</td>
            <td>
                <button class="btn btn-info" ng-click="vm.change(c)">Edit</button>
            </td>
            <td>
                <button class="btn btn-danger" ng-click="vm.delete(c._id)">Delete</button>
            </td>
        </tr>
    </table>
</div>
==============================================================================================================
rCollege.js
-------------------------------
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


===========================================================================================================
sCollege.js
------------------------
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
======================================================================================================



