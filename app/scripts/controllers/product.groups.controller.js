'use strict';

angular.module('shopthatvid')

.controller('ProductGroupsCtrl', function ($scope, $rootScope, $stateParams, productGroups, ViewTypes, adService) {
	// update the navigation
	$rootScope.changeNavbar(ViewTypes.PRODUCT_GROUPS);
	
	console.log('productGroups', productGroups);
	var currentAd = adService.getCurrentAd();
	if(!currentAd) {
		adService.getAd($stateParams.videoId)
		.success(function(currentAd, headers){
			$rootScope.$broadcast('adDataLoaded');
			$rootScope.navbar.headerTitle = currentAd.name;
		})
		.error(function(err, headers){
			console.log('error while fetching ad data.');
		});

	} else {
		$rootScope.navbar.headerTitle = currentAd.name;
	}
	
});