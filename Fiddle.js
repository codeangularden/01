
//Web.config Start=======================================================================================================

  <appSettings>
   <add key="MongoDBServer" value="mongodb://localhost:27017" />
   <add key="DBName" value="EmpDB" />
  </appSettings>

  //Web.config End=======================================================================================================

//app.js Start========================================================================================
var app = angular.module('myApp', ['checklist-model', 'ngMessages','ngRoute']);
//app.js End========================================================================================



//DBUtility Start ========================================================================================
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Driver;
using System.Configuration;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Driver.Builders;
using MongoDB.Bson.IO;

namespace EmployeeRegistration_ModelLess.DbUtilityDB
{
    public class DbUtility
    {
        protected MongoDatabase mongoDB { get; set; }
        public DbUtility()
        {
            var mongoClient = new MongoClient(Convert.ToString(ConfigurationManager.AppSettings["MongoDBServer"]));
            MongoServer Server = mongoClient.GetServer();
            mongoDB = Server.GetDatabase(Convert.ToString(ConfigurationManager.AppSettings["DBName"]));
        }
       
        public bool SaveDocument(string objectToSave, string collectionName)
        {                          
                var document = BsonSerializer.Deserialize<BsonDocument>(objectToSave);
                var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
                collection.Insert(document);                          
                return true;
        }

        public bool SaveDocumentBsonArray(string objectToSave, string collectionName)
        {
            var collection = mongoDB.GetCollection<BsonArray>(collectionName);
            collection.RemoveAll();
            var document = BsonSerializer.Deserialize<BsonArray>(objectToSave);            
            collection.InsertBatch(document);
            return true;
        }
        public bool UpdateDocument(string objectToSave, string collectionName, string key, string value)
        {

            var document = BsonSerializer.Deserialize<BsonDocument>(objectToSave);
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            collection.Update(
            Query.EQ(key, value),
            Update.Replace(document),
            UpdateFlags.Upsert);

            return true;
        }
        public bool UpdateDocumentByObjectId(string objectToSave, string collectionName)
        {

            var document = BsonSerializer.Deserialize<BsonDocument>(objectToSave);
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            collection.Save(document);
            return true;
        }
        public bool DeleteDocumentByObjectId(string collectionName,ObjectId id)
        {
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            var query = Query.EQ("_id", id);
            collection.Remove(query);
            return true;
        }
        public bool DeleteDocument(string collectionName,string key, string id)
        {
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            var query = Query.EQ(key, id);
            collection.Remove(query);
            return true;
        }
        public string GetAllDocuments(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);
            return collection.FindAllAs<BsonDocument>().SetFields(Fields.Exclude("_id")).ToJson();
        }
       

