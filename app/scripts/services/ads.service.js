'use strict';

angular.module('shopthatvid')
.service('adService', function ($http, $rootScope, GLOBALS) {
	var currentAd, currentProductGroup, currentProduct;

	var mockAdResponse = function(data, videoId){
		var adData = _.find(data, function(ad){
			return ad.ID === parseInt(videoId);
		});
		if(!adData) {
			return undefined;
		}

		_.each(adData, function(value, key){
			var oldKey = key;
			if(key === 'ID') {
				key = 'id';
			} else {
				key = key.charAt(0).toLowerCase() + key.slice(1);
			}
			adData[key] = value;
			delete adData[oldKey];
		});
		
		_.each(adData.productGroupTimeLine, function(pg, index) {
			_.each(pg, function(value, key){ 
				// console.log('value:', key);
				var oldKey = key;
				if(key === 'ID') {
					pg.id = pg.ID;
				} else if(key === 'Time' || key === 'Title' || key === 'Subtitle' || key === 'Thumbnail') {
					key = key.charAt(0).toLowerCase() + key.slice(1);
					pg[key] = value;
				} 
				delete pg[oldKey];
			});
		});
		console.log('Mocked adData: ', adData);
		return adData;
	};

	var mockProductGroupResponse = function(data, videoId, productGroupId) {
		var adData = _.find(data, function(ad){
			return ad.ID === parseInt(videoId);
		});
		if(!adData) {
			return undefined;
		}

		var productGroupData = _.find(adData.ProductGroupTimeLine, function(productGroup){
			return productGroup.ID === parseInt(productGroupId);
		});

		_.each(productGroupData, function(value, key){
			var oldKey = key;
			if(key === 'ID') {
				key = 'id';
			} else {
				key = key.charAt(0).toLowerCase() + key.slice(1);
			}
			productGroupData[key] = value;
			delete productGroupData[oldKey];
		});

		_.each(productGroupData.products, function(product, index) {
			_.each(product, function(value, key){ 
				// console.log('value:', key);
				var oldKey = key;
				if(key === 'ID') {
					product.id = product.ID;
				} else if(key === 'Name' || key === 'Description' || key === 'ProductImages') {
					key = key.charAt(0).toLowerCase() + key.slice(1);
					product[key] = value;
				} 
				delete product[oldKey];
			});
		});
			
		console.log('Mocked productGroupData: ', productGroupData);
		return productGroupData;
	};

	var mockProductResponse = function(data, videoId, productGroupId, productId) {
		var adData = _.find(data, function(ad){
			return ad.ID === parseInt(videoId);
		});
		if(!adData) {
			return undefined;
		}

		var productGroupData = _.find(adData.ProductGroupTimeLine, function(productGroup){
			return productGroup.ID === parseInt(productGroupId);
		});

		var productData = _.find(productGroupData.Products, function(product){
			return product.ID === parseInt(productId);
		});

		_.each(productData, function(value, key){
			var oldKey = key;
			if(key === 'ID') {
				key = 'id';
			} else {
				key = key.charAt(0).toLowerCase() + key.slice(1);
			}
			productData[key] = value;
			delete productData[oldKey];
		});

		console.log('Mocked productData: ', productData);
		return productGroupData;
	};

	var mockProductGroupsResponse = function(videoId) {
		
	};

	return {
		getAds: function () {
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				return res.data;
			});
		},
		getAd: function(videoId){
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				currentAd = mockAdResponse(res.data, videoId);
				currentProductGroup = undefined;
				currentProduct = undefined;
				return currentAd;
			});
		},
		getCurrentAd: function() {
			return currentAd;
		},
		getProductGroup: function(videoId, productGroupId){
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				currentProductGroup = mockProductGroupResponse(res.data, videoId, productGroupId);
				currentProduct = undefined;
				return currentProductGroup;
			});
		},
		getCurrentProductGroup: function() {
			return currentProductGroup;
		},
		getProductGroups: function(videoId){
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				currentProductGroup = mockProductGroupsResponse(res.data, videoId);
				currentProduct = undefined;
				return currentProductGroup;
			});
		},
		getProduct: function(videoId, productGroupId, productId){
			return $http({
				method: 'GET', url: GLOBALS.adUrl
			})
			.then(function (res) {
				currentProduct = mockProductResponse(res.data, videoId, productGroupId, productId);
				return currentProduct;
			});
		},
		getCurrentProduct: function() {
			return currentProduct;
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