(function () {
	
	'use strict';
	
	angular.module('landcoverportal')
	.service('LandCoverService', function ($http, $q) {

		this.getLandCoverMap = function (listOfPrimitives, year, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/landcover/api/',
				data: {
					year: year,
					primitives: listOfPrimitives.toString()
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
		
	});
	
})();
