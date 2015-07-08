'use strict';

angular.module('shopthatvid')

.controller('HomeCtrl', function ($scope, $rootScope, $timeout, $stateParams, adService, currentAdResponse, ViewTypes) {

	$rootScope.uiConfig.showVideo = false;
	console.log('$stateParams.videoId: ', $stateParams.videoId);
	if(!$stateParams.videoId) {
		$stateParams.videoId = 1;
		// $scope.error = 'Error: Unable to retrieve get videoId. Please check your url to have valid videoId';
		// $rootScope.changeNavbar(ViewTypes.ERROR);
	}

	$scope.videoId = $stateParams.videoId;
	$rootScope.navbar.headerTitle = 'Shop that video';
	$rootScope.changeNavbar(ViewTypes.HOME);
	$scope.currentProductGroup = {};
	$scope.currentProductGroup.Title = 'Shop that video';
	
	$scope.currentAd = currentAdResponse.data;
	$rootScope.$broadcast('adDataLoaded');
	
	$scope.initStartView = function(){
		$timeout(function() {
			var startPage = $('#main_start').gridView({ template: 'grid_start', itemWidth: 60 });
			startPage.gridView('update', true);
		}, 10);
	};

	$scope.startVideo = function(item){
		if(item) {
			$rootScope.$broadcast('play', item);
		} else {
			$rootScope.$broadcast('play');
		}
	};
	
});