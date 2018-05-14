(function() {

    'use strict';

    angular.module('landcoverportal')
        .service('ForestMonitorService', function($http, $q) {

            this.treeCanopyChange = function(
                year,
                shape,
                areaSelectFrom,
                areaName,
                reportArea,
                treeCanopyDefinition
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        year: year,
                        treeCanopyDefinition: treeCanopyDefinition
                    },
                    params: {
                        action: 'tree-canopy',
                        'report-area': reportArea
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            };

            this.treeHeightChange = function(
                year,
                shape,
                areaSelectFrom,
                areaName,
                treeHeightDefinition
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        year: year,
                        treeHeightDefinition: treeHeightDefinition
                    },
                    params: {
                        action: 'tree-height'
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            };

            this.forestGain = function(startYear,
                endYear,
                shape,
                areaSelectFrom,
                areaName,
                treeCanopyDefinition,
                treeHeightDefinition,
                reportArea
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        startYear: startYear,
                        endYear: endYear,
                        treeCanopyDefinition: treeCanopyDefinition,
                        treeHeightDefinition: treeHeightDefinition
                    },
                    params: {
                        action: 'forest-gain',
                        'report-area': reportArea
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            };

            this.forestLoss = function(startYear,
                endYear,
                shape,
                areaSelectFrom,
                areaName,
                treeCanopyDefinition,
                treeHeightDefinition,
                reportArea
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        startYear: startYear,
                        endYear: endYear,
                        treeCanopyDefinition: treeCanopyDefinition,
                        treeHeightDefinition: treeHeightDefinition
                    },
                    params: {
                        action: 'forest-loss',
                        'report-area': reportArea
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            };

            this.forestChange = function(startYear,
                endYear,
                shape,
                areaSelectFrom,
                areaName,
                treeCanopyDefinition,
                treeHeightDefinition
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        startYear: startYear,
                        endYear: endYear,
                        treeCanopyDefinition: treeCanopyDefinition,
                        treeHeightDefinition: treeHeightDefinition
                    },
                    params: {
                        action: 'forest-change'
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            };

            this.forestExtend = function(
                year,
                shape,
                areaSelectFrom,
                areaName,
                treeCanopyDefinition,
                treeHeightDefinition,
                reportArea
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        year: year,
                        treeCanopyDefinition: treeCanopyDefinition,
                        treeHeightDefinition: treeHeightDefinition
                    },
                    params: {
                        action: 'forest-extend',
                        'report-area': reportArea
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            };

            this.getDownloadURL = function(type,
                shape,
                areaSelectFrom,
                areaName,
                startYear,
                endYear,
                treeCanopyDefinition,
                treeHeightDefinition
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        startYear: startYear,
                        endYear: endYear,
                        type: type,
                        treeCanopyDefinition: treeCanopyDefinition,
                        treeHeightDefinition: treeHeightDefinition
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            };

            this.saveToDrive = function(type,
                shape,
                areaSelectFrom,
                areaName,
                startYear,
                endYear,
                fileName,
                treeCanopyDefinition,
                treeHeightDefinition
            ) {

                var req = {
                    method: 'POST',
                    url: '/forest-monitor/api/',
                    data: {
                        startYear: startYear,
                        endYear: endYear,
                        type: type,
                        fileName: fileName,
                        treeCanopyDefinition: treeCanopyDefinition,
                        treeHeightDefinition: treeHeightDefinition
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
                    .then(function(response) {
                        return response.data;
                    });
                return promise;

            };

        });

})();