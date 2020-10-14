(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('AboutController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService) {

      // Global Variables
      var center = {
              lng: 100.540613, lat: 13.771462
          };

      // Global Variables
      var mapOptions = {
              center: center,
              zoom: 15,
              maxZoom: 25,
              mapTypeControl: false,
              mapTypeId: 'terrain',
              fullscreenControl: false,
              zoomControl: false,
              scaleControl: false,
              streetViewControl: false
          };

      // Map variable
      var map = new google.maps.Map(document.getElementById('contact_map'), mapOptions);
      var marker = new google.maps.Marker({ position: center, map: map });
    });

})();
