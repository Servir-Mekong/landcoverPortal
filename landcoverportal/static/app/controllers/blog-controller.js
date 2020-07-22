(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('BlogController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService, blogService) {
      $scope.blogList = [];
      var parameters = {};
      blogService.getBlog(parameters)
      .then(function (data) {
        $scope.blogList = data;

      }, function (error) {

      });

    });

})();
