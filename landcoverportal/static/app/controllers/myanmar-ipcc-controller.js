(function () {

    'use strict';
    angular.module('landcoverportal')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .controller('myanmarIPCCController', function ($scope, $sanitize, $timeout, appSettings, CommonService, MapService, MyanmarIPCCService) {

        // Typology CSV
        $scope.typologyCSV = '/static/data/myanmar_ipcc_typology_value.csv';

        // Setting variables
        $scope.myanmarIPCCLandCoverClasses = appSettings.myanmarIPCCLandCoverClasses;
        $scope.primitiveClasses = appSettings.primitiveClasses;
        $scope.provinceVariableOptions = appSettings.myanmarProvinces;

        // Global Variables
        var drawnArea = null;
        var map = MapService.init(100.7666, 21.6166, 6);

        // $scope variables
        $scope.alertContent = '';
        $scope.overlays = {};
        $scope.shape = {};
        $scope.toolControlClass = 'glyphicon glyphicon-eye-open';
        $scope.showTabContainer = true;
        $scope.showLoader = false;
        $scope.sliderYear = 2016;
        $scope.assemblageLayers = [];
        for (var i = 0; i <= 20; i++) {
            $scope.assemblageLayers.push(i.toString());
        }

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

        var clearSelectedArea = function () {
            $scope.province = null;
            $scope.$apply();
        };

        var clearDrawing = function () {
            if ($scope.overlays.polygon) {
                $scope.overlays.polygon.setMap(null);
                $scope.showPolygonDrawing = false;
            }
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
            MyanmarIPCCService.getLandCoverMap($scope.assemblageLayers, year, $scope.shape, $scope.province)
            .then(function (data) {
                var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, type);
                loadMap(type, mapType);
                $timeout(function () {
                    showInfoAlert('The map data shows the landcover data for ' + $scope.sliderYear);
                }, 3500);
                //$scope.showLegend = true;
            }, function (error) {
                showErrorAlert(error.error);
                console.log(error);
            });
        };

        var verifyBeforeDownload = function (type) {

            if (typeof(type) === 'undefined') type = 'landcover';

            var polygonCheck = true,
                primitiveCheck = true;

            /*if (['polygon', 'circle', 'rectangle'].indexOf($scope.shape.type) > -1) {
                if (drawnArea > AREA_LIMIT) {
                    showErrorAlert('The drawn polygon is larger than ' + AREA_LIMIT + ' km2. This exceeds the current limitations for downloading data. Please draw a smaller polygon!');
                    polygonCheck = false;
                }
            } else {
                showErrorAlert('Please draw a polygon before proceding to download!');
                polygonCheck = false;
            }*/
            var hasPolygon = (['polygon', 'circle', 'rectangle'].indexOf($scope.shape.type) > -1);
            if (!hasPolygon) {
                showErrorAlert('Please draw a polygon before proceding to download!');
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

        String.prototype.capitalize = function () {
            return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };

        /*
        * Select Options for Variables
        **/

        $scope.showAreaVariableSelector = false;
        $scope.province = null;
        $scope.shownGeoJson = null;

        $scope.loadAreaFromFile = function (name) {
            MapService.removeGeoJson(map);
            clearDrawing();

            if (name) {
                $scope.province = name;
                MapService.loadGeoJson(map, 'province', $scope.province);
            } else {
                $scope.province = null;
                $scope.shownGeoJson = null;
            }
        };

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

        // Listeners
        // Overlay Listener
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
            // Clear Layer First
            clearDrawing();
            var overlay = event.overlay;
            $scope.overlays.polygon = overlay;
            $scope.shape = {};

            var drawingType = event.type;
            $scope.shape.type = drawingType;
            if (drawingType === 'rectangle') {
                $scope.shape.geom = MapService.getRectangleBoundArray(overlay.getBounds());
                drawnArea = MapService.computeRectangleArea(overlay.getBounds());
                // Change event
                google.maps.event.addListener(overlay, 'bounds_changed', function () {
                    $scope.shape.geom = MapService.getRectangleBoundArray(event.overlay.getBounds());
                    drawnArea = MapService.computeRectangleArea(event.overlay.getBounds());
                });
            } else if (drawingType === 'circle') {
                $scope.shape.center = MapService.getCircleCenter(overlay);
                $scope.shape.radius = MapService.getCircleRadius(overlay);
                drawnArea = MapService.computeCircleArea(overlay);
                // Change event
                google.maps.event.addListener(overlay, 'radius_changed', function () {
                    $scope.shape.radius = MapService.getCircleRadius(event.overlay);
                    drawnArea = MapService.computeCircleArea(event.overlay);
                });
                google.maps.event.addListener(overlay, 'center_changed', function () {
                    $scope.shape.center = MapService.getCircleCenter(event.overlay);
                    drawnArea = MapService.getRadius(event.overlay);
                });
            } else if (drawingType === 'polygon') {
                var path = overlay.getPath();
                $scope.shape.geom = MapService.getPolygonBoundArray(path.getArray());
                drawnArea = MapService.computePolygonArea(path);
                // Change event
                google.maps.event.addListener(path, 'insert_at', function () {
                    var insert_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(insert_path.getArray());
                    drawnArea = MapService.computePolygonArea(insert_path);
                });
                google.maps.event.addListener(path, 'remove_at', function () {
                    var remove_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(remove_path.getArray());
                    drawnArea = MapService.computePolygonArea(remove_path);
                });
                google.maps.event.addListener(path, 'set_at', function () {
                    var set_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(set_path.getArray());
                    drawnArea = MapService.computePolygonArea(set_path);
                });
            }

            stopDrawing();
            clearSelectedArea();
            MapService.removeGeoJson(map);
        });

        // Geojson listener
        map.data.addListener('addfeature', function (event) {
            $scope.shownGeoJson = event.feature;
            var bounds = new google.maps.LatLngBounds();
            var _geometry = event.feature.getGeometry();
            MapService.processPoints(_geometry, bounds.extend, bounds);
            map.fitBounds(bounds);
            drawnArea = google.maps.geometry.spherical.computeArea(_geometry.getArray()[0].b) / 1e6;
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

        $('#file-input-container #file-input').change(function (event) {
            $scope.showLoader = true;
            $scope.$apply();
            clearDrawing();
            readFile(event);
            $(this).remove();
            $("<input type='file' class='hide' id='file-input' accept='.kml,.kmz,.json,.geojson,application/json,application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz'>").change(readFile).appendTo($('#file-input-container'));
            $scope.showLoader = false;
        });

        /**
         * Custom Control
         */

        // Analysis Tool Control
        $scope.toggleToolControl = function () {

            if ($('#analysis-tool-control span').hasClass('glyphicon-eye-open')) {
                $('#analysis-tool-control span').removeClass('glyphicon glyphicon-eye-open large-icon').addClass('glyphicon glyphicon-eye-close large-icon');
                $scope.showTabContainer = false;
            } else {
                $('#analysis-tool-control span').removeClass('glyphicon glyphicon-eye-close large-icon').addClass('glyphicon glyphicon-eye-open large-icon');
                $scope.showTabContainer = true;
            }
            $scope.$apply();
        };

        function AnalysisToolControl (controlDiv) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.setAttribute('class', 'tool-control text-center');
            controlUI.setAttribute('id', 'analysis-tool-control');
            controlUI.title = 'Toogle Tools Visibility';
            controlUI.innerHTML = "<span class='glyphicon glyphicon-eye-open large-icon' aria-hidden='true'></span>";
            controlDiv.appendChild(controlUI);

            // Setup the click event listeners
            controlUI.addEventListener('click', function () {
                $scope.toggleToolControl();
            });
        }

        var analysisToolControlDiv = document.getElementById('tool-control-container');
        new AnalysisToolControl(analysisToolControlDiv);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(analysisToolControlDiv);

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
            $('input[name="assemblage-checkbox"]').each(function () {
                if ($(this).prop('checked')) {
                    $scope.assemblageLayers.push($(this).val());
                }
            });
            $scope.showLoader = true;
            MapService.clearLayer(map, 'landcovermap');
            $scope.initMap($scope.sliderYear, 'landcovermap');
            MapService.removeGeoJson(map);
        };

        // Time Slider
        $("#slider-year-selector").ionRangeSlider({
            grid: true,
            min: 2000,
            max: 2016,
            from: 2016,
            force_edges: true,
            grid_num: 16,
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
                showInfoAlert('Preparing Download Link...');
                MyanmarIPCCService.getDownloadURL(
                    type,
                    $scope.shape,
                    $scope.province,
                    $scope.sliderYear,
                    $scope.assemblageLayers,
                    $scope.primitiveIndex
                )
                .then(function (data) {
                    showSuccessAlert('Your Download Link is ready!');
                    $scope[type + 'DownloadURL'] = data.downloadUrl;
                    $scope['show' + type.capitalize() + 'DownloadURL'] = true;
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
                $scope['show' + type.capitalize() + 'GDriveFileName'] = true;
            }
        };

        $scope.hideGDriveFileName = function (type) {
            $scope['show' + type.capitalize() + 'GDriveFileName'] = false;
        };

        $scope.saveToDrive = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            if (verifyBeforeDownload(type)) {
                // Check if filename is provided, if not use the default one
                var fileName = $sanitize($('#' + type + 'GDriveFileName').val() || '');
                showInfoAlert('Please wait while I prepare the download link for you. This might take a while!');
                MyanmarIPCCService.saveToDrive(
                    type,
                    $scope.shape,
                    $scope.province,
                    $scope.sliderYear,
                    $scope.assemblageLayers,
                    fileName,
                    $scope.primitiveIndex
                )
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
            MyanmarIPCCService.getPrimitiveMap(index, $scope.sliderYear, $scope.shape, $scope.province)
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
                showErrorAlert(error.error);
                console.log(error);
            });
        };
    });

})();
