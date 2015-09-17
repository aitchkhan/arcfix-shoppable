'use strict';

angular.module('shopthatvid')

.controller('ProductCtrl', function ($scope, $rootScope, $timeout, $stateParams, product, ViewTypes, adService, GLOBALS) {
	// update the navigation
	$rootScope.changeNavbar(ViewTypes.PRODUCT_ITEM);
    $rootScope.$broadcast('videIdLoaded', $stateParams);
    
	$scope.showReviews = GLOBALS.showProductReviews;
	$scope.showColors = GLOBALS.showProductColors;
	$scope.showProductSizes = GLOBALS.showProductSizes;
	

	$scope.getNumber = function(num) {
		return new Array(num);   
	};

	$scope.updateMainImage = function(image){
		$scope.currentMainImage = image;
	};

	var mainView, revLoaded, imgLoaded;
	$scope.initProductItemView = function(){
		$timeout(function(){
			mainView = $('#main_item').find('.item_main').jScroll({ mode: 'h', pad: 23, autoresize: true });
			$('#main_item').find('.item_imgs_thmb').jScroll();
			$('#main_item').find('.item_revw_rgrp').jScroll();
			mainView.jScroll('update');
		}, 100, true);
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

    var init = function(currentAd) {
        $scope.currentProduct = currentAd.productGroups[$rootScope.currentProductGroupId] &&
                         currentAd.productGroups[$rootScope.currentProductGroupId].products[$rootScope.currentProductId];
        if($scope.currentProduct) {
            $rootScope.navbar.headerTitle = $scope.currentProduct.name;
            $scope.currentMainImage = $scope.currentProduct.productImages[0];
            $scope.initProductItemView();
        } else {
            $rootScope.displayError('Selected product detail not found.');
        }
    };

    $rootScope.$on('adDataLoaded', function() {
        var currentAd = adService.getCurrentAd();
        init(currentAd);
    });

    var currentAd = adService.getCurrentAd();
    if(currentAd) {
        init(currentAd);
    }
    
});