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

