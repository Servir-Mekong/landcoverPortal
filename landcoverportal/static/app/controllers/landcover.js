(function () {

	'use strict';
	angular.module('landcoverportal')
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
  		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	}])
	.controller('landCoverCtrl', function ($scope, $sanitize, $timeout, appSettings, LandCoverService) {

		// Setting variables
		$scope.landCoverClasses = appSettings.landCoverClasses;
		$scope.primitiveClasses = appSettings.primitiveClasses;

		// Earth Engine
		// Global Variables
		var EE_URL = 'https://earthengine.googleapis.com',
			DEFAULT_ZOOM = 5,
			MAX_ZOOM = 25,
			DEFAULT_CENTER = { lng: 102.93, lat: 16.4 },
			AREA_LIMIT = 20000,
			// Map options
			mapOptions = {
				center: DEFAULT_CENTER,
				zoom: DEFAULT_ZOOM,
				maxZoom: MAX_ZOOM,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		            position: google.maps.ControlPosition.TOP_CENTER
		        },
		        fullscreenControl: true,
		        fullscreenControlOptions: {
		        	position: google.maps.ControlPosition.TOP_LEFT
		        },
				zoomControlOptions: {
				  position: google.maps.ControlPosition.RIGHT_BOTTOM
				},
				scaleControl: true,
				streetViewControl: true,
				streetViewControlOptions: {
				  position: google.maps.ControlPosition.TOP_CENTER
				},
		        mapTypeId: 'hybrid'
			},
			// Map variable
			map = new google.maps.Map(document.getElementById('map'), mapOptions),
			drawnArea = null;

		// $scope variables
		$scope.alertContent = '';
		$scope.overlays = {};
		$scope.shape = {};
		$scope.toolControlClass = 'glyphicon glyphicon-eye-open';
		$scope.showTabContainer = true;
		$scope.showLoader = false;
		$scope.sliderYear = 2016;
		$scope.assemblageLayers = [];
		for (var i=0; i<=20; i++) {
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

		/**
		 * Utilities function
		 **/

		var removeShownGeoJson = function () {
			if ($scope.shownGeoJson) {
				map.data.forEach(function(feature) {
    				map.data.remove(feature);
				});
			}
		};

		var clearSelectedArea = function () {
			$scope.areaSelectFrom = '';
			$scope.areaIndexSelector = '';
			$scope.areaName = '';
			$scope.$apply();
		};

		var clearLayer = function (name) {

			map.overlayMapTypes.forEach (function (layer, index) {
				if (layer.name === name) {
					map.overlayMapTypes.removeAt(index);
				}
			});
		};

		var clearDrawing = function () {

			if ($scope.overlays.polygon) {
				$scope.overlays.polygon.setMap(null);
				$scope.showPolygonDrawing = false;
			}
		};

		/* Updates the image based on the current control panel config. */
		var loadMap = function (mapId, mapToken, type) {

			if (typeof(type) === 'undefined') type = 'landcovermap';

			var eeMapOptions = {
				getTileUrl: function (tile, zoom) {
					var url = EE_URL + '/map/';
						url += [mapId, zoom, tile.x, tile.y].join('/');
						url += '?token=' + mapToken;
						return url;
				},
				tileSize: new google.maps.Size(256, 256),
				opacity: 1.0,
				name: type
			};
			var mapType = new google.maps.ImageMapType(eeMapOptions);
			if (type === 'landcovermap') {
				landcoverSlider.slider('setValue', 1);
			}
			else if (type === 'primitivemap') {
				primitiveSlider.slider('setValue', 1);
			}
			map.overlayMapTypes.push(mapType);
			$scope.overlays[type] = mapType;
			$scope.showLoader = false;
		};

		/**
		* Starts the Google Earth Engine application. The main entry point.
		*/
		$scope.initMap = function (year, type) {
			$scope.showLoader = true;
			LandCoverService.getLandCoverMap($scope.assemblageLayers,
											 year, $scope.shape, $scope.areaSelectFrom, $scope.areaName)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, type);
	    		$timeout(function () {
					showInfoAlert('The map data shows the landcover data for ' + $scope.sliderYear);
	    		}, 3500);
		    	//$scope.showLegend = true;
		    }, function (error) {
		        console.log(error);
		        showErrorAlert(error.statusText);
		    });
		};

		/**
		* Process each point in a Geometry, regardless of how deep the points may lie.
		* @param {google.maps.Data.Geometry} geometry The structure to process
		* @param {function(google.maps.LatLng)} callback A function to call on each
		*     LatLng point encountered (e.g. Array.push)
		* @param {Object} thisArg The value of 'this' as provided to 'callback' (e.g.
		*     myArray)
		*/
		var processPoints = function (geometry, callback, thisArg) {
			if (geometry instanceof google.maps.LatLng) {
				callback.call(thisArg, geometry);
			} else if (geometry instanceof google.maps.Data.Point) {
				callback.call(thisArg, geometry.get());
			} else {
				geometry.getArray().forEach(function(g) {
					processPoints(g, callback, thisArg);
				});
			}
		};

		var getRectangleArray = function (bounds) {
			var start = bounds.getNorthEast();
			var end = bounds.getSouthWest();
			return [start.lng().toFixed(2), start.lat().toFixed(2), end.lng().toFixed(2), end.lat().toFixed(2)];
		};

		var getPolygonArray = function (pathArray) {
			var geom = [];
			for (var i = 0; i < pathArray.length; i++) {
				var coordinatePair = [pathArray[i].lng().toFixed(2), pathArray[i].lat().toFixed(2)];
				geom.push(coordinatePair);
			}
			return geom;
		};

		var computeRectangleArea = function (bounds) {
			if (!bounds) {
				return 0;
			}

			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();
			var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
			var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
			var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
			var northWest = new google.maps.LatLng(ne.lat(), sw.lng());
			return google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast]) / 1e6;
		};

		var verifyBeforeDownload = function (type) {

			if (typeof(type) === 'undefined') type = 'landcover';

			var polygonCheck = true,
				primitiveCheck = true;

			if (['polygon', 'circle', 'rectangle'].indexOf($scope.shape.type) > -1) {
				if (drawnArea > AREA_LIMIT) {
					showErrorAlert('The drawn polygon is larger than ' + AREA_LIMIT + ' km2. This exceeds the current limitations for downloading data. Please draw a smaller polygon!');
					polygonCheck = false;
				}
			} else {
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
		$scope.areaSelectFrom = null;
		$scope.areaName = null;
		$scope.shownGeoJson = null;

		$scope.populateAreaVariableOptions = function (option) {

			$scope.showAreaVariableSelector = true;
			$scope.areaSelectFrom = option.value;
			if ($scope.areaSelectFrom === 'country') {
				$scope.areaVariableOptions = appSettings.countries;
			} else if ($scope.areaSelectFrom === 'province') {
				$scope.areaVariableOptions = appSettings.provinces;
			}
		};

		$scope.loadAreaFromFile = function (name) {

			removeShownGeoJson();
			clearDrawing();

			if (name) {
				$scope.areaName = name;

		        map.data.loadGeoJson(
		            '/static/data/' + $scope.areaSelectFrom + '/' + name + '.json'
		        );

		        map.data.setStyle({
		          fillColor: 'red',
		          strokeWeight: 2,
		          clickable: false
		        });

			} else {
				$scope.areaName = null;
				$scope.shownGeoJson = null;
			}
		};

		/**
		* Tab
		*/
		$('.tab-tool .btn-pref .btn').click (function () {
    		$('.tab-tool .btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
    		// $(".tab").addClass("active"); // instead of this do the below
    		$(this).removeClass('btn-default').addClass('btn-primary');
		});

		$('.tab-tool .btn-pref-inner .btn').click (function () {
    		$('.tab-tool .btn-pref-inner .btn').removeClass('btn-primary').addClass('btn-default');
    		$(this).removeClass('btn-default').addClass('btn-primary');
		});

		$('#sidebar-tab .btn-pref .btn').click (function () {
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

		var getDrawingManagerOptions = function (type) {
		    var typeOptions;

			if (type === 'rectangle') {
				typeOptions = 'rectangleOptions';
			} else if (type === 'circle') {
				typeOptions = 'circleOptions';
			} else if (type === 'polygon') {
				typeOptions = 'polygonOptions';
			}

		    var drawingManagerOptions = {
		    		'drawingControl': false
		    };
		    drawingManagerOptions.drawingMode = type;
		    drawingManagerOptions[typeOptions] = {
	    		'strokeColor': '#ff0000',
				'strokeWeight': 5,
				'fillColor': 'yellow',
				'fillOpacity': 0,
				'editable': true
		    };

			return drawingManagerOptions;

		};

		$scope.drawShape = function (type) {

			drawingManager.setOptions(getDrawingManagerOptions(type));
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
				$scope.shape.geom = getRectangleArray(overlay.getBounds());
				drawnArea = computeRectangleArea(overlay.getBounds());
				// Change event
				google.maps.event.addListener(overlay, 'bounds_changed', function () {
					$scope.shape.geom = getRectangleArray(event.overlay.getBounds());
					drawnArea = computeRectangleArea(event.overlay.getBounds());
				});
			} else if (drawingType === 'circle') {
				$scope.shape.center = [overlay.getCenter().lng().toFixed(2), overlay.getCenter().lat().toFixed(2)];
				$scope.shape.radius = overlay.getRadius().toFixed(2); // unit: meter
				drawnArea = Math.PI * Math.pow(overlay.getRadius()/1000, 2);
				// Change event
				google.maps.event.addListener(overlay, 'radius_changed', function () {
					$scope.shape.radius = event.overlay.getRadius().toFixed(2);
					drawnArea = Math.PI * Math.pow(event.overlay.getRadius()/1000, 2);
				});
				google.maps.event.addListener(overlay, 'center_changed', function () {
					$scope.shape.center = [event.overlay.getCenter().lng().toFixed(2), event.overlay.getCenter().lat().toFixed(2)];
					drawnArea = Math.PI * Math.pow(event.overlay.getRadius()/1000, 2);
				});
			} else if (drawingType === 'polygon') {
				var path = overlay.getPath();
				$scope.shape.geom = getPolygonArray(path.getArray());
				drawnArea = google.maps.geometry.spherical.computeArea(path) / 1e6;
				// Change event
				google.maps.event.addListener(path, 'insert_at', function () {
					$scope.shape.geom = getPolygonArray(event.overlay.getPath().getArray());
					drawnArea = google.maps.geometry.spherical.computeArea(event.overlay.getPath()) / 1e6;
				});
				google.maps.event.addListener(path, 'remove_at', function () {
					$scope.shape.geom = getPolygonArray(event.overlay.getPath().getArray());
					drawnArea = google.maps.geometry.spherical.computeArea(event.overlay.getPath()) / 1e6;
				});
				google.maps.event.addListener(path, 'set_at', function () {
					$scope.shape.geom = getPolygonArray(event.overlay.getPath().getArray());
					drawnArea = google.maps.geometry.spherical.computeArea(event.overlay.getPath()) / 1e6;
				});
			}

			stopDrawing();
			clearSelectedArea();
			removeShownGeoJson();
		});

		// Geojson listener
        map.data.addListener('addfeature', function (event) {
        	$scope.shownGeoJson = event.feature;
        	var bounds = new google.maps.LatLngBounds();
        	var _geometry = event.feature.getGeometry();
        	processPoints(_geometry, bounds.extend, bounds);
        	map.fitBounds(bounds);
        	drawnArea = google.maps.geometry.spherical.computeArea(_geometry.getArray()[0].b) / 1e6;
        });

        map.data.addListener('removefeature', function (event) {
        	$scope.shownGeoJson = null;
        });

		/**
		 * Upload Area Button
		 **/
		var readFile = function () {

			var files = event.target.files;
			if (files.length > 1) {
				showErrorAlert('upload one file at a time');
				$scope.$apply();
			} else {
				removeShownGeoJson();

				var file = files[0];
				var reader = new FileReader();
				reader.readAsText(file);

				reader.onload = function () {

					var textResult = event.target.result;
					var addedGeoJson;

					if ((['application/vnd.google-earth.kml+xml', 'application/vnd.google-earth.kmz'].indexOf(file.type) > -1) ) {

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

						var geometry = addedGeoJson.features ? addedGeoJson.features[0].geometry: addedGeoJson.geometry;

						if (geometry.type === 'Polygon') {

					        map.data.addGeoJson(addedGeoJson);
					        map.data.setStyle({
					        	fillColor: 'red',
					          	strokeWeight: 2,
					          	clickable: false
					        });

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

		$('#file-input-container #file-input').change( function () {
			$scope.showLoader = true;
			$scope.$apply();
			clearDrawing();
			readFile();
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

		function AnalysisToolControl(controlDiv, map) {

			// Set CSS for the control border.
			var controlUI = document.createElement('div');
			controlUI.setAttribute('class', 'tool-control text-center');
			controlUI.setAttribute('id', 'analysis-tool-control');
			controlUI.title = 'Toogle Tools Visibility';
			controlUI.innerHTML = "<span class='glyphicon glyphicon-eye-open large-icon' aria-hidden='true'></span>";
			controlDiv.appendChild(controlUI);

			// Setup the click event listeners
			controlUI.addEventListener('click', function() {
			  	$scope.toggleToolControl();
			});
		}

		var analysisToolControlDiv = document.getElementById('tool-control-container');
		var analysisToolControl = new AnalysisToolControl(analysisToolControlDiv, map);
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(analysisToolControlDiv);

		/*
		 * Opacity Sliders
		 */
		var sliderOptions = {
			formatter: function (value) {
				return 'Opacity: ' + value;
			}
		};

		/* Initialize values first */
		/*
		for (var i = $scope.landCoverClasses.length - 1; i >= 0; i--) {
			$scope[$scope.landCoverClasses[i].value + 'SliderValue'] = null;
		}

		var slideStartEvent = function (event) {
			$scope[event.target.id.split("-opacity-slider")[0] + 'SliderValue'] = $(this).data('slider').getValue();
		};

		var slideEndEvent = function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope[event.target.id.split("-opacity-slider")[0] + 'SliderValue']) {
		    	//$scope.overlays.treeCanopy.setOpacity(value);
		    	console.log('hello');
		    }
		};

		$timeout(function () {

			for (var i = $scope.landCoverClasses.length - 1; i >= 0; i--) {

				$scope[$scope.landCoverClasses[i].value + 'Slider'] = $('#' + $scope.landCoverClasses[i].value + '-opacity-slider').slider(sliderOptions)
				.on('slideStart', slideStartEvent)
				.on('slideStop', slideEndEvent);

				$('#' + $scope.landCoverClasses[i].value + '-opacity-slider .slider-selection').css('background', '#BABABA');
			}
		});*/

		// Update Assemblage Map
		$scope.updateAssemblageProduct = function () {

			$scope.closeAlert();
			$scope.assemblageLayers = [];
	        $('input[name="assemblage-checkbox"]').each( function () {
	            if($(this).prop('checked')){
	                $scope.assemblageLayers.push($(this).val());
	            }
	        });
			$scope.showLoader = true;
			clearLayer('landcovermap');
			$scope.initMap($scope.sliderYear, 'landcovermap');
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
				LandCoverService.getDownloadURL(type,
					$scope.shape,
					$scope.areaSelectFrom,
					$scope.areaName,
					$scope.sliderYear,
					$scope.assemblageLayers,
					$scope.primitiveIndex
				)
			    .then(function (data) {
					showSuccessAlert('Your Download Link is ready!');
			    	$scope[type + 'DownloadURL'] = data.downloadUrl;
			    	$scope['show' + type.capitalize() + 'DownloadURL'] = true;
			    }, function (error) {
			    	showErrorAlert(error.message);
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
				var fileName =  $sanitize($('#' + type + 'GDriveFileName').val() || '');
				showInfoAlert('Please wait while I prepare the download link for you. This might take a while!');
				LandCoverService.saveToDrive(type,
					$scope.shape,
					$scope.areaSelectFrom,
					$scope.areaName,
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
			    	showErrorAlert(error);
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
			LandCoverService.getPrimitiveMap(index, $scope.sliderYear,
											 $scope.shape, $scope.areaSelectFrom, $scope.areaName)
		    .then(function (data) {
		    	clearLayer('primitivemap');
		    	loadMap(data.eeMapId, data.eeMapToken, 'primitivemap');
	    		$timeout(function () {
					showInfoAlert('Showing ' + getPrimitiveLabel(index) + ' primitive layer for '+ $scope.sliderYear);
	    		}, 3500);
		    	//$scope.showLegend = true;
		    	$scope.showPrimitiveOpacitySlider = true;
		    	$scope.primitiveIndex = index;
		    }, function (error) {
		        console.log(error);
		        showErrorAlert(error.statusText);
		    });
		};
	});

})();
