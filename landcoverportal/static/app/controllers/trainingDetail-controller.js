(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('trainingDetailController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService, blogService, trainingService) {
      $scope.trainingList = [];

      var parameters = {};
      console.log(localStorage['trainingListCache']);
      var trainingArray = JSON.parse(localStorage['trainingListCache']);
      var tid = location.search.split('tid=')[1];

      for(var i=0; i<trainingArray.length; i++ ){
        console.log(trainingArray[i]["Title"]);
        console.log(trainingArray[i]["id"], parseInt(tid))
        if(trainingArray[i]["id"] === parseInt(tid)){

          $scope.title = trainingArray[i]["Title"];
          $scope.dateStart = trainingArray[i]["DateStart"];
          $scope.dateFinish = trainingArray[i]["DateFinish"];
          $scope.topic = trainingArray[i]["Topic"];
          $scope.eventType = trainingArray[i]["EventType"];
          $scope.involvement = trainingArray[i]["SV-MKInvolvement"];
          $scope.venue = trainingArray[i]["Venue"];
          $scope.country = trainingArray[i]["Country"];
          $scope.scale = trainingArray[i]["Scale"];
          $scope.partners = trainingArray[i]["CoPartner"];
          $scope.noparticipants = trainingArray[i]["NoParticipants"];
          $scope.male = trainingArray[i]["Male"];
          $scope.female = trainingArray[i]["Female"];
          $scope.participants = trainingArray[i]["Participants"];
          $scope.agenda = trainingArray[i]["Agenda"];
          $scope.material = trainingArray[i]["Material"];
          $scope.report = trainingArray[i]["Report"];
          $scope.evaluation = trainingArray[i]["Evaluation"];
          $scope.foto = trainingArray[i]["Foto"];
          $scope.video = trainingArray[i]["Video"];
          $scope.image = trainingArray[i]["ImageGoogleID"];
        }
      }

    });

})();
