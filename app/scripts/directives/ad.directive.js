'use strict';

angular.module('shopthatvid')

.directive('bVideoAd', function ($rootScope, $timeout, $state, adService) {
	return {
		restrict: 'A',
		scope: {
			player: '='
		},
		link: function (scope, elem) {
			
			scope.player =  $('#main_play').adPlayer();
			scope.player.on('adPlayerPause', function(event){
				console.log('Ad player paused...', event);
				var productGroupId = $(event.currentTarget).data('id');
				var currentAd = adService.getCurrentAd();
				$state.go('productGroup', {videoId: currentAd.id, productGroupId: productGroupId})
				.then(function(){
					$rootScope.uiConfig.showMainContent = true;
				});
			});
			scope.player.on('adPlayerEnd', function(event, obj){
				console.log('Ad player ended...', event, obj);
				$state.go('productGroups', { videoId: $rootScope.currentVideoId })
				.then(function(){
					$rootScope.uiConfig.showMainContent = true;
					$rootScope.uiConfig.showVideo = true;
				});
			});

			$rootScope.$on('adDataLoaded', function(event, productGroup){
				var currentAd = adService.getCurrentAd();
				scope.player.adPlayer('load', {
					video: currentAd.media,
					poster: productGroup?productGroup.thumbnail:currentAd.thumbnail,
					groups: currentAd.productGroupTimeLine.map(function(elem){ return elem.time || null; })
				});
			});

			$rootScope.$on('play', function(event, item){
				if(item) {
					var currentAd = adService.getCurrentAd();
					scope.player.adPlayer('load', {
						video: currentAd.media,
						poster: item.thumbnail,
						seekTime: item.time,
						groups: currentAd.productGroupTimeLine.map(function(elem){ return elem.time || null; })
					});
				} 
				$rootScope.uiConfig.showMainContent = false;
				$rootScope.uiConfig.showVideo = true;
				
			});

			$rootScope.$on('resume', function(){
				$rootScope.uiConfig.showMainContent = false;
				$rootScope.uiConfig.showVideo = true;
				scope.player.adPlayer('play', false, function(status){
					if(!status) {
						var currentAd = adService.getCurrentAd();
						if(!currentAd) {
							adService.getAd($rootScope.currentVideoId)
							.success(function(data, headers){
								currentAd = data;
								scope.player.adPlayer('load', {
									video: currentAd.media,
									poster: currentAd.thumbnail,
									groups: currentAd.productGroupTimeLine.map(function(elem){ return elem.time || null; })
								});
								scope.player.adPlayer('play');
							})
							.error(function(err, headers){
								$rootScope.displayError(err.message);
							});
						} else {
							scope.player.adPlayer('load', {
								video: currentAd.media,
								poster: currentAd.thumbnail,
								groups: currentAd.productGroupTimeLine.map(function(elem){ return elem.time || null; })
							});
							scope.player.adPlayer('play');
						}
					}
				});
			});

			$rootScope.$on('seekAndPlay', function(event, productGroup){
				$rootScope.uiConfig.showMainContent = false;
				scope.player.adPlayer('seek', productGroup.time,function(){
					console.log('seek done...');
					scope.showVideo = true;
					$rootScope.uiConfig.showVideo = true;
					$rootScope.$apply();
					scope.player.adPlayer('play');
				});
			});

		}
	};
});

// .directive('bAdVideo', function ($rootScope, $timeout) {
// 	return {
// 		restrict: 'A',
// 		// templateUrl: 'views/ad-video.html',
// 		scope: {
// 			productGroup: '=',
// 			videoStatus: '=',
// 			videoTime:'=',
// 			currentProductGroupIndex:'=',
// 			videoControl : '@'
// 		},
// 		link: function (scope, elem) {
// 			// var videoElem = document.createElement('video');
// 			var video=angular.element(elem).adPlayer();

// 			video.adPlayer('load', {
// 				video: scope.productGroup.Media,
// 				poster: scope.productGroup.ProductGroupTimeLine[scope.currentProductGroupIndex-1].Thumbnail,
// 				groups: _.map(scope.productGroup.ProductGroupTimeLine,function (e) {
// 					return e.Time || null;
// 				})
// 			});
// 			$timeout(function(){
// 				var videoElm = angular.element(elem).find('video');
// 				var control = function(){
// 					video.adPlayer('play', false, function(){
// 						if(videoElm[0].paused && !videoElm[0].end){
// 							scope.videoStatus = 'paused';
// 						}
// 						if(videoElm[0].end){
// 							scope.videoStatus = 'end';
// 						}
// 						if(!videoElm[0].paused && !videoElm[0].end){
// 							scope.videoStatus = 'play';
// 						}
// 						/* jshint ignore:start */
// 						scope.$$phase || scope.$apply();
// 						/* jshint ignore:end */
// 					});
// 				};
// 				angular.element(elem).on('click', function(){
// 					control();
// 				});
				
// 				// console.log(scope.videoControl);
				
// 				// angular.element(scope.videoControl).on('click', function(){
// 				// 	control();
// 				// });
// 				$rootScope.$on('playVideo', function(){
// 					// console.log('event playVideo received...');
// 					control();
// 				});
				
// 				videoElm[0].addEventListener('timeupdate', function(){
// 					scope.videoTime=parseInt(videoElm[0].currentTime);
// 					scope.$apply();
// 				});
// 			});
// 		}
// 	};
// });