# -*- coding: utf-8 -*-

from landcoverportal import config

import ee
import time

# -----------------------------------------------------------------------------
class GEEApi():
    """ Google Earth Engine API """

    def __init__(self, year, shape, geom, radius, center):

        ee.Initialize(config.EE_CREDENTIALS)
        self.TREE_HEIGHT_IMG_COLLECTION = ee.ImageCollection(config.EE_FMS_TREE_HEIGHT_ID)
        self.TREE_CANOPY_IMG_COLLECTION = ee.ImageCollection(config.EE_FMS_TREE_CANOPY_ID)
        self.FEATURE_COLLECTION = ee.FeatureCollection(config.EE_MEKONG_FEATURE_COLLECTION_ID)
        self.COUNTRIES_GEOM = self.FEATURE_COLLECTION.filter(\
                    ee.Filter.inList('Country', config.COUNTRIES_NAME)).geometry()
        self.year = year
        self.geom = geom
        self.radius = radius
        self.center = center
        self.geometry = self._get_geometry(shape)

    # -------------------------------------------------------------------------
    def _get_geometry(self, shape):

        if shape:
            if shape == 'rectangle':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in self.geom]
                geometry = ee.Geometry.Rectangle(coor_list)
            elif shape == 'circle':
                _geom = self.center.split(',')
                coor_list = [float(_geom_) for _geom_ in self.geom]
                geometry = ee.Geometry.Point(coor_list).buffer(float(radius))
            elif shape == 'polygon':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                geometry = ee.Geometry.Polygon(coor_list)
        else:
            geometry = self.COUNTRIES_GEOM

        return geometry

    # -------------------------------------------------------------------------
    def tree_canopy_change(self):

        image = self.TREE_CANOPY_IMG_COLLECTION.filterMetadata(\
                                            'id',
                                            'equals',
                                            'tcc_' + str(self.year)).mosaic()

        map_id = image.getMapId({
            'min': '0',
            'max': '100'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def tree_height_change(self):

        image = self.TREE_HEIGHT_IMG_COLLECTION.filterMetadata(\
                                            'id',
                                            'equals',
                                            'tch_' + str(self.year)).mosaic()

        map_id = image.getMapId({
            'min': '0',
            'max': '30'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }
