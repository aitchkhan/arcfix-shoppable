'use strict';

angular.module('shopthatvid')
	.directive('svGridView', function ($rootScope, $interval) {
		return {
			restrict: 'A',
			scope : {
				bodyItems : '=',
				headItem : '=',
			},
			link: function (scope, elem, attr) {
				var grid;
				console.log('scope.headItem', scope.headItem);
				console.log('scope.bodyItems', scope.bodyItems);
				grid = angular.element(elem).gridView({ template: attr.templateType, itemWidth: 60, itemHeight: 110 });
				// console.log(grid);
				// grid.gridView('update', true);
				scope.$watch('itemLength', function(){
					// var loop = $interval(function(){
						// var item = angular.element(elem).find('['+ scope.item +']');
						// if(item.length === scope.itemLength){
							// $interval.cancel(loop);
							// grid = angular.element(elem).gridView({ template: 'grid_start', itemWidth: 60 });
							// console.log(grid);
							grid.gridView('update', true);
						// }
					// },200);
				}, true);
			}
		};
	})
	 .directive('svScroll', function ($rootScope, $interval) {
		return {
			restrict: 'A',
			scope : {
				itemLength 	: '=',
				item 		: '@',
				searchScroll: '='
			},
			link: function (scope, elem) {
				scope.$watch('itemLength', function(){
					var loop = $interval(function(){
						var item = angular.element(elem).find('['+scope.item+']');
						if(item.length === scope.itemLength){
							$interval.cancel(loop);
							scope.searchScroll = angular.element(elem).jScroll({ pad: 23 });
						}
					},200);
				},true);
			}
		};
	});