        public string GetAllDocumentsWithObjectId(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return collection.FindAllAs<BsonDocument>().ToJson(jsonSettings);
        }
        public string GetDocumentById(string collectionName, string key, string value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).SetFields(Fields.Exclude("_id")).ToJson(jsonSettings);
        }
        public string GetDocumentById(string collectionName, string key, ObjectId value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).SetFields(Fields.Exclude("_id")).ToJson(jsonSettings);
        }
        public string GetDocumentByIdWithObjectId(string collectionName, string key, string value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).ToJson(jsonSettings);
        }
        public string GetDocumentByIdWithObjectId(string collectionName, string key, ObjectId value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).ToJson(jsonSettings);
        }
        public MongoCollection GetCollection(string collectionName)
        {
            return mongoDB.GetCollection(collectionName);
        }

        public long GetCountOfCollection(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);
            return collection.Count();
        }    
        public string GetMaxOfAttribute(string collectionName, string attributename)
        {
            var collection = mongoDB.GetCollection(collectionName);
            string max = "1";
            if (collection.FindAll().SetSortOrder(SortBy.Descending(attributename)).SetLimit(1).FirstOrDefault() != null)
            {
                max = collection.FindAll().SetSortOrder(SortBy.Descending(attributename)).SetLimit(1).FirstOrDefault().ToArray()[1].Value.ToString();
            }
            return max;
        }

        public string GetAllDocumentsWithObjectIdGroupBy(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);

            var group = new BsonDocument 
                { 
                    { "$group", 
                        new BsonDocument 
                            { 
                                { "_id", new BsonDocument 
                                             { 
                                                 { 
                                                     "name","$name"
                                                 } 
                                             } 
                                }, 
                                { 
                                    "Count", new BsonDocument 
                                                 { 
                                                     { 
                                                         "$sum", 1 
                                                     } 
                                                 } 
                                } 
                            } 
                  } 
                };

            var pipeline = new[] { group };
            var result = collection.Aggregate(pipeline);

            var matchingExamples = result.ResultDocuments
                .Select(x => x.ToBsonDocument())
                .ToList();
           
            List<BsonDocument> countlst = matchingExamples.ToList();

            string json = GetAllDocumentsWithObjectId("EmpDetails");

            var mbd = mongoDB.GetCollection(collectionName);
            List<BsonDocument> doclst = mbd.FindAllAs<BsonDocument>().ToList();


            foreach (var b in doclst)
            {

                foreach (BsonDocument c in countlst)
                {
                    var a = c["_id"].AsBsonDocument;

                    if (b["name"].AsString.Equals(a["name"].AsString))
                    {
                        b.Add("Count", c["Count"].AsNullableInt32);
                    }

                }

            }
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return doclst.ToJson(jsonSettings);


            //return collection.FindAllAs<BsonDocument>().ToJson(jsonSettings);
        }



        #region Model Based Operations
        /// <summary>
        /// Save The Document, override the ToString() method in the model to provide the collection name
        /// </summary>
        /// <param name="objectToSave"></param>
        /// <returns></returns>
        public bool SaveCollection(object objectToSave)
        {
            string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(objectToSave);
            BsonDocument document = BsonDocument.Parse(jsonString);

            var collection = mongoDB.GetCollection(objectToSave.ToString());

            collection.Insert(objectToSave);
            return true;
        }

        public bool SaveCollection(object objectToSave, string collectionName)
        {
            string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(objectToSave);
            BsonDocument document = BsonDocument.Parse(jsonString);

            var collection = mongoDB.GetCollection(collectionName);

            collection.Insert(objectToSave);
            return true;
        }

        public MongoCollection<T> GetAllDocuments<T>(string collectionName)
        {
            return mongoDB.GetCollection<T>(collectionName);
        }
        #endregion

        //#region StrictModel Based Operations
        //public List<Country> getAllCountry()
        //{
        //    List<Country> oList = new List<Country>();
        //    var collection = mongoDB.GetCollection<Country>("Country");
        //    foreach (Country country in collection.FindAll())
        //    {
        //        oList.Add(country);
        //    }
        //    return oList;
        //}

        //public List<State> getAllStates()
        //{
        //    List<State> oList = new List<State>();
        //    var collection = mongoDB.GetCollection<State>("State");
        //    foreach (State state in collection.FindAll())
        //    {
        //        oList.Add(state);
        //    }
        //    return oList;
        //}

        //public List<District> getAllDistricts()
        //{
        //    List<District> oList = new List<District>();
        //    var collection = mongoDB.GetCollection<District>("District");
        //    foreach (District district in collection.FindAll())
        //    {
        //        oList.Add(district);
        //    }
        //    return oList;
        //}

        //public void insert(Student stud)
        //{
        //    try
        //    {
        //        MongoCollection<Student> collection = mongoDB.GetCollection<Student>("Student");
        //        collection.Save(stud);
        //    }

        //    catch { };
        //}

        //public List<Student> getStudentList()
        //{
        //    List<Student> list = new List<Student>();
        //    var collection = mongoDB.GetCollection<Student>("Student");
        //    foreach (Student stud in collection.FindAll())
        //    {
        //        list.Add(stud);
        //    }
        //    return list;

        //}

        //public void DeleteStudent(Student StudentObj)
        //{
        //    MongoCollection<Student> collection = mongoDB.GetCollection<Student>("Student");
        //    IMongoQuery query = Query.EQ("_id", new ObjectId(StudentObj.Id));
        //    collection.Remove(query);
        //}

        //#endregion
    }
}

