'use strict';

angular.module('shopthatvid')

.controller('ProductGroupCtrl', function ($scope, $rootScope, $stateParams, productGroup, ViewTypes, adService) {
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
		})

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

	// $scope.currentProductGroupIndex = 0;
	// if(angular.isNumber(parseInt($stateParams.id))) {
	// 	$scope.currentProductGroupIndex = parseInt($stateParams.id);
	// }
	// console.log('$scope.currentProductGroupIndex: ', $stateParams.id);
	// $scope.currentProductGroup = $rootScope.productGroups.ProductGroupTimeLine[$stateParams.id];

	// $scope.error = false;
	// $scope.time = 0;
	// $scope.status = null;
	// $scope.segmentsFilter = [];
	// $scope.$watch('status', function(newValue){
	// 	if(newValue === 'paused'){
	// 		$scope.segmentsFilter = [];
	// 		for(var i=0; i < $scope.currentProductGroupData.segments.length; i++){
	// 			if($scope.time >= $scope.currentProductGroupData.segments[i].interval){
	// 				$scope.segmentsFilter.push($scope.currentProductGroupData.segments[i]);
	// 			}
	// 		}
	// 	}
	// });

	// $scope.showPrevious = function() {
	// 	if($scope.currentProductGroupIndex-1 >=0) {
	// 		$scope.currentProductGroupIndex--;
	// 		$scope.currentProductGroup = $rootScope.productGroups.ProductGroupTimeLine[$scope.currentProductGroupIndex];	
	// 	}
	// };

	// $scope.showNext = function() {
	// 	if($rootScope.productGroups.ProductGroupTimeLine && $scope.currentProductGroupIndex+1 < $rootScope.productGroups.ProductGroupTimeLine.length) {
	// 		$scope.currentProductGroupIndex++;
	// 		$scope.currentProductGroup = $rootScope.productGroups.ProductGroupTimeLine[$scope.currentProductGroupIndex];
	// 	}
	// };

	// $scope.searchPanel = false;
	
	// $scope.toggleSearchPanel = function(){
	// 	$scope.searchPanel = !$scope.searchPanel;
	// 	// if($scope.searchPanel) {
	// 	// 	$('.search_main').animate({
	// 	// 		right: '0px'
	// 	// 	}, 200, function() {
	// 	// 		// Animation complete.
	// 	// 	});
	// 	// } else {
	// 	// 	$('.search_main').animate({
	// 	// 		right: '-500px'
	// 	// 	}, 400, function() {
	// 	// 		// Animation complete.
	// 	// 	});
	// 	// }
	// };

	// $scope.search = function () {
	// 	adService.search().then(function (ads) {
	// 		if (ads.length) {
	// 			$scope.searchData = ads;
	// 		}
	// 	});
	// };

	// $scope.playControlInit = function() {
	// 	// console.log('el init: ');
	// 	$('#play_video').on('click', function(event){
	// 		$rootScope.$broadcast('playVideo');
	// 	});
	// };

	//      $scope.group=_.first(productGroup.ProductGroupTimeLine);
	//      $scope.product=_.first($scope.group.Products);
	//      $scope.showReviews = false;
});