# -*- coding: utf-8 -*-

from django.conf import settings
from utils import get_unique_string, transfer_files_to_user_drive

import ee, json, os, time

# -----------------------------------------------------------------------------
class GEEApi():
    """
        Google Earth Engine API
    """

    ee.Initialize(settings.EE_CREDENTIALS)
    TREE_HEIGHT_IMG_COLLECTION = ee.ImageCollection(settings.EE_FMS_TREE_HEIGHT_ID)
    TREE_CANOPY_IMG_COLLECTION = ee.ImageCollection(settings.EE_FMS_TREE_CANOPY_ID)
    FEATURE_COLLECTION = ee.FeatureCollection(settings.EE_MEKONG_FEATURE_COLLECTION_ID)
    COUNTRIES_GEOM = FEATURE_COLLECTION.filter(ee.Filter.inList('Country',
                                               settings.COUNTRIES_NAME)).geometry()

    def __init__(self, area_path, area_name, shape, geom, radius, center):

        self.geom = geom
        self.radius = radius
        self.center = center
        if (area_path and area_name):
            if (area_path == 'country'):
                if (area_name == 'Myanmar'):
                    area_name = 'Myanmar (Burma)'
                self.geometry = GEEApi.FEATURE_COLLECTION.filter(\
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
                self.geometry = GEEApi.COUNTRIES_GEOM
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

        return GEEApi.COUNTRIES_GEOM

    # -------------------------------------------------------------------------
    def tree_canopy(self,
                     img_coll = None,
                     get_image = False,
                     for_download = False,
                     year = None,
                     report_area = False,
                     ):

        if not year:
            return {
                'message': 'Please specify a year for which you want to perform the calculations!'
            }

        if not img_coll:
            img_coll = GEEApi.TREE_CANOPY_IMG_COLLECTION

        image = img_coll.filterMetadata('system:index',
                                        'equals',
                                        'P_canopy_%s' % year).mosaic()

        if get_image:
            if for_download:
                return image.updateMask(image).clip(self.geometry)
            else:
                return image.clip(self.geometry)

        image = image.updateMask(image).clip(self.geometry)

        map_id = image.getMapId({
            'min': '0',
            'max': '100',
            'palette': '000000, 00FF00'
        })

        data = {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

        if report_area:
            # @ToDo: Better estimate of crs using the geometry
            reducer = image.gt(0).reduceRegion(reducer = ee.Reducer.sum(),
                                               geometry = self.geometry,
                                               crs = 'EPSG:32647', # WGS Zone N 47
                                               scale = 100,
                                               maxPixels = 10**15
                                               )
            # converting to meter square by multiplying with scale value i.e. 100*100
            # and then converting to hectare multiplying with 0.0001
            #area = reducer.getInfo()['tcc'] * 100 * 100 * 0.0001 # in hectare
            # meaning we can use the value directly as the hectare
            try:
                data['reportArea'] = '{:,}'.format(float('%.2f' % reducer.getInfo()['tcc']))
            except Exception as e:
                data['reportError'] = e.message

        return data

    # -------------------------------------------------------------------------
    def tree_height(self,
                    img_coll = None,
                    get_image = False,
                    for_download = False,
                    year = None,
                    ):

        if not year:
            return {
                'message': 'Please specify a year for which you want to perform the calculations!'
            }

        if not img_coll:
            img_coll = GEEApi.TREE_HEIGHT_IMG_COLLECTION

        image = img_coll.filterMetadata('system:index',
                                        'equals',
                                        'P_tree_height_%s' % year).mosaic()

        if get_image:
            if for_download:
                return image.updateMask(image).clip(self.geometry)
            else:
                return image.clip(self.geometry)

        image = image.updateMask(image).clip(self.geometry)

        map_id = image.getMapId({
            'min': '0',
            'max': '30'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    @staticmethod
    def _get_combined_img_coll():

        years = ee.List.sequence(2000, 2016)
        date_ymd = ee.Date.fromYMD

        def addBands(year):
            tcc = GEEApi.TREE_CANOPY_IMG_COLLECTION.filterDate(\
                                                date_ymd(year, 1, 1),
                                                date_ymd(year, 12, 31)).first()
            tch = GEEApi.TREE_HEIGHT_IMG_COLLECTION.filterDate(\
                                                date_ymd(year, 1, 1),
                                                date_ymd(year, 12, 31)).first()
            return ee.Image(tcc).addBands(tch)

        return ee.ImageCollection.fromImages(years.map(addBands))

    # -------------------------------------------------------------------------
    @staticmethod
    def _filter_for_forest_definition(img_coll, define_tree_canopy, define_tree_height):

        return img_coll.map(lambda img: img.select('tcc').gt(define_tree_canopy).\
                            And(img.select('tch').gt(define_tree_height)).
                            rename(['forest_cover']))

    # -------------------------------------------------------------------------
    def forest_gain(self,
                     get_image = False,
                     start_year = None,
                     end_year = None,
                     define_tree_canopy = 10,
                     define_tree_height = 5,
                     report_area = False,
                     ):

        if not start_year and end_year:
            return {
                'message': 'Please specify a start and end year for which you want to perform the calculations!'
            }

        combined_img_coll = GEEApi._get_combined_img_coll()

        filtered_img_coll = GEEApi._filter_for_forest_definition(combined_img_coll,
                                                                 define_tree_canopy,
                                                                 define_tree_height)

        start_image = self.tree_canopy(img_coll = filtered_img_coll,
                                       get_image = True,
                                       year = start_year,
                                       )

        end_image = self.tree_canopy(img_coll = filtered_img_coll,
                                     get_image = True,
                                     year = end_year,
                                     )

        gain_image = end_image.subtract(start_image).gt(0)
        gain_image = gain_image.updateMask(gain_image).select('forest_cover').clip(self.geometry)

        if get_image:
            return gain_image

        map_id = gain_image.getMapId({
            'palette': 'blue'
        })

        data = {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

        if report_area:
            # @ToDo: Better estimate of crs using the geometry
            reducer = gain_image.reduceRegion(reducer = ee.Reducer.sum(),
                                              geometry = self.geometry,
                                              crs = 'EPSG:32647', # WGS Zone N 47
                                              scale = 100,
                                              maxPixels = 10**15
                                              )
            # converting to meter square by multiplying with scale value i.e. 100*100
            # and then converting to hectare multiplying with 0.0001
            #area = reducer.getInfo()['tcc'] * 100 * 100 * 0.0001 # in hectare
            # meaning we can use the value directly as the hectare
            try:
                data['reportArea'] = '{:,}'.format(float('%.2f' % reducer.getInfo()['forest_cover']))
            except Exception as e:
                data['reportError'] = e.message

        return data

    # -------------------------------------------------------------------------
    def forest_loss(self,
                     get_image = False,
                     start_year = None,
                     end_year = None,
                     define_tree_canopy = 10,
                     define_tree_height = 5,
                     report_area = False,
                     ):

        if not start_year and end_year:
            return {
                'message': 'Please specify a start and end year for which you want to perform the calculations!'
            }

        combined_img_coll = GEEApi._get_combined_img_coll()

        filtered_img_coll = GEEApi._filter_for_forest_definition(combined_img_coll,
                                                                 define_tree_canopy,
                                                                 define_tree_height)

        start_image = self.tree_canopy(img_coll = filtered_img_coll,
                                       get_image = True,
                                       year = start_year,
                                       )

        end_image = self.tree_canopy(img_coll = filtered_img_coll,
                                     get_image = True,
                                     year = end_year,
                                     )

        loss_image = end_image.subtract(start_image).lt(0)
        loss_image = loss_image.updateMask(loss_image).select('forest_cover').clip(self.geometry)

        if get_image:
            return loss_image

        map_id = loss_image.getMapId({
            'palette': 'red'
        })

        data = {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

        if report_area:
            # @ToDo: Better estimate of crs using the geometry
            reducer = loss_image.reduceRegion(reducer = ee.Reducer.sum(),
                                              geometry = self.geometry,
                                              crs = 'EPSG:32647', # WGS Zone N 47
                                              scale = 100,
                                              maxPixels = 10**15
                                              )
            # converting to meter square by multiplying with scale value i.e. 100*100
            # and then converting to hectare multiplying with 0.0001
            #area = reducer.getInfo()['tcc'] * 100 * 100 * 0.0001 # in hectare
            # meaning we can use the value directly as the hectare
            try:
                data['reportArea'] = '{:,}'.format(float('%.2f' % reducer.getInfo()['forest_cover']))
            except Exception as e:
                data['reportError'] = e.message

        return data

    # -------------------------------------------------------------------------
    def forest_change(self,
                        get_image = False,
                        start_year = None,
                        end_year = None,
                        define_tree_canopy = 10,
                        define_tree_height = 5,
                        ):

        if not start_year and end_year:
            return {
                'message': 'Please specify a start and end year for which you want to perform the calculations!'
            }

        combined_img_coll = GEEApi._get_combined_img_coll()

        filtered_img_coll = GEEApi._filter_for_forest_definition(combined_img_coll,
                                                                 define_tree_canopy,
                                                                 define_tree_height)

        start_image = self.tree_canopy(img_coll = filtered_img_coll,
                                       get_image = True,
                                       year = start_year,
                                       )

        end_image = self.tree_canopy(img_coll = filtered_img_coll,
                                     get_image = True,
                                     year = end_year,
                                     )

        change_image = end_image.subtract(start_image)
        change_image = change_image.updateMask(change_image).select('forest_cover').clip(self.geometry)

        if get_image:
            return change_image

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

    # -------------------------------------------------------------------------
    def get_download_url(self,
                           type,
                           start_year,
                           end_year,
                           define_tree_canopy,
                           define_tree_height
                           ):

        if (type == 'treeCanopy'):
            image = self.tree_canopy(get_image = True,
                                     for_download = True,
                                     year = start_year)
        elif (type == 'treeHeight'):
            image = self.tree_height(get_image = True,
                                     for_download = True,
                                     year = start_year)
        elif (type == 'forestGain'):
            image = self.forest_gain(get_image = True,
                                     start_year = start_year,
                                     end_year = end_year,
                                     define_tree_canopy = define_tree_canopy,
                                     define_tree_height = define_tree_canopy,
                                     )
        elif (type == 'forestLoss'):
            image = self.forest_loss(get_image = True,
                                     start_year = start_year,
                                     end_year = end_year,
                                     define_tree_canopy = define_tree_canopy,
                                     define_tree_height = define_tree_canopy,
                                     )
        elif (type == 'forestChange'):
            image = self.forest_change(get_image = True,
                                       start_year = start_year,
                                       end_year = end_year,
                                       define_tree_canopy = define_tree_canopy,
                                       define_tree_height = define_tree_canopy,
                                       )

        try:
            url = image.getDownloadURL({
                'name': type,
                'scale': 30
            })
            return {'downloadUrl': url}
        except Exception as e:
            return {'error': e.message}

    # -------------------------------------------------------------------------
    def download_to_drive(self,
                            type,
                            start_year,
                            end_year,
                            user_email,
                            user_id,
                            file_name,
                            define_tree_canopy,
                            define_tree_height,
                            oauth2object
                            ):

        if (type == 'treeCanopy'):
            image = self.tree_canopy(get_image = True,
                                     for_download = True,
                                     year = start_year)
        elif (type == 'treeHeight'):
            image = self.tree_height(get_image = True,
                                     for_download = True,
                                     year = start_year)
        elif (type == 'forestGain'):
            image = self.forest_gain(get_image = True,
                                     start_year = start_year,
                                     end_year = end_year,
                                     define_tree_canopy = define_tree_canopy,
                                     define_tree_height = define_tree_canopy,
                                     )
        elif (type == 'forestLoss'):
            image = self.forest_loss(get_image = True,
                                     start_year = start_year,
                                     end_year = end_year,
                                     define_tree_canopy = define_tree_canopy,
                                     define_tree_height = define_tree_canopy,
                                     )
        elif (type == 'forestChange'):
            image = self.forest_change(get_image=True,
                                       start_year=start_year,
                                       end_year=end_year,
                                       define_tree_canopy = define_tree_canopy,
                                       define_tree_height = define_tree_canopy,
                                       )

        temp_file_name = get_unique_string()

        if not file_name:
            file_name = temp_file_name + ".tif"
        else:
            file_name = file_name + ".tif"

        task = ee.batch.Export.image.toDrive(
            image = image,
            description = 'Export from SERVIR Mekong Team',
            fileNamePrefix = temp_file_name,
            scale = 30,
            region = self.geometry.getInfo()['coordinates'],
            skipEmptyTiles = True
        )
        task.start()

        i = 1
        while task.active():
            print ("past %d seconds" % (i * settings.EE_TASK_POLL_FREQUENCY))
            i += 1
            time.sleep(settings.EE_TASK_POLL_FREQUENCY)
        
        # Make a copy (or copies) in the user's Drive if the task succeeded
        state = task.status()['state']
        if state == ee.batch.Task.State.COMPLETED:
            try:
                link = transfer_files_to_user_drive(temp_file_name,
                                                    user_email,
                                                    user_id,
                                                    file_name,
                                                    oauth2object)
                return {'driveLink': link}
            except Exception as e:
                print (str(e))
                return {'error': str(e)}
        else:
            print ('Task failed (id: %s) because %s.' % (task.id, task.status()['error_message']))
            return {'error': 'Task failed (id: %s) because %s.' % (task.id, task.status()['error_message'])}
