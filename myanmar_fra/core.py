# -*- coding: utf-8 -*-

from django.conf import settings
from utils.utils import get_unique_string, transfer_files_to_user_drive

import ee, json, os, time

# -----------------------------------------------------------------------------
class MyanmarFRA():
    '''
        Google Earth Engine API
    '''

    ee.Initialize(settings.EE_CREDENTIALS)
    # @ToDo: use the product from new run    
    # land-use map
    LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/Assemblage/RegionalLC')

    # primitives
    PRIMITIVE_BARREN = ee.ImageCollection('projects/servir-mekong/Primitives/P_barren')
    PRIMITIVE_BIULTUP = ee.ImageCollection('projects/servir-mekong/Primitives/P_builtup')
    PRIMITIVE_CANOPY = ee.ImageCollection('projects/servir-mekong/Primitives/P_canopy')
    PRIMITIVE_CROPLAND = ee.ImageCollection('projects/servir-mekong/Primitives/P_cropland')
    PRIMITIVE_DECIDUOUS = ee.ImageCollection('projects/servir-mekong/Primitives/P_deciduous')
    PRIMITIVE_EPHEMERAL_WATER = ee.ImageCollection('projects/servir-mekong/Primitives/P_ephemeral_water')
    PRIMITIVE_EVERGREEN = ee.ImageCollection('projects/servir-mekong/Primitives/P_evergreen')
    PRIMITIVE_FOREST_COVER = ee.ImageCollection('projects/servir-mekong/Primitives/P_forest_cover')
    PRIMITIVE_GRASS = ee.ImageCollection('projects/servir-mekong/Primitives/P_grass')
    PRIMITIVE_MANGROVE = ee.ImageCollection('projects/servir-mekong/Primitives/P_mangrove')
    PRIMITIVE_MIXED_FOREST = ee.ImageCollection('projects/servir-mekong/Primitives/P_mixed_forest')
    PRIMITIVE_RICE = ee.ImageCollection('projects/servir-mekong/Primitives/P_rice')
    PRIMITIVE_SHRUB = ee.ImageCollection('projects/servir-mekong/Primitives/P_shrub')
    PRIMITIVE_SNOW_ICE = ee.ImageCollection('projects/servir-mekong/Primitives/P_snow_ice').select('max_snow')
    PRIMITIVE_SURFACE_WATER = ee.ImageCollection('projects/servir-mekong/Primitives/P_surface_water')
    PRIMITIVE_TREE_HEIGHT = ee.ImageCollection('projects/servir-mekong/Primitives/P_tree_height')
    PRIMITIVES = [
        PRIMITIVE_BARREN, PRIMITIVE_BIULTUP, PRIMITIVE_CANOPY, PRIMITIVE_CROPLAND,
        PRIMITIVE_DECIDUOUS, PRIMITIVE_EPHEMERAL_WATER, PRIMITIVE_EVERGREEN,
        PRIMITIVE_FOREST_COVER, PRIMITIVE_GRASS, PRIMITIVE_MANGROVE, PRIMITIVE_MIXED_FOREST,
        PRIMITIVE_RICE, PRIMITIVE_SHRUB, PRIMITIVE_SNOW_ICE, PRIMITIVE_SURFACE_WATER, PRIMITIVE_TREE_HEIGHT
    ]

    # geometries
    MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
    DEFAULT_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('Country', ['Myanmar (Burma)'])).geometry()

    # -------------------------------------------------------------------------
    def __init__(self, province, shape, geom, radius, center):

        self.geom = geom
        self.radius = radius
        self.center = center
        if province:
            try:
                if settings.DEBUG:
                    path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                        'landcoverportal/static/data/province/',
                                        '%s.%s' % (province, 'json'))
                else:
                    path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                        'static/data/province/',
                                        '%s.%s' % (province, 'json'))
    
                with open(path) as f:
                    feature = ee.Feature(json.load(f))
                    self.geometry = feature.geometry()
            except OSError as e:
                self.geometry = MyanmarFRA.DEFAULT_GEOM
        elif shape:
            self.geometry = self._get_geometry_from_shape(shape)
        else:
            self.geometry = MyanmarFRA.DEFAULT_GEOM

    # -------------------------------------------------------------------------
    def _get_geometry_from_shape(self, shape):

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
        else:
            return MyanmarFRA.DEFAULT_GEOM

    # -------------------------------------------------------------------------
    def get_landcover(self, primitives=range(0, 21), year=2016, download=False):

        image = ee.Image(MyanmarFRA.LANDCOVERMAP.filterDate('%s-01-01' % year,
                                                            '%s-12-31' % year).mean())

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the primitives
        for primitive in primitives:
            _mask = image.eq(ee.Number(int(primitive)))
            masked_image = masked_image.add(_mask)

        palette = '6f6f6f,aec3d4,b1f9ff,111149,287463,152106,c3aa69,9ad2a5,7db087,486f50,387242,115420,cc0013,8dc33b,ffff00,a1843b,cec2a5,674c06,3bc3b2,f4a460,800080'

        image = image.updateMask(masked_image).clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': '20',
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_primitive(self, index=0, year=2016, download=False):

        primitive_img_coll = MyanmarFRA.PRIMITIVES[index]

        image = ee.Image(primitive_img_coll.filterDate('%s-01-01' % year,
                                                       '%s-12-31' % year).mean())

        # mask
        masked_image = image.gt(0.1)

        image = image.updateMask(masked_image).clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': '100',
            'palette': 'FFFFFF, 000000'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_download_url(self,
                         type = 'landcover',
                         year = 2016,
                         primitives = range(0, 21),
                         index = 0,
                         ):

        if type == 'landcover':
            image = self.get_landcover(primitives = primitives,
                                       year = year,
                                       download = True,
                                       )
        elif type == 'primitive':
            image = self.get_primitive(index = index,
                                       year = year,
                                       download = True,
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
                          type = 'landcover',
                          year = 2016,
                          primitives = range(0, 21),
                          index = 0,
                          file_name = '',
                          user_email = None,
                          user_id = None,
                          oauth2object = None,
                          ):

        if not (user_email and user_id and oauth2object):
            return {'error': 'something wrong with the google drive api!'}

        if type == 'landcover':
            image = self.get_landcover(primitives = primitives,
                                       year = year,
                                       download = True,
                                       )
        elif type == 'primitive':
            image = self.get_primitive(index = index,
                                       year = year,
                                       download = True,
                                       )

        temp_file_name = get_unique_string()

        if not file_name:
            file_name = temp_file_name + '.tif'
        else:
            file_name = file_name + '.tif'

        try:
            task = ee.batch.Export.image.toDrive(
                image = image,
                description = 'Export from SERVIR Mekong Team',
                fileNamePrefix = temp_file_name,
                scale = 30,
                region = self.geometry.getInfo()['coordinates'],
                skipEmptyTiles = True,
                maxPixels = 1E13
            )
        except Exception as e:
            return {'error': e.message}

        task.start()

        i = 1
        while task.active():
            print ('past %d seconds' % (i * settings.EE_TASK_POLL_FREQUENCY))
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
