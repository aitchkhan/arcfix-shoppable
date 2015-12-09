'use strict';

angular.module('shopthatvid')

.controller('HomeCtrl', function ($scope, $rootScope, $timeout, $stateParams, adService, projects, ViewTypes) {

	$rootScope.uiConfig.showVideo = false;
	// console.log('$stateParams.videoId: ', $stateParams.videoId);
	// if(!$stateParams.videoId) {
	// 	$stateParams.videoId = '5652e5bd88c3600300f997b0';
	// 	// $scope.error = 'Error: Unable to retrieve get videoId. Please check your url to have valid videoId';
	// 	// $rootScope.changeNavbar(ViewTypes.ERROR);
	// }

	// $scope.videoId = $stateParams.videoId;
	$rootScope.navbar.headerTitle = 'Shop that video';
	$rootScope.changeNavbar(ViewTypes.HOME);
	// $scope.currentProductGroup = {};
	// $scope.currentProductGroup.title = 'Shop that video';
	
	// $scope.currentAd = currentAdResponse.data;
	// console.log('$scope.currentAd', $scope.currentAd);
	// $rootScope.$broadcast('adDataLoaded');
	console.log('projects', projects.data);
	$scope.projects = projects.data;
	$scope.mainProject = $scope.projects[0];
	
	$scope.initStartView = function(){
		$timeout(function() {
			var startPage = $('#main_start').gridView({ template: 'grid_start', itemWidth: 60 });
			startPage.gridView('update', true);
			$('#main_start').find('.head_dsc').jScroll({ autoresize: true });
		}, 10);
	};

	$scope.startVideo = function(project){
		if(project) {
			adService.getAd(project._id)
			.success(function(ad, headers) {
				console.log('currentAd', ad);
				$rootScope.currentAd = ad;
				$scope.currentAd = ad;
				$rootScope.$broadcast('adDataLoaded');
				$rootScope.$broadcast('play');
			})
			.error(function(err) {
				$rootScope.displayError();
			});
		} else {
			$rootScope.$broadcast('play');
		}
	};
	
});