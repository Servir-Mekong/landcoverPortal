(function () {

    'use strict';

    angular.module('landcoverportal')
    .service('ForestMonitorService', function ($http, $sessionStorage) {

        this.treeCanopyChange = function (options) {

            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    year: year,
                    treeCanopyDefinition: treeCanopyDefinition
                },
                params: {
                    action: 'tree-canopy'
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
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e.data;
            });
            return promise;
        };

        this.treeHeightChange = function (options) {

            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeHeightDefinition = options.treeCanopyDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
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
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.primaryForestChange = function (options) {

            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    year: year,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'primary-forest'
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
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e.data;
            });
            return promise;
        };

        this.forestGain = function (options) {

            var startYear = options.startYear;
            var endYear = options.endYear;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    startYear: startYear,
                    endYear: endYear,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'forest-gain'
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.forestLoss = function (options) {

            var startYear = options.startYear;
            var endYear = options.endYear;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    startYear: startYear,
                    endYear: endYear,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'forest-loss'
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.forestChange = function (
            startYear,
            endYear,
            shape,
            areaSelectFrom,
            areaName,
            treeCanopyDefinition,
            treeHeightDefinition
        ) {

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
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
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.forestExtend = function (options) {

            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    year: year,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'forest-extend'
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.getDownloadURL = function (options) {

            var type = options.type;
            var startYear = options.startYear;
            var endYear = options.endYear;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    startYear: startYear,
                    endYear: endYear,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'get-download-url',
                    type: type
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.saveToDrive = function (options) {

            var type = options.type;
            var startYear = options.startYear;
            var endYear = options.endYear;
            var fileName = options.fileName;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    startYear: startYear,
                    endYear: endYear,
                    fileName: fileName,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'download-to-drive',
                    type: type
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
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e.data;
            });
            return promise;

        };

        this.getStats = function (options) {

            var year = options.year;
            var startYear = options.startYear;
            var endYear = options.endYear;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;
            var type = options.type; // can be treeCanopy, forestGain, forestLoss or forestExtend

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    year: year,
                    startYear: startYear,
                    endYear: endYear,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'get-stats',
                    type: type
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
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e.data;
            });
            return promise;
        };

        this.getStatsDashboard = function (options) {

            var year = options.year;
            var startYear = options.startYear;
            var endYear = options.endYear;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var treeCanopyDefinition = options.treeCanopyDefinition;
            var treeHeightDefinition = options.treeHeightDefinition;
            var type = options.type; // can be treeCanopy, forestGain, forestLoss or forestExtend

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/',
                data: {
                    year: year,
                    startYear: startYear,
                    endYear: endYear,
                    treeCanopyDefinition: treeCanopyDefinition,
                    treeHeightDefinition: treeHeightDefinition
                },
                params: {
                    action: 'get-stats-dashboard',
                    type: type
                }
            };

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



        this.getUserDownloadInfo = function () {
            if ($sessionStorage.fmsUserDownloadInfo) {
                return $sessionStorage.fmsUserDownloadInfo;
            }
            return null;
        };

        this.setUserDownloadInfo = function (data) {
            $sessionStorage.fmsUserDownloadInfo = {};
            var fmsUserDownloadInfo = {
                name: data.name,
                email: data.email,
                organization: data.organization,
                purpose: data.purpose
            };
            $sessionStorage.fmsUserDownloadInfo = fmsUserDownloadInfo;
        };

        this.postUserDownloadInfo = function (options) {

            var req = {
                method: 'POST',
                url: '/api/forest-monitor/download-info/',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: options.name,
                    organization: options.organization,
                    email: options.email,
                    usage: options.usage,
                    type: options.type
                }
            };
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
    });

})();
