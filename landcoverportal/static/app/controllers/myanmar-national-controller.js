(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('myanmarNationalController', function ($rootScope, $http, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService) {

        // Global Variables
        var map = MapService.init(97.5814, 18.8936, 5.5);

        // Typology CSV
        $scope.typologyCSV = '/static/data/myanmar_national_typology_value.csv';

        // Setting variables
        $scope.myanmarNationalClasses = appSettings.myanmarNationalClasses;
        $scope.primitiveClasses = appSettings.myanmarPrimitiveClasses;
        // Area filter
        $scope.areaIndexSelectors = appSettings.areaIndexSelectors;

        //$scope.provinceVariableOptions = appSettings.myanmarProvinces;
        $scope.landCoverClassesColor = {};
        for (var i = 0; i < $scope.myanmarNationalClasses.length; i++) {
            $scope.landCoverClassesColor[$scope.myanmarNationalClasses[i].name] = $scope.myanmarNationalClasses[i].color;
        }

        // $scope variables
        $scope.overlays = {};
        $scope.shape = {};
        $scope.areaSelectFrom = null;
        $scope.areaName = null;
        $scope.shownGeoJson = null;

        $scope.showAreaVariableSelector = false;
        $scope.alertContent = '';
        $scope.toolControlClass = 'glyphicon glyphicon-eye-open';
        $scope.showTabContainer = true;
        $scope.showLoader = false;
        $scope.startYear = 2000;
        $scope.endYear = 2017;
        $scope.sliderYear = 2017;

        $scope.assemblageLayers = [];
        for (var j = 0; j <= $scope.myanmarNationalClasses.length - 1; j++) {
            $scope.assemblageLayers.push(j.toString());
        }

        $scope.mapClass = CommonService.mapClass;
        $scope.sideClass = CommonService.sideClass;
        $rootScope.$broadcast('showToggleFullScreenIcon', { show: true });
        $rootScope.$on('toggleFullScreen', function (event, data) {
            // do what you want with the data from the event
            $scope.mapClass = data.mapClass;
            $scope.sideClass = data.sideClass;
            if (data.mapClass === 'col-md-12 col-lg-12') {
                $('.custom-alert').css({ 'margin-left': '5%', 'width': 'calc(100vw - 20%)'});
                $('.slider-year-container').css({'width': '85%'});
            } else {
                $('.custom-alert').css({ 'margin-left': '25.5%', 'width': 'calc(100vw - 26%)'});
                $('.slider-year-container').css({'width': '60%'});
            }
        });

        /**
         * Alert
         */
        $scope.closeAlert = function () {
            $('.custom-alert').addClass('display-none');
            $scope.alertContent = '';
        };

        var showErrorAlert = function (alertContent) {
            $scope.alertContent = alertContent;
            $('.custom-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-success').addClass('alert-danger');
        };

        var showSuccessAlert = function (alertContent) {
            $scope.alertContent = alertContent;
            $('.custom-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-danger').addClass('alert-success');
        };

        var showInfoAlert = function (alertContent) {
            $scope.alertContent = alertContent;
            $('.custom-alert').removeClass('display-none').removeClass('alert-success').removeClass('alert-danger').addClass('alert-info');
        };

        // Google sign in
        $scope.showEmailID = false;
        $scope.emailID = '';
        $scope.googleSignIn = function () {
            auth2.grantOfflineAccess().then(function (authResult) {
                if (authResult.code) {

                    var req = {
                        method: 'POST',
                        url: '/storeauthcode/',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Content-Type': 'application/octet-stream; charset=utf-8',
                        },
                        data: {
                            authcode: authResult.code
                        }
                    };

                    $http(req)
                    .then(function (response) {
                        var data = response.data;
                        if (data.success) {
                            $scope.showEmailID = true;
                            $scope.emailID = data.email;
                        } else {
                            showErrorAlert('there was an error while authenticating using google sign-in');
                        }
                    })
                    .catch(function (e) {
                        console.log('Error: ', e);
                        throw e.data;
                    });
                } else {
                    showErrorAlert('there was an error while authenticating using google sign-in');
                }
            });
        };

        $scope.googleSignOut = function () {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                $scope.emailID = '';
                $scope.showEmailID = false;
                $scope.$apply();
            });
        };

        /**
         * Start with UI
         */

         // Analysis Tool Control
         $scope.toggleToolControl = function () {
             if ($('#analysis-tool-control i').hasClass('fas fa-chart-pie control-gray-color')) {
                 $('#analysis-tool-control i').removeClass('fas fa-chart-pie control-gray-color').addClass('fas fa-chart-pie');
                 $scope.showTabContainer = true;
             } else {
                 $('#analysis-tool-control i').removeClass('fas fa-chart-pie').addClass('fas fa-chart-pie control-gray-color');
                 $scope.showTabContainer = false;
             }
             $scope.$apply();
         };

        var analysisToolControlDiv = document.getElementById('tool-control-container');
        var analysisToolControlUI = new CommonService.AnalysisToolControl(analysisToolControlDiv);
        // Setup the click event listener
        analysisToolControlUI.addEventListener('click', function () {
            $scope.toggleToolControl();
        });
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(analysisToolControlDiv);

        /**
         * Tab
         */
        $('.tab-tool .btn-pref .btn').click(function () {
            $('.tab-tool .btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
            // $(".tab").addClass("active"); // instead of this do the below
            $(this).removeClass('btn-default').addClass('btn-primary');
        });

        $('.tab-tool .btn-pref-inner .btn').click(function () {
            $('.tab-tool .btn-pref-inner .btn').removeClass('btn-primary').addClass('btn-default');
            $(this).removeClass('btn-default').addClass('btn-primary');
        });

        $('#sidebar-tab .btn-pref .btn').click(function () {
            $('#sidebar-tab .btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
            // $(".tab").addClass("active"); // instead of this do the below
            $(this).removeClass('btn-default').addClass('btn-primary');
        });

        // get tooltip activated
        $('.js-tooltip').tooltip();

        // Landcover opacity slider
        $scope.landcoverOpacity = 1;
        $scope.showLandcoverOpacitySlider = true;
        /* slider init */
        var landcoverSlider = $('#landcover-opacity-slider').slider({
                formatter: function (value) {
                    return 'Opacity: ' + value;
                },
                tooltip: 'always'
            })
        .on('slideStart', function (event) {
            $scope.landcoverOpacity = $(this).data('slider').getValue();
        })
        .on('slideStop', function (event) {
            var value = $(this).data('slider').getValue();
            if (value !== $scope.landcoverOpacity) {
                $scope.overlays.landcovermap.setOpacity(value);
            }
        });

        // Primitive opacity slider
        $scope.primitiveOpacity = 1;
        $scope.showPrimitiveOpacitySlider = false;
        /* slider init */
        var primitiveSlider = $('#primitive-opacity-slider').slider({
                formatter: function (value) {
                    return 'Opacity: ' + value;
                },
                tooltip: 'always'
            })
        .on('slideStart', function (event) {
            $scope.primitiveOpacity = $(this).data('slider').getValue();
        })
        .on('slideStop', function (event) {
            var value = $(this).data('slider').getValue();
            if (value !== $scope.primitiveOpacity) {
                $scope.overlays.primitivemap.setOpacity(value);
            }
        });

        /*
        * Select Options for Variables
        **/
       $scope.populateAreaVariableOptions = function (option) {
            $scope.showAreaVariableSelector = true;
            $scope.areaSelectFrom = option.value;
            $scope.areaVariableOptions = CommonService.getAreaVariableOptions(option.value, true);
        };

       // Default the administrative area selection
       var clearSelectedArea = function () {
            $scope.areaSelectFrom = '';
            $scope.areaIndexSelector = '';
            $scope.areaName = '';
            $scope.$apply();
        };

        /* Updates the image based on the current control panel config. */
        var loadMap = function (type, mapType) {
            map.overlayMapTypes.push(mapType);
            $scope.overlays[type] = mapType;
            $scope.showLoader = false;
        };

        /**
         * Starts the Google Earth Engine application. The main entry point.
         */
        $scope.initMap = function (year, type) {
            $scope.showLoader = true;

            var parameters = {
                primitives: $scope.assemblageLayers,
                year: year,
                shape: $scope.shape,
                areaSelectFrom: $scope.areaSelectFrom,
                areaName: $scope.areaName,
                type: 'myanmar-national'
            };

            LandCoverService.getLandCoverMap(parameters)
            .then(function (data) {
                var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, type);
                loadMap(type, mapType);
                $timeout(function () {
                    showInfoAlert('The map data shows the landcover data for ' + $scope.sliderYear);
                }, 3500);
                //$scope.showLegend = true;
            }, function (error) {
                $scope.showLoader = false;
                showErrorAlert(error.error);
                console.log(error);
            });
        };

        /**
         *  Graphs and Charts
         */
        // Get stats for the graph
        $scope.getStats = function () {
            $('#report-tab').html('<h4>Please wait while I generate chart for you...</h4>');
            var parameters = {
                primitives:$scope.assemblageLayers,
                year: $scope.sliderYear,
                shape: $scope.shape,
                areaSelectFrom: $scope.areaSelectFrom,
                areaName: $scope.areaName,
                type: 'myanmar-national'
            };
            LandCoverService.getStats(parameters)
            .then(function (data) {
                var graphData = [];
                for (var key in data) {
                    graphData.push({ name: key, y: data[key], color: $scope.landCoverClassesColor[key] });
                }
                CommonService.buildChart(graphData, 'report-tab', 'Landcover types for ' + $scope.sliderYear);
            }, function (error) {
                console.log(error);
            });
        };

        var verifyBeforeDownload = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            var polygonCheck = true,
                primitiveCheck = true;

            //var turf_polygon = turf.bboxPolygon(MapService.getRectangleBoundArray(overlay.getBounds()));
            //var turf_myanmar = turf.polygon(myanmar_geometry);
            //console.log(turf.booleanContains(turf_myanmar, turf_polygon));

            var hasPolygon = (['polygon', 'circle', 'rectangle'].indexOf($scope.shape.type) > -1);
            if (!hasPolygon && !$scope.areaSelectFrom && !$scope.areaName) {
                showErrorAlert('Please draw a polygon or select administrative region before proceding to download!');
                polygonCheck = false;
            }

            if (type === 'primitive') {
                if (!$scope.primitiveIndex) {
                    showErrorAlert('Select a primitive Layer to Download!');
                    primitiveCheck = false;
                }
            }
            return polygonCheck && primitiveCheck;
        };

        $scope.copyToClipBoard = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            // Function taken from https://codepen.io/nathanlong/pen/ZpAmjv?editors=0010
            var btnCopy = $('.' + type + 'CpyBtn');
            var copyTest = document.queryCommandSupported('copy');
            var elOriginalText = btnCopy.attr('data-original-title');

            if (copyTest) {
                var copyTextArea = document.createElement('textarea');
                copyTextArea.value = $scope[type + 'DownloadURL'];
                document.body.appendChild(copyTextArea);
                copyTextArea.select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'Copied!' : 'Whoops, not copied!';
                    btnCopy.attr('data-original-title', msg).tooltip('show');
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
                document.body.removeChild(copyTextArea);
                btnCopy.attr('data-original-title', elOriginalText);
            } else {
                // Fallback if browser doesn't support .execCommand('copy')
                window.prompt("Copy to clipboard: Ctrl+C or Command+C");
            }
        };

        /*
        * load administrative area
        **/
        $scope.loadAdminArea = function (name) {
            MapService.clearDrawing($scope.overlays.polygon);
            MapService.removeGeoJson(map);
            $scope.shape = {};
            $scope.areaName = name;
            MapService.loadGeoJson(map, $scope.areaSelectFrom, name);
        };

        /**
         * Drawing Tool Manager
         **/

        var drawingManager = new google.maps.drawing.DrawingManager();

        var stopDrawing = function () {
            drawingManager.setDrawingMode(null);
        };

        $scope.drawShape = function (type) {
            drawingManager.setOptions(MapService.getDrawingManagerOptions(type));
            // Loading the drawing Tool in the Map.
            drawingManager.setMap(map);

        };

        // Drawing Tool Manager Event Listeners
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
            // Clear Layer First
            MapService.clearDrawing($scope.overlays.polygon);
            MapService.removeGeoJson(map);
            clearSelectedArea();

            var overlay = event.overlay;
            $scope.overlays.polygon = overlay;
            $scope.shape = {};

            var drawingType = event.type;
            $scope.shape.type = drawingType;
            if (drawingType === 'rectangle') {
                $scope.shape.geom = MapService.getRectangleBoundArray(overlay.getBounds());
                //drawnArea = MapService.computeRectangleArea(overlay.getBounds());
                // Change event
                google.maps.event.addListener(overlay, 'bounds_changed', function () {
                    $scope.shape.geom = MapService.getRectangleBoundArray(event.overlay.getBounds());
                });
            } else if (drawingType === 'circle') {
                $scope.shape.center = MapService.getCircleCenter(overlay);
                $scope.shape.radius = MapService.getCircleRadius(overlay);
                //drawnArea = MapService.computeCircleArea(overlay);
                // Change event
                google.maps.event.addListener(overlay, 'radius_changed', function () {
                    $scope.shape.radius = MapService.getCircleRadius(event.overlay);
                });
                google.maps.event.addListener(overlay, 'center_changed', function () {
                    $scope.shape.center = MapService.getCircleCenter(event.overlay);
                });
            } else if (drawingType === 'polygon') {
                var path = overlay.getPath();
                $scope.shape.geom = MapService.getPolygonBoundArray(path.getArray());
                //drawnArea = MapService.computePolygonArea(path);
                // Change event
                google.maps.event.addListener(path, 'insert_at', function () {
                    var insert_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(insert_path.getArray());
                });
                google.maps.event.addListener(path, 'remove_at', function () {
                    var remove_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(remove_path.getArray());
                });
                google.maps.event.addListener(path, 'set_at', function () {
                    var set_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(set_path.getArray());
                });
            }
            stopDrawing();
        });

        // Geojson listener
        map.data.addListener('addfeature', function (event) {
            $scope.shownGeoJson = event.feature;
            var bounds = new google.maps.LatLngBounds();
            var _geometry = event.feature.getGeometry();
            MapService.processPoints(_geometry, bounds.extend, bounds);
            map.fitBounds(bounds);
        });

        map.data.addListener('removefeature', function (event) {
            $scope.shownGeoJson = null;
        });

        /**
         * Upload Area Button
         **/
        var readFile = function (e) {

            var files = e.target.files;
            if (files.length > 1) {
                showErrorAlert('upload one file at a time');
                $scope.$apply();
            } else {
                MapService.removeGeoJson(map);

                var file = files[0];
                var reader = new FileReader();
                reader.readAsText(file);

                reader.onload = function (event) {

                    var textResult = event.target.result;
                    var addedGeoJson;

                    if ((['application/vnd.google-earth.kml+xml', 'application/vnd.google-earth.kmz'].indexOf(file.type) > -1)) {

                        var kmlDoc;

                        if (window.DOMParser) {
                            var parser = new DOMParser();
                            kmlDoc = parser.parseFromString(textResult, 'text/xml');
                        } else { // Internet Explorer
                            kmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                            kmlDoc.async = false;
                            kmlDoc.loadXML(textResult);
                        }
                        addedGeoJson = toGeoJSON.kml(kmlDoc);
                    } else {
                        try {
                            addedGeoJson = JSON.parse(textResult);
                        } catch (e) {
                            showErrorAlert('we only accept kml, kmz and geojson');
                            $scope.$apply();
                        }
                    }

                    if (((addedGeoJson.features) && (addedGeoJson.features.length === 1)) || (addedGeoJson.type === 'Feature')) {

                        var geometry = addedGeoJson.features ? addedGeoJson.features[0].geometry : addedGeoJson.geometry;

                        if (geometry.type === 'Polygon') {
                            MapService.addGeoJson(map, addedGeoJson);
                            // Convert to Polygon
                            var polygonArray = [];
                            var _coord = geometry.coordinates[0];

                            for (var i = 0; i < _coord.length; i++) {
                                var coordinatePair = [(_coord[i][0]).toFixed(2), (_coord[i][1]).toFixed(2)];
                                polygonArray.push(coordinatePair);
                            }

                            if (polygonArray.length > 500) {
                                showInfoAlert('Complex geometry will be simplified using the convex hull algorithm!');
                                $scope.$apply();
                            }

                            clearSelectedArea();
                            $scope.shape.type = 'polygon';
                            $scope.shape.geom = polygonArray;
                        } else {
                            showErrorAlert('multigeometry and multipolygon not supported yet!');
                            $scope.$apply();
                        }
                    } else {
                        showErrorAlert('multigeometry and multipolygon not supported yet!');
                        $scope.$apply();
                    }
                };
            }
        };

        // upload area change event
        $('#file-input-container #file-input').change(function (event) {
            $scope.showLoader = true;
            $scope.$apply();
            MapService.clearDrawing($scope.overlays.polygon);
            readFile(event);
            $(this).remove();
            $("<input type='file' class='hide' id='file-input' accept='.kml,.kmz,.json,.geojson,application/json,application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz'>").change(readFile).appendTo($('#file-input-container'));
            $scope.showLoader = false;
        });

        /*
        * Opacity Sliders
        */
        var sliderOptions = {
            formatter: function (value) {
                return 'Opacity: ' + value;
            }
        };

        // Update Assemblage Map
        $scope.updateAssemblageProduct = function () {
            $scope.closeAlert();
            $scope.assemblageLayers = [];
            var primitiveList = [];
            $('input[name="assemblage-checkbox"]').each(function () {
                if ($(this).prop('checked')) {
                    $scope.assemblageLayers.push($(this).val());
                }
            });
            $scope.showLoader = true;
            MapService.clearLayer(map, 'landcovermap');
            $scope.initMap($scope.sliderYear, 'landcovermap');
            $scope.getStats();
            MapService.removeGeoJson(map);
        };

        // Time Slider
        $("#slider-year-selector").ionRangeSlider({
            skin: 'round',
            grid: true,
            min: $scope.startYear,
            max: $scope.endYear,
            from: $scope.endYear,
            force_edges: true,
            grid_num: $scope.endYear - $scope.startYear,
            prettify_enabled: false,
            onFinish: function (data) {
                if ($scope.sliderYear !== data.from) {
                    $scope.sliderYear = data.from;
                    if ($('#land-cover-classes-tab').hasClass('active')) {
                        $scope.updateAssemblageProduct();
                    } else if ($('#primitive-tab').hasClass('active')) {
                        $scope.updatePrimitive($scope.primitiveIndex);
                    }
                }
            }
        });

        // Download URL
        $scope.landcoverDownloadURL = '';
        $scope.showLandcoverDownloadURL = false;
        $scope.showPrimitiveDownloadURL = false;
        $scope.primitiveDownloadURL = '';

        $scope.getDownloadURL = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            if (verifyBeforeDownload(type)) {
                $scope['show' + CommonService.capitalizeString(type) + 'DownloadURL'] = false;
                showInfoAlert('Preparing Download Link...');
                var parameters = {
                    primitives: $scope.assemblageLayers,
                    year: $scope.sliderYear,
                    shape: $scope.shape,
                    areaSelectFrom: $scope.areaSelectFrom,
                    areaName: $scope.areaName,
                    type: type,
                    index: $scope.primitiveIndex,
                    serviceType: 'myanmar-national'
                };
                LandCoverService.getDownloadURL(parameters)
                .then(function (data) {
                    showSuccessAlert('Your Download Link is ready!');
                    $scope[type + 'DownloadURL'] = data.downloadUrl;
                    $scope['show' + CommonService.capitalizeString(type) + 'DownloadURL'] = true;
                }, function (error) {
                    showErrorAlert(error.error);
                    console.log(error);
                });
            }
        };

        // Google Download
        $scope.showLandcoverGDriveFileName = false;

        $scope.showGDriveFileName = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            if (verifyBeforeDownload(type)) {
                $scope['show' + CommonService.capitalizeString(type) + 'GDriveFileName'] = true;
            }
        };

        $scope.hideGDriveFileName = function (type) {
            $scope['show' + CommonService.capitalizeString(type) + 'GDriveFileName'] = false;
        };

        $scope.saveToDrive = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            if (verifyBeforeDownload(type)) {
                // Check if filename is provided, if not use the default one
                var fileName = $sanitize($('#' + type + 'GDriveFileName').val() || '');
                showInfoAlert('Please wait while I prepare the download link for you. This might take a while!');

                var parameters = {
                    primitives: $scope.assemblageLayers,
                    year: $scope.sliderYear,
                    shape: $scope.shape,
                    areaSelectFrom: $scope.areaSelectFrom,
                    areaName: $scope.areaName,
                    type: type,
                    index: $scope.primitiveIndex,
                    fileName: fileName,
                    serviceType: 'myanmar-national'
                };

                LandCoverService.saveToDrive(parameters)
                .then(function (data) {
                    if (data.error) {
                        showErrorAlert(data.error);
                        console.log(data.error);
                    } else {
                        showInfoAlert(data.info);
                        $scope.hideGDriveFileName(type);
                        $('#' + type + 'GDriveFileName').val('');
                    }
                }, function (error) {
                    showErrorAlert(error.error);
                    console.log(error);
                });
            }
        };

        var getPrimitiveLabel = function (index) {
            for (var i = $scope.primitiveClasses.length - 1; i >= 0; i--) {
                if (typeof index === 'string') {
                    if ($scope.primitiveClasses[i].value === index) {
                        return $scope.primitiveClasses[i].name;
                    }
                } else if (typeof index === 'number') {
                    if (parseInt($scope.primitiveClasses[i].value) === parseInt(index)) {
                        return $scope.primitiveClasses[i].name;
                    }
                }
            }
            return '';
        };

        $scope.updatePrimitive = function (index) {
            $scope.showLoader = true;
            $scope.showPrimitiveOpacitySlider = false;

            var parameters = {
                index: index,
                year: $scope.sliderYear,
                shape: $scope.shape,
                areaSelectFrom: $scope.areaSelectFrom,
                areaName: $scope.areaName,
                type: 'myanmar-national'
            };

            LandCoverService.getPrimitiveMap(parameters)
            .then(function (data) {
                MapService.removeGeoJson(map);
                MapService.clearLayer(map, 'primitivemap');
                var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, 'primitivemap');
                loadMap('primitivemap', mapType);
                $timeout(function () {
                    showInfoAlert('Showing ' + getPrimitiveLabel(index) + ' primitive layer for ' + $scope.sliderYear);
                }, 3500);
                //$scope.showLegend = true;
                $scope.showPrimitiveOpacitySlider = true;
                $scope.primitiveIndex = index;
            }, function (error) {
                $scope.showLoader = false;
                showErrorAlert(error.error);
                console.log(error);
            });
        };
    });

})();
