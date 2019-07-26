(function () {

    'use strict';

    angular.module('landcoverportal')
    .service('LandCoverService', function ($http, $q) {

        var service = this;

        service.getLandCoverMap = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var version = options.version;
            var type = options.type;

            //if (typeof(type) === 'undefined') type = 'landcover';
            var url = '/api/landcover/';
            if (type === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (type === 'myanmar-ipcc') {
                url = '/api/myanmar-ipcc/';
            } else if (type === 'myanmar-national') {
                url = '/api/myanmar-national/';
            } else if (type === 'plantation') {
                url = '/api/plantation/';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year,
                    primitives: primitives.toString()
                },
                params: {
                    action: 'landcovermap'
                }
            };

            if (version === 'v1') {
                req.params.version = 'v1';
            } else if (version === 'v2') {
                req.params.version = 'v2';
            }

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e.data;
            });
            return promise;
        };

        service.getPrimitiveMap = function (options) {

            var index = options.index;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var version = options.version;
            var type = options.type;

            var url = '/api/landcover/';
            if (type === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (type === 'myanmar-ipcc') {
                url = '/api/myanmar-ipcc/';
            } else if (type === 'myanmar-national') {
                url = '/api/myanmar-national/';
            } else if (type === 'plantation') {
                url = '/api/plantation/';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year,
                    index: index
                },
                params: {
                    action: 'primitive'
                }
            };

            if (version === 'v1') {
                req.params.version = 'v1';
            } else if (version === 'v2') {
                req.params.version = 'v2';
            }

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        service.getProbabilityMap = function (options) {

            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            //var v1 = options.v1;
            var type = options.type;

            var url = '/api/landcover/';
            if (type === 'plantation') {
                url = '/api/plantation/';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year
                },
                params: {
                    action: 'probability'
                }
            };

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        service.getCompositeMap = function (options) {

            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            //var v1 = options.v1;
            var type = options.type;
            var url = '/api/landcover/';
            if (type === 'plantation') {
                url = '/api/plantation/';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year
                },
                params: {
                    action: 'get-composite'
                }
            };

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        service.getStats = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var version = options.version;
            var type = options.type;

            var url = '/api/landcover/';
            if (type === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (type === 'myanmar-ipcc') {
                url = '/api/myanmar-ipcc/';
            } else if (type === 'myanmar-national') {
                url = '/api/myanmar-national/';
            } else if (type === 'plantation') {
                url = '/api/plantation/';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year,
                    primitives: primitives.toString()
                },
                params: {
                    action: 'get-stats'
                }
            };

            if (version === 'v1') {
                req.params.version = 'v1';
            } else if (version === 'v2') {
                req.params.version = 'v2';
            }

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        //service.getDownloadURL = function (type, shape, areaSelectFrom, areaName, year, primitives, index, serviceType) {
        service.getDownloadURL = function (options) {
            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var version = options.version;
            var type = options.type;
            var index = options.index;
            var serviceType = options.serviceType;

            var url = '/api/landcover/';
            if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (serviceType === 'myanmar-ipcc') {
                url = '/api/myanmar-ipcc/';
            } else if (serviceType === 'myanmar-national') {
                url = '/api/myanmar-national/';
            } else if (serviceType === 'plantation') {
                url = '/api/plantation/';
            }

            var req = {
                method: 'POST',
                url: url,
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

            if (version === 'v1') {
                req.params.version = 'v1';
            } else if (version === 'v2') {
                req.params.version = 'v2';
            }

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        //service.saveToDrive = function (type, shape, areaSelectFrom, areaName, year, primitives, fileName, index, serviceType) {
        service.saveToDrive = function (options) {
            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var version = options.version;
            var type = options.type;
            var index = options.index;
            var serviceType = options.serviceType;
            var fileName = options.fileName;

            var url = '/api/landcover/';
            if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (serviceType === 'myanmar-ipcc') {
                url = '/api/myanmar-ipcc/';
            } else if (serviceType === 'myanmar-national') {
                url = '/api/myanmar-national/';
            } else if (serviceType === 'plantation') {
                url = '/api/plantation/';
            }

            var req = {
                method: 'POST',
                url: url,
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

            if (version === 'v1') {
                req.params.version = 'v1';
            } else if (version === 'v2') {
                req.params.version = 'v2';
            }

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;

        };

        service.getColumnStatData = function (options, years) {
            var promises = [];
            years.forEach(function (year) {
                options.year = year;
                promises.push(service.getStats(options));
            });
            var promise = $q.all(promises)
            .then(function (results) {
                return results;
                /*results.forEach(function(data, status, headers, config) {
                    return data;
                });*/
            });
            return promise;
        };

    });

})();
