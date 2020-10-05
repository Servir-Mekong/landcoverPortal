(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('eventDetailController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService, blogService, trainingService) {
      $scope.trainingList = [];

      var parameters = {};
      console.log(localStorage['eventListCache']);
      var trainingArray = JSON.parse(localStorage['eventListCache']);
      var tid = location.search.split('eid=')[1];

      for(var i=0; i<trainingArray.length; i++ ){
        console.log(trainingArray[i]["Title"]);
        console.log(trainingArray[i]["Order"], parseInt(tid))
        if(trainingArray[i]["Order"] === parseInt(tid)){

          $scope.title = trainingArray[i]["Title"];
          $scope.date = trainingArray[i]["Date"];
          $scope.dateStart = trainingArray[i]["DateStart"];
          $scope.dateFinish = trainingArray[i]["DateFinish"];
          $scope.venue = trainingArray[i]["Venue"];
          $scope.country = trainingArray[i]["Country"];
          $scope.concept = trainingArray[i]["Concept"];
          $scope.featuredImage = trainingArray[i]["FeaturedImage"];
          $scope.agenda = trainingArray[i]["Agenda"];
          $scope.presentation = trainingArray[i]["Presentation"];
          $scope.relatedDoc = trainingArray[i]["RelatedDoc"];
          $scope.photo = trainingArray[i]["Photo"];
          $scope.hub = trainingArray[i]["Hub"];
        }
      }

    });

})();
