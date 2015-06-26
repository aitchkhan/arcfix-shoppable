'use strict';

angular.module('shopthatvid')
	.directive('svGridView', function ($rootScope, $interval) {
		return {
			restrict: 'A',
			scope : {
				itemLength : '=',
				item : '@',
				isGroup:'='
			},
			link: function (scope, elem) {
				var grid;

				if(scope.isGroup) {
					grid = angular.element(elem).gridView({ template: 'grid_group', itemWidth: 60, itemHeight: 110 });
					// console.log(grid);
					grid.gridView('update', true);
				} else {
					scope.$watch('itemLength', function(){
						var loop = $interval(function(){
							var item = angular.element(elem).find('['+scope.item+']');
							if(item.length === scope.itemLength){
								$interval.cancel(loop);
								grid = angular.element(elem).gridView({ template: 'grid_start', itemWidth: 60 });
								// console.log(grid);
								grid.gridView('update', true);
							}
						},200);
					}, true);
				}
			}
		};
	})
	 .directive('svScroll', function ($rootScope, $interval) {
		return {
			restrict: 'A',
			scope : {
				itemLength : '=',
				item : '@'
			},
			link: function (scope, elem) {
				scope.$watch('itemLength', function(){
					var loop = $interval(function(){
						var item = angular.element(elem).find('['+scope.item+']');
						if(item.length === scope.itemLength){
								$interval.cancel(loop);
								angular.element(elem).jScroll({ pad: 23 });
						} else {
							// ### changed by Vinesh
							scope.itemLength = angular.copy(item.length);
						}
					},200);
				},true);
			}
		};
	});