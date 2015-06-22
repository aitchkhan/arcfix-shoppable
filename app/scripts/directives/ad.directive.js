'use strict';

angular.module('shopthatvid')
.directive('bAdVideo', function ($rootScope, $timeout) {
	return {
		restrict: 'A',
		// templateUrl: 'views/ad-video.html',
		scope: {
			productGroup: '=',
			videoStatus: '=',
			videoTime:'=',
			videoControl : '@'
		},
		link: function (scope, elem) {
			// var videoElem = document.createElement('video');
			var video=angular.element(elem).adPlayer();

			video.adPlayer('load', {
				video: scope.productGroup.Media,
				poster: scope.productGroup.Thumbnail,
				groups: _.map(scope.productGroup.ProductGroupTimeLine,function (e) {
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
						/* jshint ignore:start */
						scope.$$phase || scope.$apply();
						/* jshint ignore:end */
					});
				};
				angular.element(elem).on('click', function(){
					control();
				});
				console.log(scope.videoControl);
				angular.element(scope.videoControl).on('click', function(){
					control();
				});
				videoElm[0].addEventListener('timeupdate', function(){
					scope.videoTime=parseInt(videoElm[0].currentTime);
					scope.$apply();
				});
			});
		}
	};
});