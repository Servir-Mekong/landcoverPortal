(function () {
	
	'use strict';
	
	angular.module('landcoverportal')
	.service('ForestMonitorService', function ($http, $q) {

		this.treeCanopyChange = function (year, shape) {

			var config = {
				params: {
					year: year,
					action: 'tree-canopy'
				}
			};

			var shapeType = shape.type;
			if (shapeType === 'rectangle' || shapeType === 'polygon') {
				config.params.shape = shapeType;
				config.params.geom = shape.geom.toString();
			} else if (shapeType === 'circle') {
				config.params.shape = shapeType;
				config.params.radius = shape.radius;
				config.params.center = shape.center.toString();
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.treeHeightChange = function (year, shape) {

			var config = {
				params: {
					year: year,
					action: 'tree-height'
				}
			};

			var shapeType = shape.type;
			if (shapeType === 'rectangle' || shapeType === 'polygon') {
				config.params.shape = shapeType;
				config.params.geom = shape.geom.toString();
			} else if (shapeType === 'circle') {
				config.params.shape = shapeType;
				config.params.radius = shape.radius;
				config.params.center = shape.center.toString();
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestGain = function (startYear, endYear, shape) {

			var config = {
				params: {
					startYear: startYear,
					endYear: endYear,
					action: 'forest-gain'
				}
			};

			var shapeType = shape.type;
			if (shapeType === 'rectangle' || shapeType === 'polygon') {
				config.params.shape = shapeType;
				config.params.geom = shape.geom.toString();
			} else if (shapeType === 'circle') {
				config.params.shape = shapeType;
				config.params.radius = shape.radius;
				config.params.center = shape.center.toString();
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestLoss = function (startYear, endYear, shape) {

			var config = {
				params: {
					startYear: startYear,
					endYear: endYear,
					action: 'forest-loss'
				}
			};

			var shapeType = shape.type;
			if (shapeType === 'rectangle' || shapeType === 'polygon') {
				config.params.shape = shapeType;
				config.params.geom = shape.geom.toString();
			} else if (shapeType === 'circle') {
				config.params.shape = shapeType;
				config.params.radius = shape.radius;
				config.params.center = shape.center.toString();
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};
		
	});
	
})();