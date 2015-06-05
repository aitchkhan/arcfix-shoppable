angular.module('shopthatvid')
  .controller('HomeCtrl',
    function ($scope, adService) {
      adService.getAds().then(function (ads) {
        if (ads.length) {
          $scope.currentAd = _.first(ads);
          $scope.ads = _.drop(ads);
        }
      }, function () {
        $scope.error = 'Error: Unable to retrieve data. If you are using any ad blocking software/plugins, please disable them and try again.';
      });
      $scope.searchPanel = false;
      $scope.showSearchPanel = function(){
        $scope.searchPanel = !$scope.searchPanel;
      }
      $scope.search = function () {
        adService.search().then(function (ads) {
          if (ads.length) {
            $scope.searchData = ads;
          }
        });
      };
    })
  .controller('DemoCtrl', function ($scope) {
    
  });