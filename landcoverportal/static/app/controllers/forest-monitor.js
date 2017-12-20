(function () {

	'use strict';
	angular.module('landcoverportal')
	.controller('forestMonitorCtrl', function ($scope, appSettings) {

		// Earth Engine
		// Global Variables
		var EE_URL = 'https://earthengine.googleapis.com',
			DEFAULT_ZOOM = 6,
			MAX_ZOOM = 25,
			DEFAULT_CENTER = { lng: 102.93, lat: 16.4 },
			MAP_TYPE = 'satellite',
			AREA_LIMIT = 20000,
			// Map options
			mapOptions = {
				center: DEFAULT_CENTER,
				zoom: DEFAULT_ZOOM,
				maxZoom: MAX_ZOOM,
				streetViewControl: false,
				mapTypeId: MAP_TYPE,
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


		/**
		* Starts the Google Earth Engine application. The main entry point.
		*/
		$scope.initMap = function () {
			map = new google.maps.Map(document.getElementById('map'), mapOptions);
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

		$scope.drawPolygon = function () {

			drawingManager.setOptions(getDrawingManagerOptions('polygon'));
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
		});

		var datepickerYearOptions = {
			format: 'yyyy',
			autoclose: true,
			startDate: new Date('1984'),
			endDate: new Date('2015'),
			clearBtn: true,
			startView: 'years',
			minViewMode: 'years',
			container: '.datepicker-year-class'
		};
			
		var datepickerMonthOptions = {
			format: 'MM',
			autoclose: true,
			clearBtn: true,
			startView: 'months',
			minViewMode: 'months',
			maxViewMode: 'months',
			container: '.datepicker-month-class',
			templates: {
				leftArrow: ' ',
			    rightArrow: ' '
			}
		};

		$('#datepicker-year-start').datepicker(datepickerYearOptions);
		$('#datepicker-year-end').datepicker(datepickerYearOptions);
		$('.input-daterange input').each(function() {
		    $(this).datepicker('clearDates');
		});

		$('#datepicker-month-start').datepicker(datepickerMonthOptions);
		$('#datepicker-month-end').datepicker(datepickerMonthOptions);
		$('.input-monthrange input').each(function() {
		    $(this).datepicker('clearDates');
		});
	
	});

})();