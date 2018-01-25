(function () {
	
	'use strict';
	
	angular.module('landcoverportal')
	.service('ForestMonitorService', function ($http, $q) {

		this.treeCanopyChange = function (year, shape, areaSelectFrom, areaName) {

			var config = {
				params: {
					year: year,
					action: 'tree-canopy'
				}
			};

			if (areaSelectFrom && areaName) {
				config.params.areaSelectFrom = areaSelectFrom;
				config.params.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					config.params.shape = shapeType;
					config.params.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					config.params.shape = shapeType;
					config.params.radius = shape.radius;
					config.params.center = shape.center.toString();
				}
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.treeHeightChange = function (year, shape, areaSelectFrom, areaName) {

			var config = {
				params: {
					year: year,
					action: 'tree-height'
				}
			};

			if (areaSelectFrom && areaName) {
				config.params.areaSelectFrom = areaSelectFrom;
				config.params.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					config.params.shape = shapeType;
					config.params.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					config.params.shape = shapeType;
					config.params.radius = shape.radius;
					config.params.center = shape.center.toString();
				}
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestGain = function (startYear, endYear, shape, areaSelectFrom, areaName) {

			var config = {
				params: {
					startYear: startYear,
					endYear: endYear,
					action: 'forest-gain'
				}
			};

			if (areaSelectFrom && areaName) {
				config.params.areaSelectFrom = areaSelectFrom;
				config.params.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					config.params.shape = shapeType;
					config.params.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					config.params.shape = shapeType;
					config.params.radius = shape.radius;
					config.params.center = shape.center.toString();
				}
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestLoss = function (startYear, endYear, shape, areaSelectFrom, areaName) {

			var config = {
				params: {
					startYear: startYear,
					endYear: endYear,
					action: 'forest-loss'
				}
			};

			if (areaSelectFrom && areaName) {
				config.params.areaSelectFrom = areaSelectFrom;
				config.params.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					config.params.shape = shapeType;
					config.params.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					config.params.shape = shapeType;
					config.params.radius = shape.radius;
					config.params.center = shape.center.toString();
				}
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestChange = function (startYear, endYear, shape, areaSelectFrom, areaName) {

			var config = {
				params: {
					startYear: startYear,
					endYear: endYear,
					action: 'forest-change'
				}
			};

			if (areaSelectFrom && areaName) {
				config.params.areaSelectFrom = areaSelectFrom;
				config.params.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					config.params.shape = shapeType;
					config.params.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					config.params.shape = shapeType;
					config.params.radius = shape.radius;
					config.params.center = shape.center.toString();
				}
			}

			var promise = $http.get('/forest-monitor/api/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};
		
	});
	
})();