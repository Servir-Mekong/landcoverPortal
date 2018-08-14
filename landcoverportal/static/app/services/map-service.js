(function() {

    'use strict';

    angular.module('landcoverportal')
    .service('MapService', function () {

        this.init = function () {

            // Global Variables
            var DEFAULT_ZOOM = 5,
                MAX_ZOOM = 25,
                DEFAULT_CENTER = {
                    lng: 102.93,
                    lat: 16.4
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
         * Utilities function
         **/

        this.removeGeoJson = function (map) {
            map.data.forEach(function (feature) {
                map.data.remove(feature);
            });
        };

        this.clearLayer = function (map, name) {
            map.overlayMapTypes.forEach(function (layer, index) {
                if (layer && layer.name === name) {
                    map.overlayMapTypes.removeAt(index);
                }
            });
        };
    
        this.getMapType = function (mapId, mapToken, type) {
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

        this.getPolygonBoundArray = function (array) {
            var geom = [];
            for (var i = 0; i < array.length; i++) {
                var coordinatePair = [array[i].lng().toFixed(2), array[i].lat().toFixed(2)];
                geom.push(coordinatePair);
            }
            return geom;
        };

        this.computePolygonArea = function (path) {
            return google.maps.geometry.spherical.computeArea(path) / 1e6;
        };

        this.getRectangleBoundArray = function (bounds) {
            var start = bounds.getNorthEast();
            var end = bounds.getSouthWest();
            return [start.lng().toFixed(2), start.lat().toFixed(2), end.lng().toFixed(2), end.lat().toFixed(2)];
        };

        this.computeRectangleArea = function (bounds) {
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

        this.getCircleCenter = function (overlay) {
            return [overlay.getCenter().lng().toFixed(2), overlay.getCenter().lat().toFixed(2)];
        };

        this.getCircleRadius = function (overlay) {
            return overlay.getRadius().toFixed(2);
        };

        this.computeCircleArea = function (overlay) {
            return Math.PI * Math.pow(overlay.getRadius() / 1000, 2);
        };

        this.getDrawingManagerOptions = function(type) {
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