'use strict';

angular.module('shopthatvid')

.constant('GLOBALS', { 
	adUrl: 'data/ads.json', 
	searchUrl: 'data/search.json',
	projectGroupUrl: 'data/product_group.json'
})

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('ad', {
		url: '/ad',
		template: '<ui-view/>'
	})

	.state('ad.view', {
		url: '/:id',
		templateUrl: '../views/view-ad.html',
		controller: 'ViewAdCtrl',
		resolve:{
			ad:function(adService, $stateParams, $state){
				return adService.getAd($stateParams.id).then(function(res){
					if(!res){
						$state.go('home');
					}
					return res;
				});
			}
		}
	})

	.state('home', {
		url: '/',
		templateUrl: '../views/home.html',
		controller: 'HomeCtrl'
	});

	/* Add New States Above */
	$urlRouterProvider.otherwise('/');

});
