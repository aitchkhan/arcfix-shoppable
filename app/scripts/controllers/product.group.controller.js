'use strict';

angular.module('shopthatvid')

.controller('ProductGroupCtrl', function ($scope, $rootScope, $timeout, $state, $stateParams, productGroup, ViewTypes, adService) {
	$('#main_group').css('opacity', 0);
	$rootScope.$broadcast('videIdLoaded', $stateParams);
	
	// update the navigation
	if(0 === parseInt($rootScope.currentProductGroupId) ) {
		$rootScope.navbar.disablePrev = true;
	}

	$scope.initGroupView = function(){
		if($scope.currentProductGroup) {
			$timeout(function() {
				var groupPage = $('#main_group').gridView({ template: 'grid_group', itemWidth: 60, itemHeight: 110 });
				groupPage.gridView('update', true);
				$('#main_group').css('opacity', 1);
				// $('#main_start').find('.head_dsc').jScroll({ autoresize: true })
				var headerDscScroll = $('#main_group .grid_head .head_dsc').jScroll({ autoresize: true });
			}, 10, true);
		}
	};
	
	var currentAd = adService.getCurrentAd();
	if(!currentAd) {
		adService.getAd($stateParams.videoId)
		.success(function(currentAd, headers){
			$rootScope.currentAd = currentAd;
			productGroup = adService.getProductGroup($stateParams.videoId, $stateParams.productGroupId);
			$scope.currentProductGroup = productGroup;
			$rootScope.changeNavbar(ViewTypes.PRODUCT_GROUP);

			$rootScope.$broadcast('adDataLoaded', productGroup);
			
			$rootScope.navbar.headerTitle = $scope.currentProductGroup.title;
			if(currentAd && currentAd.productGroupTimeLine.length - 1 === parseInt($rootScope.currentProductGroupId) ) {
				$rootScope.navbar.disableNext = true;
			} else {
				$rootScope.navbar.disableNext = false;
			}
			$scope.initGroupView();
		})
		.error(function(err, headers){
			console.log('error while fetching ad data.');
		});

	} else {
		$rootScope.changeNavbar(ViewTypes.PRODUCT_GROUP);

		$scope.currentProductGroup = productGroup;
		$rootScope.navbar.headerTitle = $scope.currentProductGroup.title;
		if(currentAd && currentAd.productGroupTimeLine.length - 1 === parseInt($rootScope.currentProductGroupId) ) {
			$rootScope.navbar.disableNext = true;
		} else {
			$rootScope.navbar.disableNext = false;
		}
		$scope.initGroupView();
	}

	$scope.openProduct = function(product, productIndex){
		$state.go('product', { videoId: $rootScope.currentVideoId, productGroupId: $rootScope.currentProductGroupId, productId: productIndex });
	};

	var init = function(currentAd) {
		$rootScope.currentProductGroupId = $stateParams.productGroupId;
		$scope.initGroupView();
		if(currentAd && currentAd.productGroups.length - 1 === parseInt($rootScope.currentProductGroupId) ) {
			$rootScope.navbar.disableNext = true;
		} else {
			$rootScope.navbar.disableNext = false;
		}
		$rootScope.changeNavbar(ViewTypes.PRODUCT_GROUP);

		$scope.currentProductGroup = currentAd.productGroups[$rootScope.currentProductGroupId];
		$rootScope.navbar.headerTitle = $scope.currentProductGroup.name;
	};

	$rootScope.$on('adDataLoaded', function(adData) {
		var currentAd = adService.getCurrentAd();
		init(currentAd);
	});

	var currentAd = adService.getCurrentAd();
	if(currentAd) {
		init(currentAd);
	}

});