'use strict';

angular.module('shopthatvid')

.controller('ProductGroupCtrl', function ($scope, $rootScope, $timeout, $state, $stateParams, productGroup, ViewTypes, adService) {
	$('#main_group').css('opacity', 0);
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

	$scope.initGroupView = function(){
		$timeout(function() {
			var groupPage = $('#main_group').gridView({ template: 'grid_group', itemWidth: 60, itemHeight: 110 });
			groupPage.gridView('update', true);
			$('#main_group').css('opacity', 1);
			// $('#main_start').find('.head_dsc').jScroll({ autoresize: true })
			var headerDscScroll = $('#main_group .grid_head .head_dsc').jScroll({ autoresize: true });
		}, 1, true);
	};

	$scope.openProduct = function(product, productIndex){
		$state.go('product', { videoId: $rootScope.currentVideoId, productGroupId: $rootScope.currentProductGroupId, productId: productIndex });
	};
});