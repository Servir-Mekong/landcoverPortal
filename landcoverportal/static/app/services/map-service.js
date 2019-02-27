(function() {

    'use strict';

    angular.module('landcoverportal')
    .service('MapService', function () {

        var service = this;

        service.init = function (lng, lat, zoom) {

            // Global Variables
            var DEFAULT_ZOOM = zoom || 5,
                MAX_ZOOM = 25,
                DEFAULT_CENTER = {
                    lng: lng || 102.93,
                    lat: lat || 16.4
                },
                // Map options
                mapOptions = {
                    center: DEFAULT_CENTER,
                    zoom: DEFAULT_ZOOM,
                    maxZoom: MAX_ZOOM,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER
                    },
                    mapTypeId: 'terrain',
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
                    }
                };

            // Map variable
            return new google.maps.Map(document.getElementById('map'), mapOptions);

        };

        /**
         * GeoJson
         **/

        service.loadGeoJson = function (map, dir, name) {
            if (name) {
                map.data.loadGeoJson(
                    '/static/data/' + dir + '/' + name + '.json'
                );
    
                map.data.setStyle({
                    //fillColor: 'red',
                    //strokeWeight: 2,
                    visible: true,
                    fillOpacity: 0,
                    strokeColor: 'black',
                    clickable: false
                });
            }
        };

        service.addGeoJson = function (map, geojson) {
            map.data.addGeoJson(geojson);

            map.data.setStyle({
                //fillColor: 'red',
                //strokeWeight: 2,
                visible: true,
                fillOpacity: 0,
                strokeColor: 'black',
                clickable: false
            });
        };

        service.removeGeoJson = function (map) {
            map.data.forEach(function (feature) {
                map.data.remove(feature);
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
        service.processPoints = function (geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function (g) {
                    service.processPoints(g, callback, thisArg);
                });
            }
        };

        service.clearLayer = function (map, name) {
            map.overlayMapTypes.forEach(function (layer, index) {
                if (layer && layer.name === name) {
                    map.overlayMapTypes.removeAt(index);
                }
            });
        };

        // Remove the Drawing Manager Polygon
        service.clearDrawing = function (overlay) {
            if (overlay) {
                overlay.setMap(null);
            }
        };
    
        service.getMapType = function (mapId, mapToken, type) {
            var eeMapOptions = {
                getTileUrl: function (tile, zoom) {
                    var url = 'https://earthengine.googleapis.com/map/';
                    url += [mapId, zoom, tile.x, tile.y].join('/');
                    url += '?token=' + mapToken;
                    return url;
                },
                tileSize: new google.maps.Size(256, 256),
                opacity: 1.0,
                name: type
            };
            return new google.maps.ImageMapType(eeMapOptions);
        };

        service.getPolygonBoundArray = function (array) {
            var geom = [];
            for (var i = 0; i < array.length; i++) {
                var coordinatePair = [array[i].lng().toFixed(2), array[i].lat().toFixed(2)];
                geom.push(coordinatePair);
            }
            return geom;
        };

        service.computePolygonArea = function (path) {
            return google.maps.geometry.spherical.computeArea(path) / 1e6;
        };

        service.getRectangleBoundArray = function (bounds) {
            var start = bounds.getNorthEast();
            var end = bounds.getSouthWest();
            return [Number(start.lng().toFixed(2)), Number(start.lat().toFixed(2)), Number(end.lng().toFixed(2)), Number(end.lat().toFixed(2))];
        };

        service.computeRectangleArea = function (bounds) {
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

        service.getCircleCenter = function (overlay) {
            return [overlay.getCenter().lng().toFixed(2), overlay.getCenter().lat().toFixed(2)];
        };

        service.getCircleRadius = function (overlay) {
            return overlay.getRadius().toFixed(2);
        };

        service.computeCircleArea = function (overlay) {
            return Math.PI * Math.pow(overlay.getRadius() / 1000, 2);
        };

        service.getDrawingManagerOptions = function(type) {
            if (!type) {
                return {};
            }

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

    });

})();
