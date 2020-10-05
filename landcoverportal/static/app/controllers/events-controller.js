(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('EventsController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService, blogService, eventsService) {
      $scope.EventList = [];
      $scope.EventListHome = [];
      var parameters = {};
      eventsService.getEvents(parameters)
      .then(function (data) {
        $scope.EventList = data;
        $scope.EventList.reverse();
        $scope.EventListHome = data.filter((data,idx) => idx < 4)
        localStorage['eventListCache'] = JSON.stringify(data);

      }, function (error) {

      });

    });

})();
