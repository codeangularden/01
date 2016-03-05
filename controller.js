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
    $scope.qualifications = [{ QualID: 1, QualName: 'SSC' }, { QualID: 2, QualName: 'HSC' }, { QualID: 3, QualName: 'Graduate' }, { QualID: 4, QualName: 'Post-Graduate' }
    ];
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
            alert('Record Successfully deleted!!');
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
        $scope.sortOrder = !$scope.sortOrder;
        $scope.orderByCol = x;
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
                    $rootScope.message = "Employee data saved successfully to cloud";
                }
                else {
                    $rootScope.showMessage = true;
                    $rootScope.message = "Employee data not saved,Please contact admin";
                }
                $scope.success = true;
            });

        };


});