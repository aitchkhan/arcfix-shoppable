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
	showVideoResumeButton	: false
})

.value('ViewTypes', {
	HOME			: 'HOME',
	PRODUCT_GROUP 	: 'PRODUCT_GROUP',
	PRODUCT_GROUPS	: 'PRODUCT_GROUPS'
	PRODUCT			: 'PRODUCT'
})

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
	
	.state('home', {
		url: '/ad/:videoId',
		templateUrl: '../views/home.html',
		controller: 'HomeCtrl',
		resolve: { 
			currentAd:function(adService, $stateParams, $state){
				return adService.getAd($stateParams.videoId).then(function(res){
					if(!res){
						$state.go('error');
					}
					return res;
				});
			}
		}
	})

	.state('productGroup', {
		url: '/ad/:videoId/productGroup/:productGroupId',
		templateUrl: '../views/product-group.html',
		controller: 'ProductGroupCtrl',
		resolve: { 
			productGroup:function(adService, $stateParams, $state){
				return adService.getProductGroup($stateParams.videoId, $stateParams.productGroupId).then(function(res){
					if(!res){
						$state.go('error');
					}
					return res;
				});
			}
		}
	})

	.state('product', {
		url: '/ad/:videoId/productGroup/:productGroupId/product/:productId',
		templateUrl: '../views/product.html',
		controller: 'ProductCtrl',
		resolve: { 
			productGroup:function(adService, $stateParams, $state){
				return adService.getProduct($stateParams.videoId, $stateParams.productGroupId, $stateParams.productId ).then(function(res){
					if(!res){
						$state.go('error');
					}
					return res;
				});
			}
		}
	})

	.state('productGroups', {
		url: '/ad/:videoId/productGroups',
		templateUrl: '../views/product-groups.html',
		controller: 'ProductGroupsCtrl',
		resolve: { 
			productGroups:function(adService, $stateParams, $state){
				return adService.getProductGroups($stateParams.videoId ).then(function(res){
					if(!res){
						$state.go('error');
					}
					return res;
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
	// 		productGroup:function(adService, $stateParams, $state){
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
