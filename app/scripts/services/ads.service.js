'use strict';

angular.module('shopthatvid')
.factory('adService', function (GLOBALS, $http) {
	return {
		getAds: function () {
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				return res.data;
			});
		},
		getAd:function(id){
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				var data =  _.find(res.data,{ID:parseInt(id)});
				return data;
			});
		},
		getProductGroup:function(){
			return $http({
				method: 'GET', url: GLOBALS.projectGroupUrl 
			})
			.then(function (res) {
				return res.data;
			});
		},
		search: function () {
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