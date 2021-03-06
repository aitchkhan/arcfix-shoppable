'use strict';

angular.module('shopthatvid')
.service('adService', function ($http, $rootScope, GLOBALS) {
	this.currentAd = undefined;
	this.currentProductGroup = undefined;
	this.currentProduct = undefined;

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

	var mockAdResponse = function(data, videoId){
		var adData = _.find(data, function(ad){
			return ad.ID === parseInt(videoId);
		});
		if(!adData) {
			return undefined;
		}

		convertPropertyName(adData);
		// _.each(adData, function(value, key){
		// 	var oldKey = key;
		// 	if(key === 'ID') {
		// 		key = 'id';
		// 	} else {
		// 		key = key.charAt(0).toLowerCase() + key.slice(1);
		// 	}
		// 	adData[key] = value;
		// 	delete adData[oldKey];
		// });
		
		// _.each(adData.productGroupTimeLine, function(pg, index) {
		// 	_.each(pg, function(value, key){ 
		// 		// console.log('value:', key);
		// 		var oldKey = key;
		// 		if(key === 'ID') {
		// 			pg.id = pg.ID;
		// 		} else if(key === 'Time' || key === 'Title' || key === 'Subtitle' || key === 'Thumbnail') {
		// 			key = key.charAt(0).toLowerCase() + key.slice(1);
		// 			pg[key] = value;
		// 		} 
		// 		delete pg[oldKey];
		// 	});
		// });
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

		convertPropertyName(adData);
		// var productGroupData = _.find(adData.ProductGroupTimeLine, function(productGroup){
		// 	return productGroup.ID === parseInt(productGroupId);
		// });

		var productGroupData = adData.productGroupTimeLine[parseInt(productGroupId)];

		// _.each(productGroupData, function(value, key){
		// 	var oldKey = key;
		// 	if(key === 'ID') {
		// 		key = 'id';
		// 	} else {
		// 		key = key.charAt(0).toLowerCase() + key.slice(1);
		// 	}
		// 	productGroupData[key] = value;
		// 	delete productGroupData[oldKey];
		// });

		// _.each(productGroupData.products, function(product, index) {
		// 	_.each(product, function(value, key){ 
		// 		// console.log('value:', key);
		// 		var oldKey = key;
		// 		if(key === 'ID') {
		// 			product.id = product.ID;
		// 		} else if(key === 'Name' || key === 'Description' || key === 'ProductImages') {
		// 			key = key.charAt(0).toLowerCase() + key.slice(1);
		// 			product[key] = value;
		// 		} 
		// 		delete product[oldKey];
		// 		if(typeof product[key] == 'object') {
		// 			convertPropertyName(product[key]);
		// 		}
		// 	});
		// });
			
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

		convertPropertyName(adData);

		var productGroupData = adData.productGroupTimeLine[productGroupId];

		var productData = productGroupData.products[productId];
		// var productData = _.find(productGroupData.Products, function(product){
		// 	return product.ID === parseInt(productId);
		// });

		// _.each(productData, function(value, key){
		// 	var oldKey = key;
		// 	if(key === 'ID') {
		// 		key = 'id';
		// 	} else {
		// 		key = key.charAt(0).toLowerCase() + key.slice(1);
		// 	}
		// 	productData[key] = value;
		// 	delete productData[oldKey];
		// 	if(typeof productData[key] == 'object') {
		// 		convertPropertyName(productData[key]);
		// 	}
		// });

		console.log('Mocked productData: ', productData);
		return productData;
	};

	var mockProductGroupsResponse = function(data, videoId) {
		var adData = _.find(data, function(ad){
			return ad.ID === parseInt(videoId);
		});
		if(!adData) {
			return undefined;
		}
		convertPropertyName(adData);

		// _.each(adData, function(value, key){
		// 	var oldKey = key;
		// 	if(key === 'ID') {
		// 		key = 'id';
		// 	} else {
		// 		key = key.charAt(0).toLowerCase() + key.slice(1);
		// 	}
		// 	adData[key] = value;
		// 	delete adData[oldKey];
		// });
		
		// _.each(adData.productGroupTimeLine, function(pg, index) {
		// 	_.each(pg, function(value, key){ 
		// 		// console.log('value:', key);
		// 		var oldKey = key;
		// 		if(key === 'ID') {
		// 			pg.id = pg.ID;
		// 		} else if(key === 'Time' || key === 'Title' || key === 'Subtitle' || key === 'Thumbnail') {
		// 			key = key.charAt(0).toLowerCase() + key.slice(1);
		// 			pg[key] = value;
		// 		} 
		// 		delete pg[oldKey];
		// 	});
		// });

		console.log('Mocked productData: ', adData.productGroupTimeLine);
		return adData.productGroupTimeLine;
	};

	return {
		convertPropertyName: convertPropertyName,
		getAds: function () {
			return $http.get(GLOBALS.adUrl + '/projects');
		},
		getAd: function(postData){

			var self = this;

			$rootScope.currentVideoPostData = postData;
			return $http({
				method: 'POST', 
				cache: true,
				url: GLOBALS.adUrl + '/projects/'+ videoId +'/true',
				// transformResponse: function(data, headers){
				// 	self.currentAd = mockAdResponse(JSON.parse(data), videoId);
				// 	return self.currentAd;
				// }
			});
		},
		getCurrentAd: function() {
			if($rootScope.currentAd) {
				return $rootScope.currentAd;
			} else {
				return null;
			}
		},
		getVideoUrl: function(videoId) {
			return $http.post(GLOBALS.apiUrl + 'getvideoinfo', { VideoId: videoId });
		},
		getProductGroup: function(videoId, productGroupId){
			var self = this	;
			$rootScope.currentVideoId = videoId;
			$rootScope.currentProductGroupId = productGroupId;
			if($rootScope.currentAd) {
				$rootScope.currentProductGroup = $rootScope.currentAd.productGroupTimeLine[productGroupId];
				return $rootScope.currentProductGroup;
			} else {
				return null;
			}
			// return $http({
			// 	method: 'GET', 
			// 	cache: true,
			// 	url: GLOBALS.adUrl,
			// 	// transformResponse: function(data, headers){
			// 	// 	self.currentProductGroup = mockProductGroupResponse(JSON.parse(data), videoId, productGroupId);
			// 	// 	return self.currentProductGroup;
			// 	// }
			// });
		},
		getCurrentProductGroup: function() {
			if($rootScope.currentProductGroup) {
				return $rootScope.currentProductGroup; 
			} else {
				return null;
			}
		},
		getProductGroups: function(videoId){
			var self = this;
			$rootScope.currentVideoId = videoId;
			if($rootScope.currentAd) {
				return $rootScope.currentAd.productGroupTimeLine;	
			} else {
				return null;
			}
			
			// return $http({
			// 	method: 'GET', 
			// 	cache: true,
			// 	url: GLOBALS.adUrl,
			// 	// transformResponse: function(data, headers){
			// 	// 	self.currentProductGroups = mockProductGroupsResponse(JSON.parse(data), videoId);
			// 	// 	return self.currentProductGroups;		
			// 	// }
			// });
		},
		getCurrentProductGroups: function(){
			if(this.currentProductGroups) {
				return this.currentProductGroups;
			} else {
				return null;
			}
		},
		getProduct: function(videoId, productGroupId, productId){
			var self = this;
			$rootScope.currentVideoId = videoId;
			$rootScope.currentProductGroupId = productGroupId;
			$rootScope.currentProductId = productId;
			if($rootScope.currentAd) {
				$rootScope.currentProduct = $rootScope.currentAd.productGroupTimeLine[productGroupId]?$rootScope.currentAd.productGroupTimeLine[productGroupId].products[productId]:null;
				return $rootScope.currentProduct;
			} else {
				return null;
			}
			// return $http({
			// 	method: 'GET', 
			// 	cache: true,
			// 	url: GLOBALS.adUrl,
			// 	transformResponse: function(data, headers){
			// 		self.currentProduct = mockProductResponse(JSON.parse(data), videoId, productGroupId, productId);
			// 		return self.currentProduct;
			// 	}
			// });
		},
		getCurrentProduct: function() {
			if(this.currentProduct) {
				return this.currentProduct;
			} else {
				return null;
			}
		},
		getSearchData: function (keyword) {
			var self = this;
			return $http({
				method: 'GET', 
				url: GLOBALS.searchUrl,
				transformResponse: function(data, headers){
					var currentAd = self.getCurrentAd();
					if(currentAd && keyword.length>0) {
						var searchData = _.filter(currentAd.productGroupTimeLine, function(productGroup, index){
							productGroup.index = index;
							return productGroup.title.search(new RegExp(keyword, 'i')) === 0 || productGroup.subtitle.search(new RegExp(keyword, 'i')) === 0;
						});
						return searchData;
					// } else if(keyword.length>0){
					// 	return data;
					} else {
						return [];
					}
				}
			});
		}
	};
})
;