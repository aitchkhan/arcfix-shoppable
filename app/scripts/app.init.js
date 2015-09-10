'use strict';

angular.module('shopthatvid')

.run(function($rootScope, $http, NavbarConfig, ViewTypes, adService){

	// if(!window.console || !window.console.log) {
	// 	window.console = {};
	// 	window.console.log = function() {};
	// }

	var convertPropertyName = function(obj){
		if(obj && obj.length === undefined) {
			_.each(obj, function(value, key){
				var oldKey = key;
				if(key === 'ID') {
					key = 'id';
				} else {
					key = key.charAt(0).toLowerCase() + key.slice(1);
				}
				obj[key] = value;
				delete obj[oldKey];
				if(obj[key] && typeof obj[key] === 'object') {
					convertPropertyName(obj[key]);
				}
			});
		} else if(obj && obj.length > 0){
			_.each(obj, function(item){
				if(typeof item === 'object') {
					convertPropertyName(item);
				}
			});
		}
	};

	adService.getAds()
	.success(function(data, status, headers){
		console.log( data);
		convertPropertyName(data);
		var videoData = data[0];

		if(!videoData) {
			console.log('Ads not found...');
		} else {
			$rootScope.shoppableVideoSAS = videoData.shoppableVideoSAS;
			var adDetailUrl = videoData.shoppableVideoBlobURL + videoData.shoppableVideoSAS;
			adService.getAd(adDetailUrl)
			.success(function(adDetail, status, headers) {
				// console.log('adDetail: ', adDetail);
				convertPropertyName(adDetail);
				if(!adDetail) {
					$rootScope.displayError('Error Occurred while fetchig the video ad content.');
				} else {
					
					adService.getVideoUrl(adDetail.videoId)
					.success(function(videoDetail, status) {
						convertPropertyName(videoDetail);
						// console.log('videoDetail', videoDetail);
						adDetail.videoDetail = videoDetail.videoDetail;
						adDetail.videoThumbnail = videoData.imageBlobURL + videoData.imageSAS;
						$rootScope.currentAd = adDetail;
						$rootScope.$broadcast('adDataLoaded', adDetail);
						console.log('currentAd: ', adDetail);
					})
					.error(function(error) {
						console.log('error in getting VideoUrl: ', error);
						$rootScope.displayError('Error Occurred while fetchig the video ad content.');
					});
				}
			})
			.error(function(err, status, headers) {
				console.log('Error fetching Ad details: ', err, status, headers);
			});
		}
	})
	.error(function(err, status, headers) {
		console.log('Error fetching Ad list: ', err, status, headers);
	});


	// adService.getAds()
	// .success(function(data, status, headers){
	// 	console.log(data);
	// 	var videoData = data[0];
	// 	if(!videoData) {
	// 		console.log('Ads not found...');
	// 	} else {
	// 		var adDetailUrl = videoData.ShoppableVideoBlobURL + videoData.ShoppableVideoSAS;
	// 		adService.getAd(adDetailUrl)
	// 		.success(function(data, status, headers) {
				
	// 		})
	// 		.error(function(err, status, headers) {
	// 			console.log('Error fetching Ad details: ', err, status, headers);
	// 		});
	// 	}
	// })
	// .error(function(err, status, headers) {
	// 	console.log('Error fetching Ad list: ', err, status, headers);
	// });

	$rootScope.navbar = NavbarConfig;

	$rootScope.uiConfig = {
		showMainContent : true,
		showVideo: false,
		currentPage: ViewTypes.HOME
	};

	$rootScope.changeNavbar = function(currentPage) {
		$rootScope.uiConfig.currentPage = currentPage;

		if(currentPage === ViewTypes.PRODUCT_GROUP) {
			$rootScope.navbar.showProjectGroup 		= true;
			$rootScope.navbar.showProjectGroups		= false;
			$rootScope.navbar.showItem 				= false;
			$rootScope.navbar.showVideoResumeButton	= true;
		} else if(currentPage === ViewTypes.PRODUCT_GROUPS) {
			$rootScope.navbar.showProjectGroup 		= false;
			$rootScope.navbar.showProjectGroups		= true;
			$rootScope.navbar.showItem 				= false;
			$rootScope.navbar.showVideoResumeButton	= true;
		} else if(currentPage === ViewTypes.PRODUCT_ITEM) {
			$rootScope.navbar.showProjectGroup 		= false;
			$rootScope.navbar.showProjectGroups		= false;
			$rootScope.navbar.showItem 				= true;
			$rootScope.navbar.showVideoResumeButton	= true;
		} else {
			$rootScope.navbar.showProjectGroup 		= false;
			$rootScope.navbar.showProjectGroups		= false;
			$rootScope.navbar.showItem 				= false;
			$rootScope.navbar.showVideoResumeButton	= false;
		}
	};

	$rootScope.displayError = function(errorMessage){
		$rootScope.uiConfig.showVideo = false;
		$rootScope.uiConfig.showMainContent = false;
		if(errorMessage) {
			$rootScope.error = errorMessage;
		} else {
			$rootScope.error = 'Something went wrong, Please try again later OR contact Administrator.';
		}
	};

});