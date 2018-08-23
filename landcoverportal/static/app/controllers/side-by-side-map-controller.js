(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('sideBySideMapController', function ($scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService) {

        // Mapping
        // Base Layers
		var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
			{
				minZoom: 4,
				attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, " +
				"<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, " +
				"Imagery � <a href='http://mapbox.com'>Mapbox</a>", // jshint ignore:line
				id: 'mapbox.light'
			}
        );

        var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, ' +
            'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        });

        var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        var map = L.map('map', {
            center: [16.4, 102.93],
            zoom: 5,
            layers: [Esri_WorldImagery]
        });

        var baseLayers = {
            "Satellite Imagery": Esri_WorldImagery,
            "Grayscale": mapbox,
            "Topo Map": Esri_WorldTopoMap
        };

        // Control
        L.control.layers(baseLayers).addTo(map);
        var sideBySideControl = L.control.sideBySide();

        // $scope variables
        $scope.leftLayer = null;
        $scope.rightLayer = null;
        $scope.assemblageLayers = [];
        for (var j = 0; j <= 20; j++) {
            $scope.assemblageLayers.push(j.toString());
        }
        $scope.alertContent = '';
        $scope.showLoader = false;

        /**
         * Alert
         */
        $scope.closeAlert = function () {
            $('.full-alert').addClass('display-none');
            $scope.alertContent = '';
        };

        var showErrorAlert = function (alertContent) {
            $scope.alertContent = alertContent;
            $('.full-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-success').addClass('alert-danger');
        };

        var showSuccessAlert = function (alertContent) {
            $scope.alertContent = alertContent;
            $('.full-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-danger').addClass('alert-success');
        };

        var showInfoAlert = function (alertContent) {
            $scope.alertContent = alertContent;
            $('.full-alert').removeClass('display-none').removeClass('alert-success').removeClass('alert-danger').addClass('alert-info');
        };

        /* Updates the image based on the current control panel config. */
        var loadMap = function (type, data) {
            $scope.showLoader = false;
            if (type === 'left') {
                $scope.leftLayer = L.tileLayer('https://earthengine.googleapis.com/map/' + data.eeMapId + '/{z}/{x}/{y}?token=' + data.eeMapToken);
                $scope.leftLayer.setZIndex(99);
                $scope.leftLayer.addTo(map);
            } else if (type === 'right') {
                $scope.rightLayer = L.tileLayer('https://earthengine.googleapis.com/map/' + data.eeMapId + '/{z}/{x}/{y}?token=' + data.eeMapToken);
                $scope.rightLayer.setZIndex(99);
                $scope.rightLayer.addTo(map);
            }
        };

        /**
         * Starts the Google Earth Engine application. The main entry point.
         */
        $scope.initMap = function (year, side) {
            $scope.showLoader = true;
            LandCoverService.getLandCoverMap($scope.assemblageLayers, year)
            .then(function (data) {
                loadMap(side, data);
            }, function (error) {
                showErrorAlert(error.error);
                console.log(error);
            });
        };

        // Map event
        map.on('layeradd', function (e) {
            if ($scope.leftLayer && $scope.rightLayer && !sideBySideControl._map) {
                sideBySideControl.setLeftLayers($scope.leftLayer);
                sideBySideControl.setRightLayers($scope.rightLayer);
                sideBySideControl.addTo(map);
            }
        });
    });

})();
