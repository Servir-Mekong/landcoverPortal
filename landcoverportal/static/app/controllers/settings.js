(function () {

	'use strict';
	angular.module('landcoverportal')
	.controller('settingsCtrl', function ($scope, appSettings) {
	
		$scope.menus = appSettings.menus;
		$scope.applicationName = appSettings.applicationName;
		$scope.footerLinks = appSettings.footerLinks;
		$scope.partnersHeader = appSettings.partnersHeader;
		$scope.partnersFooter = appSettings.partnersFooter;

		$('#carousel').carousel({
			interval: 2000
		});    
	
	});

})();