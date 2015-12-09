'use strict';

angular.module('shopthatvid')

.controller('ProductCtrl', function ($scope, $rootScope, $timeout, $stateParams, product, ViewTypes, adService, GLOBALS) {
	// update the navigation
	// $rootScope.changeNavbar(ViewTypes.PRODUCT_ITEM);

	// $scope.showReviews = GLOBALS.showProductReviews;
	// $scope.showColors = GLOBALS.showProductColors;
	// $scope.showProductSizes = GLOBALS.showProductSizes;
	// $scope.currentProduct = product;
	// $rootScope.navbar.headerTitle = $scope.currentProduct.name;

	// $scope.currentMainImage = $scope.currentProduct.images[0];

    var mainView, revLoaded, imgLoaded;
    $scope.initProductItemView = function(){
        if($scope.currentProduct) {
            $timeout(function(){
                mainView = $('#main_item').find('.item_main').jScroll({ mode: 'h', pad: 23, autoresize: true });
                $('#main_item').find('.item_imgs_thmb').jScroll();
                $('#main_item').find('.item_revw_rgrp').jScroll();
                mainView.jScroll('update');
            }, 100, true);
        }
    };

    var currentAd = adService.getCurrentAd();
    if(!currentAd) {
        adService.getAd($stateParams.videoId)
        .success(function(currentAd, headers){
            $rootScope.currentAd = currentAd;
            var productGroup = adService.getProductGroup($stateParams.videoId, $stateParams.productGroupId);
            $rootScope.changeNavbar(ViewTypes.PRODUCT_ITEM);

            $rootScope.$broadcast('adDataLoaded', productGroup);
            $scope.currentProduct = adService.getProduct($stateParams.videoId, $stateParams.productGroupId, $stateParams.productId);
            $rootScope.navbar.headerTitle = $scope.currentProduct.name;
            $scope.currentMainImage = $scope.currentProduct.images[0];
            $scope.initProductItemView();
        })
        .error(function(err, headers){
            console.log('error while fetching ad data.');
        });

    } else {
        $rootScope.changeNavbar(ViewTypes.PRODUCT_ITEM);
        $scope.currentProduct = product;
        $rootScope.navbar.headerTitle = $scope.currentProduct.name;
        $scope.currentMainImage = $scope.currentProduct.images[0];
        $scope.initProductItemView();
    }

	$scope.getNumber = function(num) {
		return new Array(num);   
	};

	$scope.updateMainImage = function(image){
		$scope.currentMainImage = image;
	};

	$scope.imagesLoaded = function(){
        imgLoaded = true;
        if(revLoaded) {
        	var contW = $('#main_item').find('.item_info').outerWidth(true);
        	contW += $('#main_item').find('.item_revw').outerWidth(true);
        	contW += $('#main_item').find('.item_imgs').outerWidth(true);
        	$('#main_item').find('.item_body').css({ width: contW + 'px' });
        	if(mainView) {
        		mainView.jScroll('update');
        	} else {
        		mainView = $('#main_item').find('.item_main').jScroll({ mode: 'h', pad: 23, autoresize: true });
        		mainView.jScroll('update');
        	}
        }
    };

    $scope.reviewsLoaded = function(){
    	var revLoaded = true;
    	if(imgLoaded) {
    		var contW = $('#main_item').find('.item_info').outerWidth(true);
    		contW += $('#main_item').find('.item_revw').outerWidth(true);
    		contW += $('#main_item').find('.item_imgs').outerWidth(true);
    		$('#main_item').find('.item_body').css({ width: contW + 'px' });
    		if(mainView) {
    			mainView.jScroll('update');
    		} else {
    			mainView = $('#main_item').find('.item_main').jScroll({ mode: 'h', pad: 23, autoresize: false });
    			mainView.jScroll('update');
    		}
    	}
    };
});