'use strict';

angular.module('shopthatvid')

.controller('ProductGroupsCtrl', function ($scope, $rootScope, $timeout, $state, $stateParams, productGroups, ViewTypes, adService) {
	// update the navigation
	$rootScope.changeNavbar(ViewTypes.PRODUCT_GROUPS);
	$rootScope.$broadcast('videIdLoaded', $stateParams);
	
	// console.log('productGroups', productGroups);
	
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
	
	$rootScope.$on('adDataLoaded', function() {
		var currentAd = adService.getCurrentAd();
		$rootScope.navbar.headerTitle = currentAd.name;
		$scope.productGroups = currentAd.productGroups;
		$scope.initGroupsView();
	});

	
	var currentAd = adService.getCurrentAd();
	if(currentAd) {
		$rootScope.navbar.headerTitle = currentAd.name;
		$scope.productGroups = currentAd.productGroups;
		$scope.initGroupsView();
	}
	
});