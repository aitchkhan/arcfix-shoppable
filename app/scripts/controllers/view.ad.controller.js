'use strict';

angular.module('shopthatvid')
.controller('ViewAdCtrl',
	function ($scope, ad) {
		$scope.page='video';
		$scope.ad=ad;
		$scope.error = false;
		$scope.time = 0;
		$scope.status = null;
		$scope.segmentsFilter = [];
		$scope.$watch('status', function(newValue){
			if(newValue === 'paused'){
				$scope.segmentsFilter = [];
				for(var i=0; i < $scope.ad.segments.length; i++){
					if($scope.time >= $scope.ad.segments[i].interval){
						$scope.segmentsFilter.push($scope.ad.segments[i]);
					}
				}
			}
		});
		//      $scope.group=_.first(ad.ProductGroupTimeLine);
		//      $scope.product=_.first($scope.group.Products);
		//      $scope.showReviews = false;
});