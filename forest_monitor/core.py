# -*- coding: utf-8 -*-

from landcoverportal import config

import ee
import time

# -----------------------------------------------------------------------------
class GEEApi():
    """ Google Earth Engine API """

    def __init__(self, shape, geom, radius, center):

        ee.Initialize(config.EE_CREDENTIALS)
        self.TREE_HEIGHT_IMG_COLLECTION = ee.ImageCollection(config.EE_FMS_TREE_HEIGHT_ID)
        self.TREE_CANOPY_IMG_COLLECTION = ee.ImageCollection(config.EE_FMS_TREE_CANOPY_ID)
        self.FEATURE_COLLECTION = ee.FeatureCollection(config.EE_MEKONG_FEATURE_COLLECTION_ID)
        self.COUNTRIES_GEOM = self.FEATURE_COLLECTION.filter(\
                    ee.Filter.inList('Country', config.COUNTRIES_NAME)).geometry()
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
    def tree_canopy(self, get_image=False, year=None):

        if not year:
            return {
                'message': 'Please specify a year for which you want to perform the calculations!'
            }

        image = self.TREE_CANOPY_IMG_COLLECTION.filterMetadata(\
                                                    'id',
                                                    'equals',
                                                    'tcc_' + str(year)).mean()
        image = image.updateMask(image)

        if get_image:
            return image

        map_id = image.updateMask(image).getMapId({
            'min': '0',
            'max': '100',
            'palette': '000000, 00FF00'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def tree_height(self, year=None):

        if not year:
            return {
                'message': 'Please specify a year for which you want to perform the calculations!'
            }

        image = self.TREE_HEIGHT_IMG_COLLECTION.filterMetadata(\
                                                    'id',
                                                    'equals',
                                                    'tch_' + str(year)).mean()

        map_id = image.updateMask(image).getMapId({
            'min': '0',
            'max': '30'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def forest_gain(self, start_year, end_year):

        start_image = self.tree_canopy(get_image=True, year=start_year)
        end_image = self.tree_canopy(get_image=True, year=end_year)

        gain_image = end_image.subtract(start_image).gt(0)
        gain_image = gain_image.updateMask(gain_image)

        map_id = gain_image.getMapId({
            'palette': '0000FF'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def forest_loss(self, start_year, end_year):

        start_image = self.tree_canopy(get_image=True, year=start_year)
        end_image = self.tree_canopy(get_image=True, year=end_year)

        loss_image = end_image.subtract(start_image).lt(0)
        loss_image = loss_image.updateMask(loss_image)

        map_id = loss_image.getMapId({
            'palette': 'FF0000'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def forest_change(self, start_year, end_year):

        start_image = self.tree_canopy(get_image=True, year=start_year)
        end_image = self.tree_canopy(get_image=True, year=end_year)

        change_image = end_image.subtract(start_image)
        change_image = change_image.updateMask(change_image)

        diff = int(end_year) - int(start_year)
        if (diff <= 5):
            min = '-5'
            max = '5'
        elif (5 < diff <= 10):
            min = '-10'
            max = '10'
        else:
            min = '-50'
            max = '50'

        map_id = change_image.getMapId({
            'min': min,
            'max': max,
            'palette': 'FF0000, FFFF00, 00FF00'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }
