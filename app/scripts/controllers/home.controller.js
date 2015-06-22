'use strict';

angular.module('shopthatvid')

.controller('HomeCtrl', function ($scope, $rootScope, adService, PageTypes) {

	$rootScope.changeNavbar(PageTypes.HOME);

	adService.getAds().then(function (ads) {
		if (ads.length) {
			$scope.currentAd = _.first(ads);
			$scope.ads = _.drop(ads);
		}
	}, function () {
		$scope.error = 'Error: Unable to retrieve data. If you are using any ad blocking software/plugins, please disable them and try again.';
	});

	$scope.searchPanel = false;
	
	$scope.toggleSearchPanel = function(){
		$scope.searchPanel = !$scope.searchPanel;
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