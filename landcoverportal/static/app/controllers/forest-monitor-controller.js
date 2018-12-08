(function () {

    'use strict';
    angular.module('landcoverportal')
    .filter('treeCanopyHeightYearRange', function () {
        return function (input, min, max) {
            min = parseInt(min);
            max = parseInt(max);
            for (var i = min; i <= max; i++) {
                input.push(i);
            }
            return input;
        };
    })
    .controller('forestMonitorController', function ($scope, $sanitize, appSettings, CommonService, MapService, ForestMonitorService) {

        // Global Variables
        var drawningManagerArea = null;
        var map = MapService.init();

        // Setting variables
        $scope.areaIndexSelectors = appSettings.areaIndexSelectors;

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

        // Reporting element
        $scope.showReportNoPolygon = true;
        $scope.showReportTotalArea = false;
        $scope.showReportTreeCanopy = false;
        $scope.showReportForestGain = false;
        $scope.showReportForestLoss = false;
        $scope.showReportForestExtend = false;

        /**
         * Start with UI
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
        $('.btn-pref .btn').click(function () {
            $('.btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
            // $(".tab").addClass("active"); // instead of this do the below
            $(this).removeClass('btn-default').addClass('btn-primary');
        });

        $('.btn-pref-inner .btn').click(function () {
            $('.btn-pref-inner .btn').removeClass('btn-primary').addClass('btn-default');
            $(this).removeClass('btn-default').addClass('btn-primary');
        });

        // get tooltip activated
        $('.js-tooltip').tooltip();

        // Date picker
        var datepickerOptions = {
            autoclose: true,
            clearBtn: true,
            container: '.datepicker'
        };

        $('#time-period-tab>#datepicker').datepicker(datepickerOptions);

        /**
         * Layer switcher Style
         */
        // Toggle minus and plus sign in layer control
        $('a.layer-control-toggle').click(function () {
            if ($(this).find('.glyphicon').hasClass('glyphicon-plus')) {
                $(this).find('.glyphicon').addClass('glyphicon-minus').removeClass('glyphicon-plus');
                $('.layer-control').css({
                    'marginRight': '44%'
                });
            } else {
                $(this).find('.glyphicon').addClass('glyphicon-plus').removeClass('glyphicon-minus');
                $('.layer-control').css({
                    'marginRight': '65%'
                });
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

        /*
         * Select Options for Variables
         **/
        $scope.populateAreaVariableOptions = function (option) {
            $scope.showAreaVariableSelector = true;
            $scope.areaSelectFrom = option.value;
            $scope.areaVariableOptions = CommonService.getAreaVariableOptions(option.value);
        };

        // Report Area
        var updateReportTotalArea = function () {
            $scope.showReportNoPolygon = false;
            $scope.reportTotalAreaValue = (Math.round(drawningManagerArea * 100 * 100) / 100).toLocaleString() + ' ha';
            $scope.showReportTotalArea = true;
            $scope.$apply();
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
        };

        var verifyBeforeDownload = function (startYear, endYear, requireBoth) {

            var hasPolygon = (['polygon', 'circle', 'rectangle'].indexOf($scope.shape.type) > -1);
            if (!hasPolygon && !$scope.areaSelectFrom && !$scope.areaName) {
                showErrorAlert('Please draw a polygon or select administrative region before proceding to download!');
                return false;
            }

            if (typeof(requireBoth) === 'undefined') requireBoth = false;
            if (requireBoth) {
                if (startYear && !endYear) {
                    showErrorAlert('Please provide the end year!');
                    return false;
                } else if (!startYear && endYear) {
                    showErrorAlert('Please provide start year!');
                    return false;
                } else if (!(startYear && endYear)) {
                    showErrorAlert('Please select both start and end date!');
                    return false;
                } else if (Number(startYear) >= Number(endYear)) {
                    showErrorAlert('End year must be greater than start year!');
                    return false;
                }
            }
            return true;
        };

        $scope.copyToClipBoard = function (type) {
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
                window.prompt('Copy to clipboard: Ctrl+C or Command+C');
            }
        };

        // Download URL
        $scope.showTreeCanopyDownloadURL = false;
        $scope.treeCanopyDownloadURL = '';
        $scope.showTreeHeightDownloadURL = false;
        $scope.treeHeightDownloadURL = '';
        $scope.showForestGainDownloadURL = false;
        $scope.forestGainDownloadURL = '';
        $scope.showForestLossDownloadURL = false;
        $scope.forestLossDownloadURL = '';
        $scope.showForestExtendDownloadURL = false;
        $scope.forestExtendDownloadURL = '';

        $scope.getDownloadURL = function (type, startYear, endYear, requireBoth) {
            var verified = verifyBeforeDownload(startYear, endYear, requireBoth);
            if (verified) {
                $scope['show' + CommonService.capitalizeString(type) + 'DownloadURL'] = false;
                showInfoAlert('Preparing Download Link...');

                var parameters = {
                    startYear: startYear,
                    endYear: endYear,
                    shape: $scope.shape,
                    areaSelectFrom: $scope.areaSelectFrom,
                    areaName: $scope.areaName,
                    treeCanopyDefinition: $scope.treeCanopyDefinition,
                    treeHeightDefinition: $scope.treeHeightDefinition,
                    type: type
                };

                ForestMonitorService.getDownloadURL(parameters)
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
        $scope.showTreeCanopyGDriveFileName = false;
        $scope.showTreeHeightGDriveFileName = false;
        $scope.showForestGainGDriveFileName = false;
        $scope.showForestLossGDriveFileName = false;
        $scope.showForestExtendGDriveFileName = false;

        $scope.showGDriveFileName = function (type, startYear, endYear, requireBoth) {
            var verified = verifyBeforeDownload(startYear, endYear, requireBoth);
            if (verified) {
                $scope['show' + CommonService.capitalizeString(type) + 'GDriveFileName'] = true;
            }
        };

        $scope.hideGDriveFileName = function (type) {
            $scope['show' + CommonService.capitalizeString(type) + 'GDriveFileName'] = false;
        };

        $scope.saveToDrive = function (type, startYear, endYear, requireBoth) {
            var verified = verifyBeforeDownload(startYear, endYear, requireBoth);
            if (verified) {
                // Check if filename is provided, if not use the default one
                var fileName = $sanitize($('#' + type + 'GDriveFileName').val() || '');
                showInfoAlert('Please wait while I prepare the download link for you. This might take a while!');

                var parameters = {
                    startYear: startYear,
                    endYear: endYear,
                    fileName: fileName,
                    shape: $scope.shape,
                    areaSelectFrom: $scope.areaSelectFrom,
                    areaName: $scope.areaName,
                    treeCanopyDefinition: $scope.treeCanopyDefinition,
                    treeHeightDefinition: $scope.treeHeightDefinition,
                    type: type
                };

                ForestMonitorService.saveToDrive(parameters)
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
                drawningManagerArea = MapService.computeRectangleArea(overlay.getBounds());
                // Change event
                google.maps.event.addListener(overlay, 'bounds_changed', function () {
                    $scope.shape.geom = MapService.getRectangleBoundArray(event.overlay.getBounds());
                    drawningManagerArea = MapService.computeRectangleArea(event.overlay.getBounds());
                    updateReportTotalArea();
                });
            } else if (drawingType === 'circle') {
                $scope.shape.center = MapService.getCircleCenter(overlay);
                $scope.shape.radius = MapService.getCircleRadius(overlay); // unit: meter
                drawningManagerArea = MapService.computeCircleArea(overlay);
                // Change event
                google.maps.event.addListener(overlay, 'radius_changed', function () {
                    $scope.shape.radius = MapService.getCircleRadius(event.overlay);
                    drawningManagerArea = MapService.computeCircleArea(event.overlay);
                    updateReportTotalArea();
                });
                google.maps.event.addListener(overlay, 'center_changed', function () {
                    $scope.shape.center = MapService.getCircleCenter(event.overlay);
                    drawningManagerArea = MapService.computeCircleArea(event.overlay);
                    //updateReportTotalArea();
                });
            } else if (drawingType === 'polygon') {
                var path = overlay.getPath();
                $scope.shape.geom = MapService.getPolygonBoundArray(path.getArray());
                drawningManagerArea = MapService.computePolygonArea(path);
                // Change event
                google.maps.event.addListener(path, 'insert_at', function () {
                    var insert_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(insert_path.getArray());
                    drawningManagerArea = MapService.computePolygonArea(insert_path);
                    updateReportTotalArea();
                });
                google.maps.event.addListener(path, 'remove_at', function () {
                    var remove_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(remove_path.getArray());
                    drawningManagerArea = MapService.computePolygonArea(remove_path);
                    updateReportTotalArea();
                });
                google.maps.event.addListener(path, 'set_at', function () {
                    var set_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(set_path.getArray());
                    drawningManagerArea = MapService.computePolygonArea(set_path);
                    updateReportTotalArea();
                });
            }
            stopDrawing();
            updateReportTotalArea();
        });

        // Geojson listener
        map.data.addListener('addfeature', function (event) {
            $scope.shownGeoJson = event.feature;
            var bounds = new google.maps.LatLngBounds();
            var _geometry = event.feature.getGeometry();
            MapService.processPoints(_geometry, bounds.extend, bounds);
            map.fitBounds(bounds);
            drawningManagerArea = google.maps.geometry.spherical.computeArea(_geometry.getArray()[0].b) / 1e6;
            updateReportTotalArea();
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

        // Callbacks for Parameters (forest canopy, change, loss etc)
        var parameterChangeSuccessCallback = function (name, data, slider, message) {
            MapService.removeGeoJson(map);
            var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, name);
            loadMap(name, mapType);
            slider.slider('setValue', 1);
            showSuccessAlert(message);
            $scope.showLoader = false;
        };

        var parameterChangeErrorCallback = function (error) {
            $scope.showLoader = false;
            console.log(error);
            showErrorAlert(error.error);
        };

        /**
         * Slider
         */
        var sliderOptions = {
            formatter: function (value) {
                return 'Opacity: ' + value;
            }
        };

        /*
        * Tree Canopy Calculations
        */
        $scope.showTreeCanopyOpacitySlider = false;
        $scope.treeCanopyOpacitySliderValue = null;
        $scope.showTreeCanopyDownloadButtons = false;

        /* slider init */
        var treeCanopySlider = $('#tree-canopy-opacity-slider').slider(sliderOptions)
        .on('slideStart', function (event) {
            $scope.treeCanopyOpacitySliderValue = $(this).data('slider').getValue();
        })
        .on('slideStop', function (event) {
            var value = $(this).data('slider').getValue();
            if (value !== $scope.treeCanopyOpacitySliderValue) {
                $scope.treeCanopyOpacitySliderValue = value;
                $scope.overlays.treeCanopy.setOpacity(value);
            }
        });

        /* Layer switcher */
        $('#treeCanopySwitch').change(function () {
            if ($(this).is(':checked')) {
                $scope.overlays.treeCanopy.setOpacity($scope.treeCanopyOpacitySliderValue);
            } else {
                $scope.overlays.treeCanopy.setOpacity(0);
            }
        });

        $scope.treeCanopyYearChange = function (year) {
            $scope.showLoader = true;
            var name = 'treeCanopy';
            MapService.clearLayer(map, name);
            $scope.closeAlert();
            // Close and restart this after success
            $scope.showTreeCanopyOpacitySlider = false;

            var parameters = {
                year: year,
                shape: $scope.shape,
                areaSelectFrom: $scope.areaSelectFrom,
                areaName: $scope.areaName,
                treeCanopyDefinition: $scope.treeCanopyDefinition,
                type: name
            };

            ForestMonitorService.treeCanopyChange(parameters)
            .then(function (data) {
                parameterChangeSuccessCallback(name, data, treeCanopySlider, 'Tree Canopy Cover for year ' + year + ' !');
                $scope.showTreeCanopyOpacitySlider = true;
                $scope.showTreeCanopyDownloadButtons = true;
                // Reporting Element
                /*if (!$scope.showReportNoPolygon) {
                    if (data.area) {
                        $scope.reportTreeCanopyTitle = 'Tree Canopy Cover for ' + year;
                        $scope.reportTreeCanopyValue = data.area + ' ha';
                        $scope.showReportTreeCanopy = true;
                    } else if (data.reportError) {
                        $scope.reportTreeCanopyTitle = 'Error calculating Canopy';
                        $scope.reportTreeCanopyValue = data.reportError;
                        $scope.showReportTreeCanopy = true;
                    }
                }*/
            }, function (error) {
                parameterChangeErrorCallback(error);
            });

            ForestMonitorService.getStats(parameters)
            .then(function (data) {
                // Reporting Element
                //if (!$scope.showReportNoPolygon) {
                $scope.showReportNoPolygon = false;
                if (data.area) {
                    $scope.reportTreeCanopyTitle = 'Tree Canopy Cover for ' + year;
                    $scope.reportTreeCanopyValue = data.area;
                    $scope.showReportTreeCanopy = true;
                } else if (data.reportError) {
                    $scope.reportTreeCanopyTitle = 'Error calculating Canopy';
                    $scope.reportTreeCanopyValue = data.reportError;
                    $scope.showReportTreeCanopy = true;
                }
                //}
            }, function (error) {
                parameterChangeErrorCallback(error);
            });
        };

        /*
            * Tree Height Calculations
            */
        $scope.showTreeHeightOpacitySlider = false;
        $scope.treeHeightOpacitySliderValue = null;
        $scope.showTreeHeightDownloadButtons = false;

        /* slider init */
        var treeHeightSlider = $('#tree-height-opacity-slider').slider(sliderOptions)
        .on('slideStart', function (event) {
            $scope.treeHeightOpacitySliderValue = $(this).data('slider').getValue();
        })
        .on('slideStop', function (event) {
            var value = $(this).data('slider').getValue();
            if (value !== $scope.treeHeightOpacitySliderValue) {
                $scope.treeHeightOpacitySliderValue = value;
                $scope.overlays.treeHeight.setOpacity(value);
            }
        });

        /* Layer switcher */
        $('#treeHeightSwitch').change(function () {
            if ($(this).is(':checked')) {
                $scope.overlays.treeHeight.setOpacity($scope.treeHeightOpacitySliderValue);
            } else {
                $scope.overlays.treeHeight.setOpacity(0);
            }
        });

        $scope.treeHeightYearChange = function (year) {
            $scope.showLoader = true;
            var name = 'treeHeight';
            MapService.clearLayer(map, name);
            $scope.closeAlert();
            $scope.showTreeHeightOpacitySlider = false;

            var parameters = {
                year: year,
                shape: $scope.shape,
                areaSelectFrom: $scope.areaSelectFrom,
                areaName: $scope.areaName,
                treeHeightDefinition: $scope.treeHeightDefinition
            };

            ForestMonitorService.treeHeightChange(parameters)
            .then(function (data) {
                parameterChangeSuccessCallback(name, data, treeHeightSlider, 'Tree Canopy Height for year ' + year + ' !');
                $scope.showTreeHeightOpacitySlider = true;
                $scope.showTreeHeightDownloadButtons = true;
            }, function (error) {
                parameterChangeErrorCallback(error);
            });
        };

        /*
        * Forest Gain Calculations
        */
        $scope.showForestGainOpacitySlider = false;
        $scope.forestGainOpacitySliderValue = null;
        $scope.showForestGainDownloadButtons = false;

        /* slider init */
        var forestGainSlider = $('#forest-gain-opacity-slider').slider(sliderOptions)
        .on('slideStart', function (event) {
            $scope.forestGainOpacitySliderValue = $(this).data('slider').getValue();
        })
        .on('slideStop', function (event) {
            var value = $(this).data('slider').getValue();
            if (value !== $scope.forestGainOpacitySliderValue) {
                $scope.forestGainOpacitySliderValue = value;
                $scope.overlays.forestGain.setOpacity(value);
            }
        });

        /* Layer switcher */
        $('#forestGainSwitch').change(function () {
            if ($(this).is(':checked')) {
                $scope.overlays.forestGain.setOpacity($scope.forestGainOpacitySliderValue);
            } else {
                $scope.overlays.forestGain.setOpacity(0);
            }
        });

        $scope.calculateForestGain = function (startYear, endYear) {

            //if (verifyBeforeDownload(startYear, endYear, true)) {
                $scope.showLoader = true;
                var name = 'forestGain';
                MapService.clearLayer(map, name);
                $scope.closeAlert();
                $scope.showForestGainOpacitySlider = false;

                var parameters = {
                    startYear: startYear,
                    endYear: endYear,
                    shape: $scope.shape,
                    areaSelectFrom: $scope.areaSelectFrom,
                    areaName: $scope.areaName,
                    treeCanopyDefinition: $scope.treeCanopyDefinition,
                    treeHeightDefinition: $scope.treeHeightDefinition,
                    type: name
                };

                ForestMonitorService.forestGain(parameters)
                .then(function (data) {
                    parameterChangeSuccessCallback(name, data, forestGainSlider, 'Forest Gain from year ' + startYear + ' to ' + endYear + ' !');
                    $scope.showForestGainOpacitySlider = true;
                    $scope.showForestGainDownloadButtons = true;
                    // Reporting Element
                    /*if (!$scope.showReportNoPolygon) {
                        if (data.area) {
                            $scope.reportForestGainTitle = 'GAIN AREA (' + startYear + ' - ' + endYear + ') with tree cover canopy >' + $scope.treeCanopyDefinition + '% and tree height >' + $scope.treeHeightDefinition + ' meters';
                            $scope.reportForestGainValue = data.area + ' ha';
                            $scope.showReportForestGain = true;
                        } else if (data.reportError) {
                            $scope.reportForestGainTitle = 'Error calculating Forest Gain';
                            $scope.reportForestGainValue = data.reportError;
                            $scope.showReportForestGain = true;
                        }
                    }*/
                }, function (error) {
                    parameterChangeErrorCallback(error);
                });

                ForestMonitorService.getStats(parameters)
                .then(function (data) {
                    // Reporting Element
                    //if (!$scope.showReportNoPolygon) {
                    $scope.showReportNoPolygon = false;
                    if (data.area) {
                        $scope.reportForestGainTitle = 'GAIN AREA (' + startYear + ' - ' + endYear + ') with tree cover canopy >' + $scope.treeCanopyDefinition + '% and tree height >' + $scope.treeHeightDefinition + ' meters';
                        $scope.reportForestGainValue = data.area;
                        $scope.showReportForestGain = true;
                    } else if (data.reportError) {
                        $scope.reportForestGainTitle = 'Error calculating Forest Gain';
                        $scope.reportForestGainValue = data.reportError;
                        $scope.showReportForestGain = true;
                    }
                    //}
                }, function (error) {
                    parameterChangeErrorCallback(error);
                });
            //}
        };

        /*
        * Forest Loss Calculations
        */
        $scope.showForestLossOpacitySlider = false;
        $scope.forestLossOpacitySliderValue = null;
        $scope.showForestLossDownloadButtons = false;

        /* slider init */
        var forestLossSlider = $('#forest-loss-opacity-slider').slider(sliderOptions)
        .on('slideStart', function (event) {
            $scope.forestLossOpacitySliderValue = $(this).data('slider').getValue();
        })
        .on('slideStop', function (event) {
            var value = $(this).data('slider').getValue();
            if (value !== $scope.forestLossOpacitySliderValue) {
                $scope.forestLossOpacitySliderValue = value;
                $scope.overlays.forestLoss.setOpacity(value);
            }
        });

        /* Layer switcher */
        $('#forestLossSwitch').change(function () {
            if ($(this).is(':checked')) {
                $scope.overlays.forestLoss.setOpacity($scope.forestLossOpacitySliderValue);
            } else {
                $scope.overlays.forestLoss.setOpacity(0);
            }
        });

        $scope.calculateForestLoss = function (startYear, endYear) {

            //if (verifyBeforeDownload(startYear, endYear, true)) {
                $scope.showLoader = true;
                var name = 'forestLoss';
                MapService.clearLayer(map, name);
                $scope.closeAlert();
                $scope.showForestLossOpacitySlider = false;

                var parameters = {
                    startYear: startYear,
                    endYear: endYear,
                    shape: $scope.shape,
                    areaSelectFrom: $scope.areaSelectFrom,
                    areaName: $scope.areaName,
                    treeCanopyDefinition: $scope.treeCanopyDefinition,
                    treeHeightDefinition: $scope.treeHeightDefinition,
                    type: name
                };

                ForestMonitorService.forestLoss(parameters)
                .then(function (data) {
                    parameterChangeSuccessCallback(name, data, forestLossSlider, 'Forest Loss from year ' + startYear + ' to ' + endYear + ' !');
                    $scope.showForestLossOpacitySlider = true;
                    $scope.showForestLossDownloadButtons = true;
                    // Reporting Element
                    /*if (!$scope.showReportNoPolygon) {
                        if (data.area) {
                            $scope.reportForestLossTitle = 'LOSS AREA (' + startYear + ' - ' + endYear + ') with tree canopy cover >' + $scope.treeCanopyDefinition + '% and tree height >' + $scope.treeHeightDefinition + ' meters';
                            $scope.reportForestLossValue = data.area + ' ha';
                            $scope.showReportForestLoss = true;
                        } else if (data.reportError) {
                            $scope.reportForestLossTitle = 'Error calculating Forest Loss';
                            $scope.reportForestLossValue = data.reportError;
                            $scope.showReportForestLoss = true;
                        }
                    }*/
                }, function (error) {
                    parameterChangeErrorCallback(error);
                });

                ForestMonitorService.getStats(parameters)
                .then(function (data) {
                    // Reporting Element
                    //if (!$scope.showReportNoPolygon) {
                    $scope.showReportNoPolygon = false;
                    if (data.area) {
                        $scope.reportForestLossTitle = 'LOSS AREA (' + startYear + ' - ' + endYear + ') with tree canopy cover >' + $scope.treeCanopyDefinition + '% and tree height >' + $scope.treeHeightDefinition + ' meters';
                        $scope.reportForestLossValue = data.area;
                        $scope.showReportForestLoss = true;
                    } else if (data.reportError) {
                        $scope.reportForestLossTitle = 'Error calculating Forest Loss';
                        $scope.reportForestLossValue = data.reportError;
                        $scope.showReportForestLoss = true;
                    }
                    //}
                }, function (error) {
                    parameterChangeErrorCallback(error);
                });
            //}
        };

        /*
            * Forest Extend Calculations
            */
        $scope.showForestExtendOpacitySlider = false;
        $scope.forestExtendOpacitySliderValue = null;
        $scope.showForestExtendDownloadButtons = false;

        /* slider init */
        var forestExtendSlider = $('#forest-extend-opacity-slider').slider(sliderOptions)
        .on('slideStart', function (event) {
            $scope.forestExtendOpacitySliderValue = $(this).data('slider').getValue();
        })
        .on('slideStop', function (event) {
            var value = $(this).data('slider').getValue();
            if (value !== $scope.forestExtendOpacitySliderValue) {
                $scope.forestExtendOpacitySliderValue = value;
                $scope.overlays.forestExtend.setOpacity(value);
            }
        });

        /* Layer switcher */
        $('#forestExtendSwitch').change(function () {
            if ($(this).is(':checked')) {
                $scope.overlays.forestExtend.setOpacity($scope.forestExtendOpacitySliderValue);
            } else {
                $scope.overlays.forestExtend.setOpacity(0);
            }
        });

        $scope.calculateForestExtend = function (year) {

            $scope.showLoader = true;
            var name = 'forestExtend';
            MapService.clearLayer(map, name);
            $scope.closeAlert();
            // Close and restart this after success
            $scope.showForestExtendOpacitySlider = false;

            var parameters = {
                year: year,
                shape: $scope.shape,
                areaSelectFrom: $scope.areaSelectFrom,
                areaName: $scope.areaName,
                treeCanopyDefinition: $scope.treeCanopyDefinition,
                treeHeightDefinition: $scope.treeHeightDefinition,
                type: name
            };

            ForestMonitorService.forestExtend(parameters)
            .then(function (data) {
                parameterChangeSuccessCallback(name, data, forestExtendSlider, 'Forest Extend for year ' + year + ' !');
                $scope.showForestExtendOpacitySlider = true;
                $scope.showForestExtendDownloadButtons = true;
                // Reporting Element
                /*if (!$scope.showReportNoPolygon) {
                    if (data.area) {
                        $scope.reportForestExtendTitle = 'Forest Extend for ' + year;
                        $scope.reportForestExtendValue = data.area + ' ha';
                        //$scope.showReportForestExtend = true;
                    } else if (data.reportError) {
                        $scope.reportForestExtendTitle = 'Error calculating Canopy';
                        $scope.reportForestExtendValue = data.reportError;
                    }
                    $scope.showReportForestExtend = true;
                }*/
            }, function (error) {
                parameterChangeErrorCallback(error);
            });

            ForestMonitorService.getStats(parameters)
            .then(function (data) {
                // Reporting Element
                //if (!$scope.showReportNoPolygon) {
                $scope.showReportNoPolygon = false;
                if (data.area) {
                    $scope.reportForestExtendTitle = 'Forest Extend for ' + year;
                    $scope.reportForestExtendValue = data.area;
                    $scope.showReportForestExtend = true;
                } else if (data.reportError) {
                    $scope.reportForestExtendTitle = 'Error calculating Forest Extend';
                    $scope.reportForestExtendValue = data.reportError;
                }
                //}
            }, function (error) {
                parameterChangeErrorCallback(error);
            });
        };

    });

})();
