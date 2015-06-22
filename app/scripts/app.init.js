'use strict';

angular.module('shopthatvid')

.run(function($rootScope, NavbarConfig, PageTypes){
	$rootScope.navbar = NavbarConfig;

	$rootScope.changeNavbar = function(currentPage) {

		if(currentPage === PageTypes.PRODUCT_GROUP) {
			$rootScope.navbar.showProjectGroup 		= true;
			$rootScope.navbar.showItem 				= false;
			$rootScope.navbar.showVideoResumeButton	= true;
		} else if(currentPage === PageTypes.ITEM) {
			$rootScope.navbar.showProjectGroup 		= false;
			$rootScope.navbar.showItem 				= true;
			$rootScope.navbar.showVideoResumeButton	= true;
		} else {
			$rootScope.navbar.showProjectGroup 		= false;
			$rootScope.navbar.showItem 				= false;
			$rootScope.navbar.showVideoResumeButton	= false;
		}
	};
});