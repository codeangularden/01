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
