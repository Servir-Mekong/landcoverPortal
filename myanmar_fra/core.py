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
    #LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/FinalMyanmarLandCover')
    LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/LandCoverMyanmar')

    # primitives
    PRIMITIVE_CLOSED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/closedForest')
    PRIMITIVE_CROPLAND = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/cropland')
    PRIMITIVE_GRASS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/grass')
    PRIMITIVE_MANGROVE = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/mangrove')
    PRIMITIVE_OPEN_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/openForest')
    PRIMITIVE_SNOW = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/snow')
    PRIMITIVE_URBAN = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/urban')
    PRIMITIVE_WATER = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/water')
    PRIMITIVE_WETLANDS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/wetlands')
    PRIMITIVE_WOODY = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/woody')
    PRIMITIVES = [
        PRIMITIVE_CLOSED_FOREST, PRIMITIVE_CROPLAND, PRIMITIVE_GRASS,
        PRIMITIVE_MANGROVE, PRIMITIVE_OPEN_FOREST, PRIMITIVE_SNOW, PRIMITIVE_URBAN,
        PRIMITIVE_WATER, PRIMITIVE_WETLANDS, PRIMITIVE_WOODY
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
            'name': 'Cropland',
            'value': '4',
            'color': '7cfc00'
        },
        {
            'name': 'Urban and Built up',
            'value': '5',
            'color': '8b0000'
        },
        {
            'name': 'Grassland',
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
            'color': '90ee90'
        },
        {
            'name': 'Wetland',
            'value': '9',
            'color': '42f4c2'
        },
        {
            'name': 'Woody',
            'value': '10',
            'color': '8b4513'
        },
        {
            'name': 'Other land',
            'value': '11',
            'color': '6f6f6f'
        }
    ]

    REMAPPED_CLASSES = [
        {
            'name': 'Water Bodies',
            'value': '0',
            'color': '0000ff'
        },
        {
            'name': 'Forest',
            'value': '1',
            'color': '006400'
        },
        {
            'name': 'Wooden Land',
            'value': '2',
            'color': '8b4513'
        },
        {
            'name': 'Other land',
            'value': '3',
            'color': '6f6f6f'
        }
    ]

    INDEX_CLASS = {}
    for _class in REMAPPED_CLASSES:
        INDEX_CLASS[int(_class['value'])] = _class['name']

    ORIGINAL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    REMAPPED = [3, 0, 3, 1, 3, 3, 2, 1, 1, 3,  2,  3]

    # -------------------------------------------------------------------------
    def __init__(self, area_path, area_name, shape, geom, radius, center):

        self.geom = geom
        self.radius = radius
        self.center = center
        if (area_path and area_name):
            if (area_path == 'country'):
                if (area_name == 'Myanmar'):
                    area_name = 'Myanmar (Burma)'
                self.geometry = MyanmarFRA.MEKONG_FEATURE_COLLECTION.filter(\
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
                    province_json = json.load(f)
                    type = province_json['type']
                    if type == 'FeatureCollection':
                        feature = ee.FeatureCollection(province_json['features'])
                    else:
                        feature = ee.Feature(province_json)
                    self.geometry = feature.geometry()
            else:
                self.geometry = MyanmarFRA.DEFAULT_GEOM.buffer(10000)
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

        return MyanmarFRA.DEFAULT_GEOM.buffer(10000)

    # -------------------------------------------------------------------------
    def get_landcover(self, classes=range(0, 11), year=2017, download=False):

        image = ee.Image(MyanmarFRA.LANDCOVERMAP.filterDate('%s-01-01' % year,
                                                            '%s-12-31' % year).mean())
        image = image.select('classification')

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the classes
        for _class in classes:
            _mask = image.eq(ee.Number(int(_class)))
            masked_image = masked_image.add(_mask)

        palette = []
        for _class in MyanmarFRA.REMAPPED_CLASSES:
            palette.append(_class['color'])

        palette = ','.join(palette)

        image = image.updateMask(masked_image)
        image = image.remap(MyanmarFRA.ORIGINAL, MyanmarFRA.REMAPPED).clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': str(len(MyanmarFRA.REMAPPED_CLASSES) - 1),
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_primitive(self, index=0, year=2017, download=False):

        primitive_img_coll = MyanmarFRA.PRIMITIVES[index]

        image_collection = primitive_img_coll.filterDate('%s-01-01' % year,
                                                         '%s-12-31' % year)
        if image_collection.size().getInfo() > 0:
            image = ee.Image(image_collection.mean())
        else:
            return {
                'error': 'No data available for year {}'.format(year)
            }

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
                         classes = range(0, 12),
                         index = 0,
                         ):

        if type == 'landcover':
            image = self.get_landcover(classes=classes, year=year, download=True)
        elif type == 'primitive':
            image = self.get_primitive(index = index,
                                       year = year,
                                       download = True,
                                       )

        _scale = 30
        while True:
            try:
                url = image.getDownloadURL({
                    'name': type,
                    'scale': _scale
                })
                return {'downloadUrl': url}
            except Exception as e:
                _scale += 10
                continue
            break

    # -------------------------------------------------------------------------
    def download_to_drive(self,
                          type = 'landcover',
                          year = 2017,
                          classes = range(0, 12),
                          index = 0,
                          file_name = '',
                          user_email = None,
                          user_id = None,
                          oauth2object = None,
                          ):

        if not (user_email and user_id and oauth2object):
            return {'error': 'something wrong with the google drive api!'}

        if type == 'landcover':
            image = self.get_landcover(classes=classes, year=year, download=True)
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
                region = self.geometry.bounds().getInfo()['coordinates'],
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
            print ('Task failed (id: %s) because %s' % (task.id, task.status()['error_message']))
            return {'error': 'Task failed (id: %s) because %s' % (task.id, task.status()['error_message'])}

    # -------------------------------------------------------------------------
    def get_stats(self, year=2017, classes=range(0, 12)):

        image = self.get_landcover(classes=classes, year=year, download=True)

        stats = image.reduceRegion(reducer = ee.Reducer.frequencyHistogram(),
                                   geometry = self.geometry,
                                   crs = 'EPSG:32647', # WGS Zone N 47
                                   scale = 100,
                                   maxPixels = 1E13
                                   )
        data = stats.getInfo()['remapped']
        # converting to meter square by multiplying with scale value i.e. 100*100
        # and then converting to hectare multiplying with 0.0001
        # area = reducer.getInfo()['tcc'] * 100 * 100 * 0.0001 # in hectare
        # meaning we can use the value directly as the hectare
        return {MyanmarFRA.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}
