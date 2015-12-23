(function(){
  'use strict';

  angular.module('vgsp', []);

  angular.module('vgsp').config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');

}]);

}());