//DBUtility End========================================================================================

//EmployeeRegistration.cs Start===============================================================================================================
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using EmployeeRegistration_ModelLess.DbUtilityDB;
using System.Web.Services;
using System.Web.Script.Services;
using MongoDB.Bson;

namespace EmployeeRegistration_ModelLess.View
{
    public partial class EmployeeRegistration : System.Web.UI.Page
    {
        #region Private variables

        static DbUtility oDAL = new DbUtility();
        static string returnString = String.Empty;

        #endregion

        #region WebMethods

        [WebMethod]
        public static bool SaveEmployee(string empObj)
        {
            return oDAL.SaveDocument(empObj, "EmpDetails");
            
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true)]
        public static string GetAllEmployees()
        {
            //return oDAL.GetAllDocumentsWithObjectId("EmpDetails");
            return oDAL.GetAllDocumentsWithObjectIdGroupBy("EmpDetails");
        }

        [WebMethod]
        public static bool DeleteEmployee(string empid)
        {
            return oDAL.DeleteDocumentByObjectId("EmpDetails", ObjectId.Parse(empid));
        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true)]
        public static string GetAllReligions()
        {
            return oDAL.GetAllDocumentsWithObjectId("Religion");
        }
        [WebMethod]
        public static bool EditEmployee(string empObj)
        {
            return oDAL.UpdateDocumentByObjectId(empObj, "EmpDetails");
        }
        [WebMethod]
        public static bool SaveEmployeeToCloud(string empObj)
        {
            return oDAL.SaveDocumentBsonArray(empObj, "EmpDetails");
        }
        #endregion

    }
}
//EmployeeRegistration End=========================================================================================





