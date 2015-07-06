'use strict';

angular.module('shopthatvid')

.constant('GLOBALS', { 
	adUrl: 'data/ads_fromlive.json', 
	searchUrl: 'data/search.json',
	projectGroupUrl: 'data/product_group.json'
})

.value('NavbarConfig', {
	showProjectGroup		: false,
	showItem 				: false,
	showVideoResumeButton	: false,
	disableNext				: false,
	disablePrev				: false
})

.value('ViewTypes', {
	HOME			: 'HOME',
	PRODUCT_GROUP 	: 'PRODUCT_GROUP',
	PRODUCT_GROUPS	: 'PRODUCT_GROUPS',
	PRODUCT_ITEM	: 'PRODUCT_ITEM'
})

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
	
	.state('home', {
		url: '/ad/:videoId',
		templateUrl: '../views/home.html',
		controller: 'HomeCtrl',
		resolve: { 
			currentAdResponse:function($rootScope, $stateParams, $state, adService){
				return adService.getAd($stateParams.videoId)
				.success(function(res, headers){
					if(!res){
						$rootScope.displayError('Error Occurred while fetchig the video ad content.');
					}
					return res;
				})
				.error(function(res, headers){
					$rootScope.displayError();
				});
			}
		}
	})

	.state('productGroup', {
		url: '/ad/:videoId/productGroup/:productGroupId',
		templateUrl: '../views/product-group.html',
		controller: 'ProductGroupCtrl',
		resolve: { 
			productGroup: function($rootScope, $stateParams, adService, $state){
				return adService.getProductGroup($stateParams.videoId, $stateParams.productGroupId)
				.success(function(res, headers){
					if(!res){
						$rootScope.displayError('Error Occurred while fetchig the video ad content.');
					}
					return res;
				})
				.error(function(res, headers){
					$rootScope.displayError();
				});
			}
		}
	})

	.state('product', {
		url: '/ad/:videoId/productGroup/:productGroupId/product/:productId',
		templateUrl: '../views/product.html',
		controller: 'ProductCtrl',
		resolve: { 
			product:function($rootScope, $stateParams, adService, $state){
				return adService.getProduct($stateParams.videoId, $stateParams.productGroupId, $stateParams.productId )
				.success(function(res, headers){
					if(!res){
						$rootScope.displayError('Error Occurred while fetchig the video ad content.');
					}
					return res;
				})
				.error(function(res, headers){
					$rootScope.displayError();
				});
			}
		}
	})

	.state('productGroups', {
		url: '/ad/:videoId/productGroups',
		templateUrl: '../views/product-groups.html',
		controller: 'ProductGroupsCtrl',
		resolve: { 
			productGroups:function($rootScope, $stateParams, adService, $state){
				return adService.getProductGroups($stateParams.videoId)
				.success(function(res, headers){
					if(!res){
						$rootScope.displayError('Error Occurred while fetchig the video ad content.');
					}
					return res;
				})
				.error(function(res, headers){
					$rootScope.displayError();
				});
			}
		}
	})
	
	// .state('productGroup', {
	// 	// abstract: true,
	// 	url: '/pg',
	// 	template: '<ui-view/>'
	// })

	// .state('productGroup.view', {
	// 	url: '/:id',
	// 	templateUrl: '../views/view-product-group.html',
	// 	controller: 'ViewProductGroupCtrl',
	// 	resolve:{
	// 		productGroup:function($rootScope, $stateParams, adService, $state){
	// 			return adService.getProductGroup($stateParams.id).then(function(res){
	// 				if(!res){
	// 					$state.go('home');
	// 				}
	// 				return res;
	// 			});
	// 		}
	// 	}
	// })

	;


	/* Add New States Above */
	$urlRouterProvider.otherwise('/');

});
