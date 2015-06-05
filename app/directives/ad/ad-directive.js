angular.module('shopthatvid')
  .directive('bAdVideo', function ($rootScope, $timeout) {
    return {
      restrict: 'A',
      templateUrl: 'app/directives/ad/ad-video.html',
      scope: {
        ad: '=',
        videoStatus: '=',
        videoTime:'=',
        videoControl : '@'
      },
      link: function (scope, elem) {
        var videoElem = document.createElement('video');
        var video=angular.element(elem).adPlayer();

        video.adPlayer('load', {
         video: scope.ad.Media,
         poster: scope.ad.Thumbnail,
         groups: _.map(scope.ad.ProductGroupTimeLine,function (e) {
           return e.Time || null;
         })
        });
        $timeout(function(){
          var videoElm = angular.element(elem).find('video');
          var control = function(){
            video.adPlayer('play', false, function(){
                if(videoElm[0].paused && !videoElm[0].end){
                  scope.videoStatus = 'paused';
                }
                if(videoElm[0].end){
                  scope.videoStatus = 'end';
                }
                if(!videoElm[0].paused && !videoElm[0].end){
                  scope.videoStatus = 'play';
                }
                scope.$$phase || scope.$apply();
            });
          }
          angular.element(elem).on('click', function(event){
              control();
          });
          console.log(scope.videoControl);
          angular.element(scope.videoControl).on('click', function(){
              control();
          })
          videoElm[0].addEventListener('timeupdate', function(){
            scope.videoTime=parseInt(videoElm[0].currentTime);
            scope.$apply();
          });
        })
      }
    };
  });