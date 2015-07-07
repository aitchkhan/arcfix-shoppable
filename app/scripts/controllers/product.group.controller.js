'use strict';

angular.module('shopthatvid')

.controller('ProductGroupCtrl', function ($scope, $rootScope, $stateParams, productGroup, ViewTypes, adService) {
	// update the navigation
	if(0 === parseInt($rootScope.currentProductGroupId) ) {
		$rootScope.navbar.disablePrev = true;
	}
	var currentAd = adService.getCurrentAd();
	if(!currentAd) {
		adService.getAd($stateParams.videoId)
		.success(function(currentAd, headers){
			$rootScope.$broadcast('adDataLoaded', productGroup);
			if(currentAd && currentAd.productGroupTimeLine.length - 1 === parseInt($rootScope.currentProductGroupId) ) {
				$rootScope.navbar.disableNext = true;
			} else {
				$rootScope.navbar.disableNext = false;
			}
		})
		.error(function(err, headers){
			console.log('error while fetching ad data.');
		});

	} else {
		if(currentAd && currentAd.productGroupTimeLine.length - 1 === parseInt($rootScope.currentProductGroupId) ) {
			$rootScope.navbar.disableNext = true;
		} else {
			$rootScope.navbar.disableNext = false;
		}
	}

	$rootScope.changeNavbar(ViewTypes.PRODUCT_GROUP);

	$scope.currentProductGroup = productGroup.data;
	$rootScope.navbar.headerTitle = $scope.currentProductGroup.title;

	
});