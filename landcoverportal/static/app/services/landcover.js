(function () {
	
	'use strict';
	
	angular.module('landcoverportal')
	.service('LandCoverService', function ($http, $q) {

		this.getLandCoverMap = function (primitives, year, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/landcover/api/',
				data: {
					year: year,
					primitives: primitives.toString()
				},
				params: {
					action: 'landcovermap'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.getPrimitiveMap = function (index, year, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/landcover/api/',
				data: {
					year: year,
					index: index
				},
				params: {
					action: 'primitive'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.getDownloadURL = function (type, shape, areaSelectFrom, areaName, year, primitives, index) {

			var req = {
				method: 'POST',
				url: '/landcover/api/',
				data: {
					year: year,
					type: type,
					primitives: primitives.toString(),
					index: index
				},
				params: {
					action: 'get-download-url'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.saveToDrive = function (type, shape, areaSelectFrom, areaName, year, primitives, fileName, index) {

			var req = {
				method: 'POST',
				url: '/landcover/api/',
				data: {
					year: year,
					type: type,
					primitives: primitives.toString(),
					fileName: fileName,
					index: index
				},
				params: {
					action: 'download-to-drive'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;

		};

	});
	
})();
