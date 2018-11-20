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
    #LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/MyanmarFRA/assemblage')
    LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/FinalMyanmarLandCover')

    # primitives
    PRIMITIVE_CLOSED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives/closedForest')
    PRIMTIVE_CROPLAND = ee.ImageCollection('projects/servir-mekong/yearly_primitives/cropland')
    PRIMITIVE_GRASS = ee.ImageCollection('projects/servir-mekong/yearly_primitives/grass')
    PRIMITIVE_MANGROVES = ee.ImageCollection('projects/servir-mekong/yearly_primitives/mangrove')
    PRIMITIVE_OPEN_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives/openForest')
    PRIMITIVE_SNOW = ee.ImageCollection('projects/servir-mekong/yearly_primitives/snow')
    PRIMITIVE_URBAN = ee.ImageCollection('projects/servir-mekong/yearly_primitives/urban')
    PRIMITIVE_WATER = ee.ImageCollection('projects/servir-mekong/yearly_primitives/water')
    PRIMITIVE_WETLAND = ee.ImageCollection('projects/servir-mekong/yearly_primitives/wetlands')
    PRIMTTIVE_WOODY = ee.ImageCollection('projects/servir-mekong/yearly_primitives/woody')

    PRIMITIVES = [
        PRIMITIVE_WATER, PRIMITIVE_SNOW, PRIMITIVE_MANGROVES, PRIMTIVE_CROPLAND,
        PRIMITIVE_URBAN, PRIMITIVE_GRASS, PRIMITIVE_CLOSED_FOREST,
        PRIMITIVE_OPEN_FOREST, PRIMITIVE_WETLAND, PRIMTTIVE_WOODY
    ]

    # geometries
    MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
    DEFAULT_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('Country', ['Myanmar (Burma)'])).geometry()

    # Class and Index
    LANDCOVERCLASSES = [
        {
            'name': 'Unknown',
            'value': '0',
            'color': '6f6f6f'
        },
        {
            'name': 'Surface Water',
            'value': '1',
            'color': '0000ff'
        },
        {
            'name': 'Snow and Ice',
            'value': '2',
            'color': '808080'
        },
        {
            'name': 'Mangroves',
            'value': '3',
            'color': '556b2f'
        },
        {
            'name': 'Crop Land',
            'value': '4',
            'color': '8dc33b'
        },
        {
            'name': 'Urban and Built up',
            'value': '5',
            'color': 'ff0000'#'8b0000'
        },
        {
            'name': 'Grass Land',
            'value': '6',
            'color': '20b2aa'
        },
        {
            'name': 'Closed Forest',
            'value': '7',
            'color': '006400'
        },
        {
            'name': 'Open Forest',
            'value': '8',
            'color': '7db087'
        },
        {
            'name': 'Wet Land',
            'value': '9',
            'color': '42f4c2'
        },
        {
            'name': 'Woody',
            'value': '10',
            'color': '8b4513'
        }
    ]

    INDEX_CLASS = {}
    for _class in LANDCOVERCLASSES:
        INDEX_CLASS[int(_class['value'])] = _class['name']

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
                    province_json = json.load(f)
                    type = province_json['type']
                    if type == 'FeatureCollection':
                        feature = ee.FeatureCollection(province_json['features'])
                    else:
                        feature = ee.Feature(province_json)
                    self.geometry = feature.geometry()
            except OSError as e:
                self.geometry = MyanmarFRA.DEFAULT_GEOM.buffer(10000)
        elif shape:
            self.geometry = self._get_geometry_from_shape(shape)
        else:
            self.geometry = MyanmarFRA.DEFAULT_GEOM.buffer(10000)

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

        return MyanmarFRA.DEFAULT_GEOM.buffer(10000)

    # -------------------------------------------------------------------------
    def get_landcover(self, primitives=range(0, 12), year=2017, download=False):

        image = ee.Image(MyanmarFRA.LANDCOVERMAP.filterDate('%s-01-01' % year,
                                                            '%s-12-31' % year).mean())
        image = image.select('lc')

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the primitives
        for primitive in primitives:
            _mask = image.eq(ee.Number(int(primitive)))
            masked_image = masked_image.add(_mask)

        #palette = '6f6f6f,1B58E8,b1f9ff,111149,8dc33b,8dc33b,cc0013,f4a460,26802C,25E733,3bc3b2,654321'
        palette = []
        for _class in MyanmarFRA.LANDCOVERCLASSES:
            palette.append(_class['color'])

        palette = ','.join(palette)

        image = image.updateMask(masked_image).unmask(0).clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': '10',
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

        data = stats.getInfo()['lc']
        # converting to meter square by multiplying with scale value i.e. 100*100
        # and then converting to hectare multiplying with 0.0001
        # area = reducer.getInfo()['tcc'] * 100 * 100 * 0.0001 # in hectare
        # meaning we can use the value directly as the hectare
        return {MyanmarFRA.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}
