(function() {

    'use strict';

    angular.module('landcoverportal')
    .service('MapService', function () {

        var service = this;
        service.DEFAULT_ZOOM = 5;
        service.MAX_ZOOM = 25;
        service.DEFAULT_CENTER = {
            lng: 102.93, lat: 16.4
        };
        service.CENTER = [16.4, 102.93];

        service.getMapBoxLeafletLayer = function () {
            return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                {
                    attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, " +
                    "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, " +
                    "Imagery � <a href='http://mapbox.com'>Mapbox</a>", // jshint ignore:line
                    id: 'mapbox.light'
                }
            );
        };

        service.getEsriWorldTopoLeafletLayer = function () {
            return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, ' +
                    'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
                }
            );
        };

        service.getEsriWorldImageryLeafletLayer = function () {
            return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                {
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                }
            );
        };

        service.initLeafletMap = function (div, options) {
            var _default = {
                center: service.CENTER,
                zoom: service.DEFAULT_ZOOM,
                layers: [service.getMapBoxLeafletLayer()]
            };
            return L.map(div, $.extend(_default, options));
        };


        service.init = function (lng, lat, zoom) {

            var center;
            if (lat && lng) {
                center = {
                    lng: lng, lat: lat
                };
            } else {
                center = service.DEFAULT_CENTER;
            }

            // Global Variables
            var mapOptions = {
                    center: center,
                    zoom: zoom || service.DEFAULT_ZOOM,
                    maxZoom: service.MAX_ZOOM,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER
                    },
                    mapTypeId: 'terrain',
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    scaleControl: true,
                    streetViewControl: false,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
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

        service.getMapType = function (type, eeMapURL) {
            var eeMapOptions = {
              getTileUrl: function (tile, zoom) {
                    var url = eeMapURL.replace('{x}', tile.x)
                                      .replace('{y}', tile.y)
                                      .replace('{z}', zoom);
                    return url;
                },
              tileSize: new google.maps.Size(256, 256),
              name: type,
              opacity: 1.0
            };
            var mapType = new google.maps.ImageMapType(eeMapOptions);
            return mapType
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
