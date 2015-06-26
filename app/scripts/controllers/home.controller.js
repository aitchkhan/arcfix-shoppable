'use strict';

angular.module('shopthatvid')

.controller('HomeCtrl', function ($scope, $rootScope, $stateParams, adService, PageTypes) {

	console.log('$stateParams.videoId: ', $stateParams.videoId);
	if(!$stateParams.videoId) {
		$stateParams.videoId = 1;
		// $scope.error = 'Error: Unable to retrieve get videoId. Please check your url to have valid videoId';
		// $rootScope.changeNavbar(PageTypes.ERROR);
	} 
	$rootScope.changeNavbar(PageTypes.HOME);
	$scope.currentProductGroup = {};
	$scope.currentProductGroup.Title = 'Shop that video';

	adService.getAds($stateParams.videoId).then(function (ads) {
		if (ads.length) {
			$scope.currentAd = _.first(ads);
			$scope.ads = _.drop(ads);
		}
	}, function () {
		$scope.error = 'Error: Unable to retrieve data. If you are using any ad blocking software/plugins, please disable them and try again.';
	});

	$scope.searchPanel = false;
	
	// $(document).ready(function(){
	// 	$( ".search_main" ).css('right', '-500px');
	// })

	$scope.toggleSearchPanel = function(){
		$scope.searchPanel = !$scope.searchPanel;
		// if($scope.searchPanel) {
		// 	$( ".search_main" ).animate({
		// 		right: "0px"
		// 	}, 200, function() {
		// 		// Animation complete.
		// 	});
		// } else {
		// 	$( ".search_main" ).animate({
		// 		right: "-500px"
		// 	}, 400, function() {
		// 		// Animation complete.
		// 	});
		// }
	};

	$scope.search = function () {
		$scope.showSearchResults = true;
		adService.search().then(function (ads) {
			if (ads.length) {
				$scope.searchData = ads;
			}
		});
	};
});