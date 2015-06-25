'use strict';

angular.module('shopthatvid')

.controller('ViewProductGroupCtrl', function ($scope, $rootScope, $stateParams, productGroup, PageTypes, adService) {
	// update the navigation
	$rootScope.changeNavbar(PageTypes.PRODUCT_GROUP);
	
	$scope.page = 'video';
	$scope.currentProductGroupData = productGroup;

	$scope.currentProductGroupIndex = 0;
	if(angular.isNumber(parseInt($stateParams.id))) {
		$scope.currentProductGroupIndex = parseInt($stateParams.id);
	}
	console.log('$scope.currentProductGroupIndex: ', $stateParams.id);
	$scope.currentProductGroup = $rootScope.productGroups.ProductGroupTimeLine[$stateParams.id];

	$scope.error = false;
	$scope.time = 0;
	$scope.status = null;
	$scope.segmentsFilter = [];
	$scope.$watch('status', function(newValue){
		if(newValue === 'paused'){
			$scope.segmentsFilter = [];
			for(var i=0; i < $scope.currentProductGroupData.segments.length; i++){
				if($scope.time >= $scope.currentProductGroupData.segments[i].interval){
					$scope.segmentsFilter.push($scope.currentProductGroupData.segments[i]);
				}
			}
		}
	});

	$scope.showPrevious = function() {
		if($scope.currentProductGroupIndex-1 >=0) {
			$scope.currentProductGroupIndex--;
			$scope.currentProductGroup = $rootScope.productGroups.ProductGroupTimeLine[$scope.currentProductGroupIndex];	
		}
	};

	$scope.showNext = function() {
		if($rootScope.productGroups.ProductGroupTimeLine && $scope.currentProductGroupIndex+1 < $rootScope.productGroups.ProductGroupTimeLine.length) {
			$scope.currentProductGroupIndex++;
			$scope.currentProductGroup = $rootScope.productGroups.ProductGroupTimeLine[$scope.currentProductGroupIndex];
		}
	};

	$scope.searchPanel = false;
	
	$scope.toggleSearchPanel = function(){
		$scope.searchPanel = !$scope.searchPanel;
		// if($scope.searchPanel) {
		// 	$('.search_main').animate({
		// 		right: '0px'
		// 	}, 200, function() {
		// 		// Animation complete.
		// 	});
		// } else {
		// 	$('.search_main').animate({
		// 		right: '-500px'
		// 	}, 400, function() {
		// 		// Animation complete.
		// 	});
		// }
	};

	$scope.search = function () {
		adService.search().then(function (ads) {
			if (ads.length) {
				$scope.searchData = ads;
			}
		});
	};

	$scope.playControlInit = function() {
		// console.log('el init: ');
		$('#play_video').on('click', function(event){
			$rootScope.$broadcast('playVideo');
		});
	};

	//      $scope.group=_.first(productGroup.ProductGroupTimeLine);
	//      $scope.product=_.first($scope.group.Products);
	//      $scope.showReviews = false;
});