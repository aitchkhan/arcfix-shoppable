'use strict';

/**
 * @ngdoc function
 * @name shopthatvid.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the shopthatvid
 */
angular.module('shopthatvid')

  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
