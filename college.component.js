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