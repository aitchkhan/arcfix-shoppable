'use strict';

angular.module('shopthatvid')

.factory('safeApply', function ($rootScope) {
	return function (fn) {
		var phase = $rootScope.$$phase;
		if (phase === '$apply' || phase === '$digest') {
			if (fn && (typeof (fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};

});