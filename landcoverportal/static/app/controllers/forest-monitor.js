(function () {

	'use strict';
	angular.module('landcoverportal')
	.filter('treeCanopyHeightYearRange', function () {
		return function(input, min, max) {
			min = parseInt(min);
			max = parseInt(max);
			for (var i = min; i <= max; i++) {
				input.push(i);
			}
			return input;
		};
	})
	.controller('forestMonitorCtrl', function ($scope, appSettings, ForestMonitorService) {

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
				streetViewControl: false,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		            position: google.maps.ControlPosition.TOP_CENTER
		        },
			},
			// Map variable
			map = new google.maps.Map(document.getElementById('map'), mapOptions);

		// $scope variables
		$scope.alertClass = 'custom-alert';
		$scope.overlays = {};
		$scope.shape = {};
		$scope.toolControlClass = 'glyphicon glyphicon-eye-open';
		$scope.showTabContainer = true;
		$scope.showLoader = false;

		$('.js-tooltip').tooltip();

		/**
		* Tab
		*/
		$('.btn-pref .btn').click (function () {
    		$('.btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
    		// $(".tab").addClass("active"); // instead of this do the below 
    		$(this).removeClass('btn-default').addClass('btn-primary');  
		});

		$('.btn-pref-inner .btn').click (function () {
    		$('.btn-pref-inner .btn').removeClass('btn-primary').addClass('btn-default');
    		// $(".tab").addClass("active"); // instead of this do the below 
    		$(this).removeClass('btn-default').addClass('btn-primary');  
		});

		/**
		* Tools
		**/
		$scope.toggleToolControl = function () {
			if ($scope.toolControlClass === 'glyphicon glyphicon-eye-open') {
				$scope.toolControlClass = 'glyphicon glyphicon-eye-close';
				$scope.showTabContainer = false;
			} else {
				$scope.toolControlClass = 'glyphicon glyphicon-eye-open';
				$scope.showTabContainer = true;
			}
		};

		/** Updates the image based on the current control panel config. */
		var loadMap = function (mapId, mapToken, type) {

			if (typeof(type) === 'undefined') type = 'map';

			var eeMapOptions = {
				getTileUrl: function (tile, zoom) {
					var url = EE_URL + '/map/';
						url += [mapId, zoom, tile.x, tile.y].join('/');
						url += '?token=' + mapToken;
						return url;
				},
				tileSize: new google.maps.Size(256, 256),
				opacity: 1.0
			};
			var mapType = new google.maps.ImageMapType(eeMapOptions);
			map.overlayMapTypes.push(mapType);
			$scope.overlays[type] = mapType;
		};

		var drawingManager = new google.maps.drawing.DrawingManager();

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
				'fillOpacity': 0
		    };
			
			return drawingManagerOptions;
				
		};

		$scope.drawShape = function (type) {

			drawingManager.setOptions(getDrawingManagerOptions(type));
			// Loading the drawing Tool in the Map.
			drawingManager.setMap(map);
			
		};

		$scope.stopDrawing = function () {

			drawingManager.setDrawingMode(null);
			
		};

		$scope.clearDrawing = function () {

			if ($scope.overlays.polygon) {
				$scope.overlays.polygon.setMap(null);
				$scope.showPolygonDrawing = false;				
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

		// Overlay Listener
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
			// Clear Layer First
			$scope.clearDrawing();
			var overlay = event.overlay;
			$scope.overlays.polygon = overlay;
			$scope.$apply();
			$scope.shape = {};

			var drawingType = event.type;
			$scope.shape.type = drawingType;
			if (drawingType === 'rectangle') {
				$scope.shape.geom = getRectangleArray(overlay.getBounds());
			} else if (drawingType === 'circle') {
				$scope.shape.center = [overlay.getCenter().lng().toFixed(2), overlay.getCenter().lat().toFixed(2)];
				$scope.shape.radius = overlay.getRadius().toFixed(2); // unit: meter
			} else if (drawingType === 'polygon') {
				$scope.shape.geom = getPolygonArray(overlay.getPath().getArray());
			}

			$scope.stopDrawing();
		});

		var datepickerOptions = {
			autoclose: true,
			clearBtn: true,
			container: '.datepicker'
		};

		$('#time-period-tab>#datepicker').datepicker(datepickerOptions);

		/* Tree Canopy */
		$scope.showTreeCanopyOpacitySlider = false;
		$scope.treeCanopyOpacitySliderValue = null;

		/* slider init */
		$('#tree-canopy-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.treeCanopyOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.treeCanopyOpacitySliderValue) {
		    	$scope.overlays.treeCanopy.setOpacity(value);
		    }
		});

		$scope.treeCanopyYearChange = function(year) {

			ForestMonitorService.treeCanopyChange(year, $scope.shape)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, 'treeCanopy');
		    	$scope.showTreeCanopyOpacitySlider = true;
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Tree height */
		$scope.showTreeHeightOpacitySlider = false;
		$scope.treeHeightOpacitySliderValue = null;

		/* slider init */
		$('#tree-height-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.treeHeightOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.treeHeightOpacitySliderValue) {
		    	$scope.overlays.treeHeight.setOpacity(value);
		    }
		});

		$scope.treeHeightYearChange = function(year) {

			ForestMonitorService.treeHeightChange(year, $scope.shape)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, 'treeHeight');
		    	$scope.showTreeHeightOpacitySlider = true;
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Forest Gain */
		$scope.showForestGainOpacitySlider = false;
		$scope.forestGainOpacitySliderValue = null;

		/* slider init */
		$('#forest-gain-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.forestGainOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.forestGainOpacitySliderValue) {
		    	$scope.overlays.forestGain.setOpacity(value);
		    }
		});

		$scope.calculateForestGain = function (startYear, endYear) {

			ForestMonitorService.forestGain(startYear, endYear, $scope.shape)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, 'forestGain');
		    	$scope.showForestGainOpacitySlider = true;
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Forest Loss */
		$scope.showForestLossOpacitySlider = false;
		$scope.forestLossOpacitySliderValue = null;

		/* slider init */
		$('#forest-loss-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.forestLossOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.forestLossOpacitySliderValue) {
		    	$scope.overlays.forestLoss.setOpacity(value);
		    }
		});

		$scope.calculateForestLoss = function (startYear, endYear) {

			ForestMonitorService.forestLoss(startYear, endYear, $scope.shape)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, 'forestLoss');
		    	$scope.showForestLossOpacitySlider = true;
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Forest Change */
		$scope.showForestChangeOpacitySlider = false;
		$scope.forestChangeOpacitySliderValue = null;

		/* slider init */
		$('#forest-change-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.forestChangeOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.forestChangeOpacitySliderValue) {
		    	$scope.overlays.forestChange.setOpacity(value);
		    }
		});

		$scope.calculateForestChange = function (startYear, endYear) {

			ForestMonitorService.forestChange(startYear, endYear, $scope.shape)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, 'forestChange');
		    	$scope.showForestChangeOpacitySlider = true;
		    }, function (error) {
		        console.log(error);
		    });
		};
	
	});

})();