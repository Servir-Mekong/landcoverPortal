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
   
    # land-use map
    LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/assemblage')

    # primitives
    PRIMITIVE_CLOSED_FOREST = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/closedForest')
    PRIMTIVE_CROPLAND = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/cropland')
    PRIMITIVE_GRASS = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/grass')
    PRIMITIVE_MANGROVES = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/mangroves')
    PRIMITIVE_OPEN_FOREST = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/openForest')
    # PRIMITIVE_OTHER_LAND
    PRIMITIVE_SETTLEMENTS = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/urban')
    PRIMITIVE_SNOW = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/snow')
    PRIMITIVE_WATER = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/water')
    PRIMITIVE_WETLAND = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/wetlands')
    PRIMTTIVE_WOODY = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/woody')
    PRIMITIVES = [
        PRIMITIVE_WATER, PRIMITIVE_SNOW, PRIMITIVE_MANGROVES, PRIMTIVE_CROPLAND,
        PRIMITIVE_SETTLEMENTS, PRIMITIVE_GRASS, PRIMITIVE_CLOSED_FOREST,
        PRIMITIVE_OPEN_FOREST, PRIMITIVE_WETLAND, PRIMTTIVE_WOODY
    ]

    # geometries
    MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
    DEFAULT_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('Country', ['Myanmar (Burma)'])).geometry()

    # Class and Index
    INDEX_CLASS = {
        0: 'Other Land',
        1: 'Water',
        2: 'Snow',
        3: 'Mangrove',
        5: 'Crop Land',
        6: 'Settlements',
        7: 'Grass Land',
        8: 'Closed Forest',
        9: 'Open Forest',
        10: 'Wet Land',
        11: 'Other Wooden Land'
    }

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
    def get_landcover(self, primitives=range(0, 12), year=2017, download=False):

        image = ee.Image(MyanmarFRA.LANDCOVERMAP.filterDate('%s-01-01' % year,
                                                            '%s-12-31' % year).mean())

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the primitives
        for primitive in primitives:
            _mask = image.eq(ee.Number(int(primitive)))
            masked_image = masked_image.add(_mask)

        #palette = '6f6f6f,1B58E8,b1f9ff,111149,8dc33b,8dc33b,cc0013,f4a460,26802C,25E733,3bc3b2,654321'
        palette = '6f6f6f,0000ff,808080,556b2f,ffff00,7cfc00,8b0000,20b2aa,006400,90ee90,42f4c2,8b4513'

        image = image.updateMask(masked_image)#.clip(self.geometry).buffer(10000)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': '11',
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_primitive(self, index=0, year=2017, download=False):

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
            'palette': 'FFFFFF, 999999, 666666, 333333, 000000'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_download_url(self,
                         type = 'landcover',
                         year = 2017,
                         primitives = range(0, 12),
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
                          year = 2017,
                          primitives = range(0, 12),
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

    # -------------------------------------------------------------------------
    def get_stats(self, year=2017, primitives=range(0, 12)):

        image = self.get_landcover(primitives = primitives,
                                   year = year,
                                   download = True,
                                   )

        stats = image.reduceRegion(reducer = ee.Reducer.frequencyHistogram(),
                                   geometry = self.geometry,
                                   crs = 'EPSG:32647', # WGS Zone N 47
                                   scale = 100,
                                   maxPixels = 1E13
                                   )
        data = stats.getInfo()['classification']
        # converting to meter square by multiplying with scale value i.e. 100*100
        # and then converting to hectare multiplying with 0.0001
        # area = reducer.getInfo()['tcc'] * 100 * 100 * 0.0001 # in hectare
        # meaning we can use the value directly as the hectare
        return {MyanmarFRA.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}
