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

	
	// $scope.videoId = $stateParams.videoId;
	$rootScope.navbar.headerTitle = 'Shop that video';
	$rootScope.changeNavbar(ViewTypes.HOME);
	$scope.currentProductGroup = {};
	$scope.currentProductGroup.Title = 'Shop that video';
	
	$scope.initStartView = function(){
		$timeout(function() {
			var startPage = $('#main_start').gridView({ template: 'grid_start', itemWidth: 60 });
			startPage.gridView('update', true);
			$('#main_start').find('.head_dsc').jScroll({ autoresize: true });
		}, 10);
	};

	$scope.startVideo = function(item, index){
		if(item) {
			$rootScope.$broadcast('play', { item: item, index: index });
		} else {
			$rootScope.$broadcast('play');
		}
	};

	$rootScope.$on('adDataLoaded', function(adData) {
		$scope.initStartView();	
	});
	
	var currentAd = adService.getCurrentAd();
	if(currentAd) {
		$scope.initStartView();
	}
	
});