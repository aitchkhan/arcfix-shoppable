'use strict';

angular.module('shopthatvid')

.constant('GLOBALS', { 
	adUrl: 'data/ads.json', 
	searchUrl: 'data/search.json',
	projectGroupUrl: 'data/product_group.json'
})

.value('NavbarConfig', {
	showProjectGroup		: false,
	showItem 				: false,
	showVideoResumeButton	: false
})

.value('PageTypes', {
	HOME			: 'HOME',
	PRODUCT_GROUP 	: 'PRODUCT_GROUP',
	ITEM			: 'ITEM'
})

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('productGroup', {
		url: '/pg',
		template: '<ui-view/>'
	})

	.state('productGroup.view', {
		url: '/:id',
		templateUrl: '../views/view-product-group.html',
		controller: 'ViewProductGroupCtrl',
		resolve:{
			productGroup:function(adService, $stateParams, $state){
				return adService.getProductGroup($stateParams.id).then(function(res){
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
