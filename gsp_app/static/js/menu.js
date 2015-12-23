(function() {
  'use strict';

  angular.module('vgsp.menu', ['ngResource', 'ngAnimate', 'angular-collapse'])
    .factory('MenuFactory', ['$resource',loadJSON ])
    .controller('menu.controller', ['$scope', '$location', 'MenuFactory', menuController])
    .directive('menu', menu);


  function loadJSON($resource) {
    /* Strictly follow the JSON structure provided in dynamic-menu.json */
    return $resource('json/menu.json', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: false
      }
    });
  }

  function menuController($scope, $location, MenuFactory) {
    $scope.navigationDetail = MenuFactory.query();
    console.log($scope.navigationDetail);
    $scope.$on('$routeChangeSuccess', function () {
      var path = '#app' + $location.path();
      var found = false;
      $scope.navigationDetail.$promise.then(function (result) {
        $scope.navigationDetail = result;
        angular.forEach($scope.navigationDetail.Menu, function (menu) {
          if (path.indexOf(menu.url) == 0) {
            $scope.navigationDetail.activeMenuId = menu.menuId;
            found = true;
          }
        });
      });
    });
  }

  function menu() { //el programa más coshino
      return {
        templateUrl: 'templates/menu.template.html',
      };
  }


}());