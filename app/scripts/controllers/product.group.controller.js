'use strict';

angular.module('shopthatvid')

.controller('ViewProductGroupCtrl', function ($scope, $rootScope, productGroup, PageTypes, adService) {
	// update the navigation
	$rootScope.changeNavbar(PageTypes.PRODUCT_GROUP);
	
	$scope.page = 'video';
	$scope.currentProductGroupData = productGroup;

	var currentProductGroupIndex = 0;
	console.log('currentProductGroupIndex: ', currentProductGroupIndex);
	$scope.currentProductGroup = $rootScope.productGroups.ProductGroupTimeLine[0];

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
		$scope.currentProductGroup = currentProductGroupIndex-1 >=0 ?$rootScope.productGroups.ProductGroupTimeLine[currentProductGroupIndex-1]:undefined;
	};

	$scope.showNext = function() {
		$scope.currentProductGroup = currentProductGroupIndex+1 < $rootScope.productGroups.ProductGroupTimeLine.length?$rootScope.productGroups.ProductGroupTimeLine[currentProductGroupIndex+1]:undefined;
	};

	$scope.searchPanel = false;
	
	$scope.toggleSearchPanel = function(){
		$scope.searchPanel = !$scope.searchPanel;
	};

	$scope.search = function () {
		adService.search().then(function (ads) {
			if (ads.length) {
				$scope.searchData = ads;
			}
		});
	};
	//      $scope.group=_.first(productGroup.ProductGroupTimeLine);
	//      $scope.product=_.first($scope.group.Products);
	//      $scope.showReviews = false;
});