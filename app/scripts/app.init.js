'use strict';

angular.module('shopthatvid')

.run(function($rootScope, NavbarConfig, ViewTypes){
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