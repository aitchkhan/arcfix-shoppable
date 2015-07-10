'use strict';

angular.module('shopthatvid')

.controller('ProductGroupsCtrl', function ($scope, $rootScope, $timeout, $state, $stateParams, productGroups, ViewTypes, adService) {
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

	$scope.productGroups = productGroups.data;

	$scope.initGroupsView = function() {
		$timeout(function(){
			var groupsView = $('#main_groups').gridView({ template: 'grid_groups', columns: false });
			groupsView.gridView('update');
			$scope.displayImage = true;
		}, 1, true);
	};

	$scope.gotoProductGroup = function(productGroup, index) {
		$state.go('productGroup', { videoId: $rootScope.currentVideoId, productGroupId: index });
	};
	
});