'use strict';

/**
 * @ngdoc function
 * @name shopthatvid.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the shopthatvid
 */
angular.module('shopthatvid')

.controller('MainCtrl', function ($scope, $state, $timeout, $rootScope, adService, ViewTypes) {
	
	$scope.gotoHome = function() {
		var currentAd = adService.getCurrentAd();
		if(currentAd) {
			console.log('currentAd', currentAd);
			$state.go('home', { videoId: currentAd._id });
		} else if($rootScope.currentVideoId){
			$state.go('home', { videoId: $rootScope.currentVideoId });
		}
	};

	$scope.resumePlayer = function(){
		$rootScope.$broadcast('resume');
	};

	$scope.showPrevious = function(){
		var currentAd = adService.getCurrentAd();
		if(parseInt($rootScope.currentProductGroupId) - 1 >=0 )  {
			$rootScope.currentProductGroupId = parseInt($rootScope.currentProductGroupId) - 1;
			if($rootScope.navbar.disableNext) {
				$rootScope.navbar.disableNext = false;	
			}
		} 

		if(0 === parseInt($rootScope.currentProductGroupId) ) {
			$rootScope.navbar.disablePrev = true;
		}

		if(parseInt($rootScope.currentProductGroupId) >= 0) {
			$state.go('productGroup', { videoId: $rootScope.currentVideoId, productGroupId: $rootScope.currentProductGroupId });
		}
	};

	$scope.showNext = function(){
		var currentAd = adService.getCurrentAd();
		if(currentAd && currentAd.productGroups.length > (parseInt($rootScope.currentProductGroupId) +1) ) {
			$rootScope.currentProductGroupId = parseInt($rootScope.currentProductGroupId) + 1;
			if($rootScope.navbar.disablePrev) {
				$rootScope.navbar.disablePrev = false;	
			}
		} 

		if(currentAd && currentAd.productGroups.length - 1 === parseInt($rootScope.currentProductGroupId) ) {
			$rootScope.navbar.disableNext = true;
		}

		if(currentAd && currentAd.productGroups.length > $rootScope.currentProductGroupId) {
			$state.go('productGroup', { videoId: $rootScope.currentVideoId, productGroupId: $rootScope.currentProductGroupId });
		}
	};

	$scope.seekAndPlay = function(){
		var currentProductGroup = adService.getCurrentProductGroup();
		$rootScope.$broadcast('seekAndPlay', currentProductGroup);
	};

	$scope.showAllProductGroup = function(){
		$state.go('productGroups', { videoId: $rootScope.currentVideoId });
	};

	$scope.toggleSearchPanel = function(){
		if(!$rootScope.showSearchPanel) {
			$rootScope.showSearchPanel = true;
			$rootScope.openSearchPanel = true;
		} else {
			$rootScope.openSearchPanel = false;
			$timeout(function(){
				$rootScope.showSearchPanel = false;
			}, 500, true);
		}
	};

	$scope.search = function(){
		var keyword = $('#search_text').val();
		adService.getSearchData(keyword)
		.success(function(data, headers){
			console.log(data);
			$scope.searchData = data;
			$scope.showSearchResults = true;
			if(!$scope.searchScroll) {
				$scope.searchScroll = $('#main_search .search_results').jScroll({ pad: 23 });
			}
			$timeout(function(){
				$scope.searchScroll.jScroll('update');
			},1, true);
		})
		.error(function(error, headers){
			$scope.searchError = 'Error Occured.';
		});
	};

	$scope.gobackToProductGroup = function(){
		$state.go('productGroup', { videoId: $rootScope.currentVideoId, productGroupId: $rootScope.currentProductGroupId });
	};

});