//Controller.js Start===================================================================================
app.controller('myController', function ($scope, $http) {
    $scope.employeeList = {};
    $scope.employee = {};
    $scope.countrylist = countryList;
    $scope.statelist = stateList;
    $scope.districtlist = dataArrStateWiseDistricts;

    $scope.gender = ["Male", "Female", "Others"];

    $scope.hobbyList = [
    { "HobbyID": "1", "HobbyName": "Sketching" }, { "HobbyID": "2", "HobbyName": "Painting" }, { "HobbyID": "3", "HobbyName": "Travelling" },
    { "HobbyID": "4", "HobbyName": "Swimming"}];


    $scope.users = {};
    $scope.userList = {};
    $scope.users = [
    { username: 'Amar', fName: 'Amar Sinha', cName: 'ERA Computer', city: 'Akola', state: 'MH' },
    { username: 'Sunil', fName: 'Sunil Malhotra', cName: 'ARA Computer', city: 'Pune', state: 'MH' }
   ];

    $scope.user = {};


    $scope.qualifications = [{ QualID: 1, QualName: 'SSC' }, { QualID: 2, QualName: 'HSC' }, { QualID: 3, QualName: 'Graduate' }, { QualID: 4, QualName: 'Post-Graduate' }];
    $scope.religions = {};
    $scope.enableEdit = false;
    $scope.showMsg = false;
    //    $scope.showhidevar = true;

    //    $scope.showhide = function (showhidevar) {
    //        $scope.showhidevar = !showhidevar;
    //    };

    // Clearing the form to add a new record

    $scope.newStudent = function () {
        $scope.employee = {};
    };

    //Saving the employee data

    $scope.Save = function () {
        alert('In Save');
        if (!$scope.enableEdit) {
            $http({
                url: "EmployeeRegistration.aspx/SaveEmployee",
                method: "POST",
                data: { empObj: angular.toJson($scope.employee) }
            })
            .success(function () {
                $scope.showMsg = true;
                $scope.message = 'Data Saved Successfully!!';
                $scope.getAll();
            })
            .error(function (error) {
                console.log('Error: ' + error);
            });
        }
        else {
            $http({
                url: "EmployeeRegistration.aspx/EditEmployee",
                method: "POST",
                data: { empObj: angular.toJson($scope.employee) }
            })
            .success(function (data) {
                $scope.showMsg = true;
                $scope.message = 'Data Updated Successfully!!';
                $scope.getAll();

            })
            .error(function (error) {
                console.log('Error:' + error);
            });
        }
    };

    //Listing the Employee Data

    $scope.getAll = function () {
        alert('In getAll()');
        //  debugger;
        $http({
            url: "EmployeeRegistration.aspx/GetAllEmployees",
            method: "GET",
            data: {},
            headers: { 'Content-Type': 'application/json' }
        })
            .success(function (data) {
                $scope.employeeList = angular.fromJson(data.d);
                // $scope.employee = JSON.parse(data.d);
                console.log($scope.employeeList);
            })
            .error(function (error) {
                console.log('Error:' + error);
            });
    };

    //Function to populate the fields on click of Edit

    $scope.EnableEdit = function (emp) {
        // debugger;
        $scope.employee = emp;
        $scope.employee.DOB = new Date(emp.DOB);
        $scope.enableEdit = true;


    };

    //Calling the getAll() method to fill the table

    $scope.getAll();

    //Delete function

    $scope.Delete = function (id) {
        $http({
            url: "EmployeeRegistration.aspx/DeleteEmployee",
            method: "POST",
            data: { empid: id }
        }).success(function (id) {
            $scope.message = "Record Successfully deleted!!";
            $scope.getAll();
        })
        .error(function (error) {
            console.log('Error:' + error);
        });


    };

    //getAllReligions from Mongo

    $scope.getAllReligions = function () {
        alert('In get all rel');
        $http({
            url: "EmployeeRegistration.aspx/GetAllReligions",
            method: "GET",
            data: {},
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.religions = angular.fromJson(data.d);
            console.log($scope.religions);
        }).error(function (error) {
            console.log('Error:' + error);
        });
    };

    //Calling the getAllReligions() to fill the dropdownlist at pageload from database
    $scope.getAllReligions();

    //Function to return the rows having Sal>50000
    $scope.filterFn = function (emp) {
        $scope.employee = emp;

        if (emp.salary >= 50000)
            return true;
        else
            return false;
    };

    //function for sorting

    $scope.sortOrder = true;

    $scope.orderByMe = function (x) {
        $scope.orderByCol = x;
        $scope.sortOrder = !$scope.sortOrder;
       
    };


    //Local Storage

    //Save Employee to LocalStorage

    $scope.saveEmpToLocal = function (emp) {
        // debugger;
        var myLocalList = []; //load existing array at init        
        var key = 'myLocal';

        if (localStorage.getItem("myLocal") != null) {
            myLocalList = JSON.parse(localStorage.getItem("myLocal"));
        }
        myLocalList.push(emp);
        localStorage.setItem(key, JSON.stringify(myLocalList));
        //$scope.getCountFromLocal();

    };

    //get Employee data  from Local Storage

    $scope.getEmpFromDataLocalStorage = function () {
       // debugger;
        if (localStorage.getItem("myLocal") != null) {
            $scope.EmpListLocal = JSON.parse(localStorage.getItem("myLocal"));
        }

    };

    //calling the function to get the data from LocalStorage
    $scope.getEmpFromDataLocalStorage();


    //Save the data from Local Storage to cloud
    $scope.saveEmpDataFromLocalToCloud = function () {
            debugger;
            $http({
                url: "EmployeeRegistration.aspx/SaveEmployeeToCloud",
                method: "POST",
                data: { empObj: angular.toJson(JSON.parse(localStorage.getItem("myLocal"))) }
            })
            .success(function (data) {
                if (data.d == true) {
                    localStorage.removeItem("myLocal");
                    $rootScope.showMessage = true;
                    $rootScope.message = "Employee data saved successfully to cloud!!";
                }
                else {
                    $rootScope.showMessage = true;
                    $rootScope.message = "Employee data not saved,Please contact admin";
                }
                $scope.success = true;
            });

        };


});

