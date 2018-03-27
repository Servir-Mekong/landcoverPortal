# -*- coding: utf-8 -*-

from django.conf import settings
from utils.utils import get_unique_string, transfer_files_to_user_drive

import ee, json, os, time

# -----------------------------------------------------------------------------
class LandCoverViewer():
    """
        Google Earth Engine API
    """

    ee.Initialize(settings.EE_CREDENTIALS)
    # @ToDo: use the product from new run    
    # land-use map
    LANDCOVERMAP = ee.ImageCollection("projects/servir-mekong/Assemblage/RegionalLC")

    # primitives
    PRIMITIVE_BARREN = ee.ImageCollection("projects/servir-mekong/Primitives/P_barren")
    PRIMITIVE_BIULTUP = ee.ImageCollection("projects/servir-mekong/Primitives/P_builtup")
    PRIMITIVE_CANOPY = ee.ImageCollection("projects/servir-mekong/Primitives/P_canopy")
    PRIMITIVE_CROPLAND = ee.ImageCollection("projects/servir-mekong/Primitives/P_cropland")
    PRIMITIVE_DECIDUOUS = ee.ImageCollection("projects/servir-mekong/Primitives/P_deciduous")
    PRIMITIVE_EPHEMERAL_WATER = ee.ImageCollection("projects/servir-mekong/Primitives/P_ephemeral_water")
    PRIMITIVE_EVERGREEN = ee.ImageCollection("projects/servir-mekong/Primitives/P_evergreen")
    PRIMITIVE_FOREST_COVER = ee.ImageCollection("projects/servir-mekong/Primitives/P_forest_cover")
    PRIMITIVE_GRASS = ee.ImageCollection("projects/servir-mekong/Primitives/P_grass")
    PRIMITIVE_MANGROVE = ee.ImageCollection("projects/servir-mekong/Primitives/P_mangrove")
    PRIMITIVE_MIXED_FOREST = ee.ImageCollection("projects/servir-mekong/Primitives/P_mixed_forest")
    PRIMITIVE_RICE = ee.ImageCollection("projects/servir-mekong/Primitives/P_rice")
    PRIMITIVE_SHRUB = ee.ImageCollection("projects/servir-mekong/Primitives/P_shrub")
    PRIMITIVE_SNOW_ICE = ee.ImageCollection("projects/servir-mekong/Primitives/P_snow_ice").select('max_snow')
    PRIMITIVE_SURFACE_WATER = ee.ImageCollection("projects/servir-mekong/Primitives/P_surface_water")
    PRIMITIVE_TREE_HEIGHT = ee.ImageCollection("projects/servir-mekong/Primitives/P_tree_height")
    PRIMITIVES = [PRIMITIVE_BARREN, PRIMITIVE_BIULTUP, PRIMITIVE_CANOPY, PRIMITIVE_CROPLAND,
                  PRIMITIVE_DECIDUOUS, PRIMITIVE_EPHEMERAL_WATER, PRIMITIVE_EVERGREEN,
                  PRIMITIVE_FOREST_COVER, PRIMITIVE_GRASS, PRIMITIVE_MANGROVE, PRIMITIVE_MIXED_FOREST,
                  PRIMITIVE_RICE, PRIMITIVE_SHRUB, PRIMITIVE_SNOW_ICE, PRIMITIVE_SURFACE_WATER, PRIMITIVE_TREE_HEIGHT]

    MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
    COUNTRIES_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('Country',
                                               settings.COUNTRIES_NAME)).geometry()

    def __init__(self, area_path, area_name, shape, geom, radius, center):

        self.geom = geom
        self.radius = radius
        self.center = center
        if (area_path and area_name):
            if (area_path == 'country'):
                if (area_name == 'Myanmar'):
                    area_name = 'Myanmar (Burma)'
                self.geometry = LandCoverViewer.FEATURE_COLLECTION.filter(\
                                    ee.Filter.inList('Country', [area_name])).geometry()
            elif (area_path == 'province'):
                if settings.DEBUG:
                    path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                        'landcoverportal/static/data/',
                                        area_path,
                                        '%s.%s' % (area_name, 'json'))
                else:
                    path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                        'static/data/',
                                        area_path,
                                        '%s.%s' % (area_name, 'json'))

                with open(path) as f:
                    feature = ee.Feature(json.load(f))
                    self.geometry = feature.geometry()
            else:
                self.geometry = LandCoverViewer.COUNTRIES_GEOM
        else:
            self.geometry = self._get_geometry(shape)

    # -------------------------------------------------------------------------
    def _get_geometry(self, shape):

        if shape:
            if shape == 'rectangle':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                return ee.Geometry.Rectangle(coor_list)
            elif shape == 'circle':
                _geom = self.center.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                return ee.Geometry.Point(coor_list).buffer(float(self.radius))
            elif shape == 'polygon':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                if len(coor_list) > 500:
                    return ee.Geometry.Polygon(coor_list).convexHull()
                return ee.Geometry.Polygon(coor_list)

        return LandCoverViewer.COUNTRIES_GEOM

    # -------------------------------------------------------------------------
    def landcover(self, primitives = [], year = None):

        if not year:
            return {
                'message': 'Please specify a year for which you want to perform the calculations!'
            }

        if not primitives:
            primitives = range(0, 21)
        year = '2015'
        image = ee.Image(LandCoverViewer.LANDCOVERMAP.filterDate(\
                                                    "%s-01-01" % year,
                                                    "%s-12-31" % year).mean())

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the primitives
        for primitive in primitives:
            _mask = image.eq(ee.Number(int(primitive)))
            masked_image = masked_image.add(_mask)

        palette = '6f6f6f,aec3d4,b1f9ff,111149,287463,152106,c3aa69,9ad2a5,7db087,486f50,387242,115420,cc0013,8dc33b,ffff00,a1843b,cec2a5,674c06,3bc3b2,f4a460,800080'

        image = image.updateMask(masked_image).clip(self.geometry)

        map_id = image.getMapId({
            'min': '0',
            'max': '20',
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }
