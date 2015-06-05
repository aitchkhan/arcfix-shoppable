angular.module('shopthatvid')
  .config(function ($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/modules/home/home.html',
      controller: 'HomeCtrl'
    });
});

