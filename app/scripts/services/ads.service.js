'use strict';

angular.module('shopthatvid')
.factory('adService', function ($http, $rootScope, GLOBALS) {
	return {
		getAds: function () {
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				return res.data;
			});
		},
		getAd:function(videoId){
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				var data =  _.find(res.data,{ ID : videoId });
				$rootScope.productGroups = data;
				return data;
			});
		},
		getProductGroup:function(id){
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				var data =  _.find(res.data,{ID : parseInt(1)});
				$rootScope.productGroups = data;
				return data;
			});
		},
		getSearchData: function () {
			return $http({
				method: 'GET', url: GLOBALS.searchUrl
			})
			.then(function (res) {
				return res.data;
			});
		}
	};
})
;