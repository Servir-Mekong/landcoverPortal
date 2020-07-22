(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('TensorFlowController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService, blogService, tensorService) {
      $scope.TFList = [];
      var parameters = {};
      tensorService.getTFContent(parameters)
      .then(function (data) {
        $scope.TFList = data;
        $("#table-status").val("1");
        setTimeout(function(){ $("#table-status").change(); }, 3000);


      }, function (error) {

      });

    });

})();
