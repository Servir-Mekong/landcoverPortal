(function () {

    'use strict';
    angular.module('landcoverportal')
    .filter('landCoverYearRange', function () {
        return function (input, min, max) {
            min = parseInt(min);
            max = parseInt(max);
            for (var i = min; i <= max; i++) {
                input.push(i);
            }
            return input;
        };
    })
    .controller('sideBySideMapController', function ($scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService) {

        // Mapping
        // Base Layers\
        var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
			{
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
        $scope.leftLayerYear = null;
        $scope.rightLayerYear = null;
        $scope.sideBySideControlInitialized = false;

        $scope.landCoverClasses = [];
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
            $scope[type + 'Layer'] = L.tileLayer('https://earthengine.googleapis.com/map/' + data.eeMapId + '/{z}/{x}/{y}?token=' + data.eeMapToken);
            $scope[type + 'Layer'].setZIndex(99);
            $scope[type + 'Layer'].addTo(map);
            $scope.showLoader = false;
        };

        var removeLayers = function (which) {
            if (typeof(which) === 'undefined') which = 'both';
            if (which === 'left') {
                map.removeLayer($scope.leftLayer);
                $scope.leftLayer = null;
            } else if (which === 'right') {
                map.removeLayer($scope.rightLayer);
                $scope.rightLayer = null;
            } else if (which === 'both') {
                map.removeLayer($scope.leftLayer);
                map.removeLayer($scope.rightLayer);
                $scope.leftLayer = null;
                $scope.rightLayer = null;
            }
            $scope.sideBySideControlInitialized = false;
        };

        /**
         * Starts the Google Earth Engine application. The main entry point.
         */
        $scope.initMap = function (year, side, version) {
            $scope.showLoader = true;
            if (side === 'right') {
                $scope.rightLayerYear = year;
            } else if (side === 'left') {
                $scope.leftLayerYear = year;
            }
            if (version === 'v1') {
                $scope.landCoverClasses = appSettings.landCoverClassesV1;
            } else if (version === 'v2') {
                $scope.landCoverClasses = appSettings.landCoverClassesV2;
            } else {
                $scope.landCoverClasses = appSettings.landCoverClasses;
            }
            var parameters = {
                primitives: $scope.assemblageLayers,
                year: year,
                version: version
            };
            LandCoverService.getLandCoverMap(parameters)
            .then(function (data) {
                loadMap(side, data);
            }, function (error) {
                showErrorAlert(error.error);
                console.log(error);
            });
        };

        // Map event
        map.on('layeradd', function () {
            if ($scope.leftLayer && $scope.rightLayer && !$scope.sideBySideControlInitialized) {
                sideBySideControl.setLeftLayers($scope.leftLayer);
                sideBySideControl.setRightLayers($scope.rightLayer);
                sideBySideControl.addTo(map);
                $scope.sideBySideControlInitialized = true;
            }
        });

        // Turf on/off side layers
        $scope.toggleLeftLayer = function (checked) {
            if ($scope.leftLayer) {
                if (checked) {
                    $scope.leftLayer.setOpacity(1);
                } else {
                    $scope.leftLayer.setOpacity(0);
                }
            }
        };

        $scope.toggleRightLayer = function (checked) {
            if ($scope.rightLayer) {
                if (checked) {
                    $scope.rightLayer.setOpacity(1);
                } else {
                    $scope.rightLayer.setOpacity(0);
                }
            }
        };

        // Update Assemblage Map
        $scope.updateAssemblageProduct = function (version) {
            $scope.showLoader = true;
            $scope.closeAlert();
            $scope.assemblageLayers = [];
            $('input[name="assemblage-checkbox"]').each(function () {
                if ($(this).prop('checked')) {
                    $scope.assemblageLayers.push($(this).val());
                }
            });
            removeLayers();
            $scope.initMap($scope.leftLayerYear, 'left', version);
            $scope.initMap($scope.rightLayerYear, 'right', version);
        };

        // Year Change
        $scope.landCoverLeftYearChange = function (year, version) {
            $scope.leftLayerYear = year;
            removeLayers('left');
            $scope.initMap($scope.leftLayerYear, 'left', version);
        };

        $scope.landCoverRightYearChange = function (year, version) {
            $scope.rightLayerYear = year;
            removeLayers('right');
            $scope.initMap($scope.rightLayerYear, 'right', version);
        };
    });

})();
