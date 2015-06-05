angular.module('shopthatvid')
  .directive('svGridView', function ($rootScope, $interval) {
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
                    var grid = angular.element(elem).gridView({ template: 'grid_start', itemWidth: 60 });
                    console.log(grid);
                    grid.gridView('update', true);
                } else {
                  itemLength = angular.copy(item.length);
                }
          },200)
        }, true)
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
                  itemLength = angular.copy(item.length);
                }
          },200)
        },true);
      }
    };
  });