//Controller.js End===========================================================================================================

//Filter.js Start==============================================================================================================

app.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

//Filter.js End======================================================================================================

//router.js Start=======================================================================================================

app.config(function ($routeProvider) {
    $routeProvider
    .when('/ListLocalStorage',{
        templateUrl: '/View/ListLocalStorage.htm',
        controller: 'myController'
    })
    .when('/index',{
        templateUrl: '/View/AddEmp.htm',
        controller: 'myController'
    })
     .otherwise({
         redirectTo: '/index'
     });
     
});

//router.js End============================================================================================================


  //AddEmp.html Start=================================================================================================
   <form class="form-horizontal" role="form" name="empform" novalidate>

        <div class="col-md-10 main">
            
            <div class="alert alert-danger" ng-show="showMsg">
                {{message}}
            </div>
            <!-- Form Name -->

            <fieldset>
                        <!-- Form Name -->
                        <legend>Form Name</legend>
                        <!-- Select Basic -->
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="selectbasic">
                                Select Username :
                            </label>
                            <div class="col-md-4">
                                <select id="selectbasic" name="selectbasic" class="form-control" ng-options="user as user.username for user in users"
                                    ng-model="user">
                                    <option value="">--Select--</option>
                                </select>
                            </div>
                            <!--     {{user|json}}-->
                        </div>
                        <div class="form-group" align="center">
                            <fieldset>
                                <legend>User Details</legend>Full Name :
                                <label ng-model="user.fName">
                                    {{user.fName}}
                                </label>
                                <br />
                                Centre Name :
                                <label ng-model="user.cName">
                                    {{user.cName}}
                                </label>
                                <br />
                                City :
                                <label ng-model="user.city">
                                    {{user.city}}
                                </label>
                                <br />
                                State :
                                <label ng-model="user.state">
                                    {{user.state}}
                                </label>
                                <br />
                            </fieldset>
                        </div>
                    </fieldset>


            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label">
                    Enter Full Name :
                </label>
                <div class="col-md-4">
                    <input class="form-control input-md" name="fname" type="text" placeholder="Full Name"
                        ng-model="employee.name" required>
                </div>
                <div class="form-group" ng-messages="empform.fname.$error" ng-show="empform.fname.$touched && empform.fname.$invalid">
                    <p ng-message="required">
                        This field is required
                    </p>
                </div>
            </div>
            <!-- Multiple Radios (inline) -->
            <div class="form-group">
                <label class="col-md-4 control-label">
                    Select Gender :
                </label>
                <div class="col-md-4">
                    <label ng-repeat="gen in gender" ng-model="gender" class="radio-inline">
                        <input type="radio" value="{{gen}}" ng-model="employee.gender" name="gend" required>{{gen}}
                    </label>
                </div>
                <div ng-messages="empform.gend.$error" ng-show="empform.gend.$error">
                    <p ng-message="required">
                        This field is required</p>
                </div>
            </div>
            <!-- Select Basic -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="selectbasic">
                    Select Religion</label>
                <div class="col-md-4">
                    <select class="form-control" ng-model="employee.religion">
                        <option value="">--Select--</option>
                        <option ng-repeat="rel in religions">{{rel.Name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-4 control-label">
                    Enter DOB :
                </label>
                <div class="col-md-4">
                    <input type="month" placeholder="dd-MM-yyyy" ng-model="employee.DOB" />
                </div>
            </div>
            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Enter Mobile No :
                </label>
                <div class="col-md-4">
                    <input class="form-control input-md" type="number" name="mobno" placeholder="Mobile No"
                        ng-model="employee.mobileNo" ng-maxlength="10" required>
                </div>
                <p class="error" ng-show="empform.mobno.$error.maxlength">
                    Cannot be greater than 10 digits</p>
            </div>
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Enter Salary :
                </label>
                <div class="col-md-4">
                    <input class="form-control input-md" name="sal" type="number" placeholder="Salary"
                        ng-model="employee.salary" ng-maxlength="7" required>
                </div>
                <p ng-show="empform.sal.$error.maxlength">
                    Salary cannot be more than 7 digits</p>
            </div>
            <!-- Select Basic -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Select Country :</label>
                <div class="col-md-4">
                    <select class="form-control" ng-options="count as count.Country_Description for count in countrylist track by count.pk_Country_ID"
                        ng-model="employee.address.country">
                        <option value="">--Select--</option>
                    </select>
                </div>
            </div>
            <!-- Select Basic -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Select State :
                </label>
                <div class="col-md-4">
                    <select class="form-control" ng-disabled="!employee.address.country" ng-options="st as st.State_Name for st in statelist|filter:{Country_ID:employee.address.country.pk_Country_ID}:true track by st.State_ID"
                        ng-model="employee.address.state">
                        <option value="">--Select--</option>
                        <!-- <option ng-repeat = "st.State_ID as st.State_Name for st in statelist">{{st.State_Name}}</option>-->
                    </select>
                </div>
            </div>
            <!-- Select Basic -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Select District :
                </label>
                <div class="col-md-4">
                    <select class="form-control" ng-disabled="!employee.address.state" ng-options="dis as dis.text for dis in districtlist|filter:{State_ID:employee.address.state.State_ID}:true track by dis.value"
                        ng-model="employee.address.district">
                        <option value="">--Select--</option>
                    </select>
                </div>
            </div>
            <!-- Textarea -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Enter Address :
                </label>
                <div class="col-md-4">
                    <textarea class="form-control" ng-model="employee.address.firstline" rows="3"></textarea>
                </div>
            </div>
            <!-- Select Multiple -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Select Qualifications</label>
                <div class="col-md-4">
                    <select class="form-control" multiple="multiple" ng-options="qual as qual.QualName for qual in qualifications track by qual.QualID"
                        ng-model="employee.qualifications">
                        <option value="" />
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-4 control-label" for="">
                    Select Hobbies :
                </label>
                <label class="checkbox-inline" ng-repeat="hob in hobbyList">
                    <input type="checkbox" data-checklist-model="employee.hobbies" data-checklist-value="hob" />{{hob.HobbyName}}
                </label>
            </div>
            <div class="form-group">
                <div style="height: 30px">
                </div>
                <div align="center">
                      <button type="submit" ng-click="Save();" class="btn btn-success" ng-disabled="empform.$invalid">
                            Save</button>

                    <button type="submit" ng-click="saveEmpToLocal(employee);" class="btn btn-success"
                        ng-disabled="empform.$invalid">
                        Save to Local Storage</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="submit" class="btn" ng-click="newStudent();">
                        New</button>
                </div>
            </div>
            <div class="form-group">
                <div align="right">
                    <input type="checkbox" ng-model="hideEmpList" />Hide Employee List
                </div>
                <br />
                <div class="form-group" align="right">
                    Enter Salary Range:
                    <input type="text" ng-model="salRange" />
                    <br />
                </div>
                <div align="right" ng-show="employeeList.length>0" ng-hide="hideEmpList">
                    <h3>
                        List of Employees</h3>
                    <table class="table table-bordered table-hover" align="right">
                        <thead>
                            <tr>
                                <th>
                                    Sr.No.
                                </th>
                                <th ng-click="orderByMe('name');" style="cursor: pointer">
                                    Employee Name
                                </th>
                                <th ng-click="orderByMe('salary');" style="cursor: pointer">
                                    Salary
                                </th>
                                <th>
                                    Count of Students with same Name
                                </th>
                                <th>
                                    Edit
                                </th>
                                <th>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="emp in employeeList | orderBy:orderByCol:sortOrder | unique:'name'">
                                <td>
                                    {{$index + 1}}
                                </td>
                                <td>
                                    {{emp.name}}
                                </td>
                                <td>
                                    {{emp.salary}}
                                </td>
                                <td>
                                    {{emp.Count}}
                                </td>
                                <td>
                                    <button type="submit" ng-click="EnableEdit(emp);">
                                        Edit</button>
                                </td>
                                <td>
                                    <button type="submit" ng-click="Delete(emp._id.$oid);">
                                        Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {{employee|json}}
        </div>
        </form>

        //AddEmp.html End=================================================================================================

//index.html Start===============================================================================================

        <!DOCTYPE html>
<html>
<head>
    <title>Employee Registration Form</title>
    <!--CSS import -->
    <script src="../Scripts/jquery-1.4.1.js" type="text/javascript"></script>
    <link href="../Styles/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../Styles/dashboard.css" rel="stylesheet" type="text/css" />
    <!--Scripts for angular-->
        <script src="../Scripts/angular.min.js" type="text/javascript"></script>
    <script src="../Scripts/angular-route.js" type="text/javascript"></script>
    <script src="../Scripts/checklist-model.js" type="text/javascript"></script>
    <script src="../Scripts/angular-messages.js" type="text/javascript"></script>
    <!--Controllers and required JS -->
    <script src="../app.js" type="text/javascript"></script>
      <script src="../router.js" type="text/javascript"></script>
    <script src="../Controller/controller.js" type="text/javascript"></script>
    <script src="../Controller/Filters.js" type="text/javascript"></script>
  
    <!--JSON import-->
    <script src="../JSON/Country.js" type="text/javascript"></script>
    <script src="../JSON/State.js" type="text/javascript"></script>
    <script src="../JSON/StateWiseDistrict.js" type="text/javascript"></script>
</head>
<body ng-app="myApp" ng-controller="myController">
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">               
                <a class="navbar-brand" href="#">Employee Registration</a>
            </div>
        </div>
    </nav>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2 sidebar">
                <ul class="nav nav-sidebar">
                    <li class="active"><a href="#">Menu <span class="sr-only">(current)</span></a></li>
                    <li><a href="#ListLocalStorage">List from Local Storage</a> </li>
                    <li><a href="#AddEmp">Add Employee</a> </li>
                </ul>
            </div>
        </div>
       <div ng-view>

       </div>
    </div>
</body>
</html>


//inde.html End=================================================================================================

//ListLocalStorage Start=========================================================================================
<!DOCTYPE>
<html>
<head>
    <title>List from Local Storage</title>
   
</head>
<body>
<h3>List of Employees</h3>
                    <table class="table table-bordered table-hover" align="right">
                        <thead>
                            <tr>
                                <th>
                                    Sr.No.
                                </th>
                                <th ng-click="orderByMe('name');" style="cursor: pointer">
                                    Employee Name
                                </th>
                                <th ng-click="orderByMe('salary');" style="cursor: pointer">
                                    Salary
                                </th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="emp in EmpListLocal | orderBy:orderByCol:sortOrder | unique:'name'">
                                <td>
                                    {{$index + 1}}
                                </td>
                                <td>
                                    {{emp.name}}
                                </td>
                                <td>
                                    {{emp.salary}}
                                </td>
                                                            
                            </tr>
                        </tbody>
                    </table>
                    <div class="form-group" align="right">
                    <button type = "submit" class="btn btn-success" ng-click="saveEmpDataFromLocalToCloud();">Sync to Cloud</button></div>

</body>
</html>

//ListLocalStorage End======================================================================================================================

