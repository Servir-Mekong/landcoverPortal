# -*- coding: utf-8 -*-

from django.conf import settings
from utils.utils import get_unique_string, transfer_files_to_user_drive

import ee, json, os, time

# -----------------------------------------------------------------------------
class MyanmarPlantation():
    '''
        Google Earth Engine API
    '''

    ee.Initialize(settings.EE_CREDENTIALS)

    # land-use map
    #LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/FinalMyanmarLandCover')
    LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/LandCoverMyanmar')

    LANDCOVER_ASSEMBLAGE = ee.ImageCollection('users/servirmekong/rubber/assemblage_landcover')
    PROBABILITY = ee.ImageCollection('users/servirmekong/rubber/probability')
    YEARLY_COMPOSITES = ee.ImageCollection('projects/servir-mekong/yearlyComposites')

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
    MEKONG_FEATURE_COLLECTION = ee.FeatureCollection("FAO/GAUL/2015/level0")
    DEFAULT_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('ADM0_NAME', ['Myanmar'])).geometry()

    # Class and Inde
    MAP_CLASSES = [
        {
            'name': 'Unknown',
            'value': '0',
            'color': '6f6f6f'
        },
        {
            'name': 'Surface water',
            'value': '1',
            'color': 'aec3d4'
        },
        {
            'name': 'Forest',
            'value': '2',
            'color': '152106'
        },
        {
            'name': 'Urban and built up',
            'value': '3',
            'color': 'cc0013'
        },
        {
            'name': 'Cropland',
            'value': '4',
            'color': '8dc33b'
        },
        {
            'name': 'Rubber',
            'value': '5',
            'color': '3bc3b2'
        },
        {
            'name': 'Palmoil',
            'value': '6',
            'color': '800080'
        },
        {
            'name': 'Mangrove',
            'value': '7',
            'color': '111149'
        }
    ]

    INDEX_CLASS = {}
    for _class in MAP_CLASSES:
        INDEX_CLASS[int(_class['value'])] = _class['name']


    # -------------------------------------------------------------------------
    def __init__(self, area_path, area_name, shape, geom, radius, center):

        self.geom = geom
        self.radius = radius
        self.center = center
        if (area_path and area_name):
            if (area_path == 'country'):
                if (area_name == 'Myanmar'):
                    area_name = 'Myanmar (Burma)'
                self.geometry = MyanmarPlantation.MEKONG_FEATURE_COLLECTION.filter(\
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
                self.geometry = MyanmarPlantation.DEFAULT_GEOM.buffer(10000)
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

        # return MyanmarPlantation.DEFAULT_GEOM.buffer(10000)
        return MyanmarPlantation.DEFAULT_GEOM

    # -------------------------------------------------------------------------
    def get_landcover(self, classes=range(0, 11), year=2018, download=False):

        image_collection = MyanmarPlantation.LANDCOVER_ASSEMBLAGE.filterDate(\
                                                            '%s-01-01' % year,
                                                            '%s-12-31' % year
                                                            )

        if image_collection.size().getInfo() > 0:
            image = ee.Image(image_collection.first())
            image = image.select('classification')
        else:
            return {
                'error': 'No data available for year {}'.format(year)
            }

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the classes
        for _class in classes:
            _mask = image.eq(ee.Number(int(_class)))
            masked_image = masked_image.add(_mask)

        palette = []
        for _class in MyanmarPlantation.MAP_CLASSES:
            palette.append(_class['color'])

        palette = ','.join(palette)

        image = image.updateMask(masked_image).clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': str(len(MyanmarPlantation.MAP_CLASSES) - 1),
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }

    # -------------------------------------------------------------------------
    def get_download_url(self,
                         type = 'landcover',
                         year = 2018,
                         classes = range(0, 12),
                         ):

        if type == 'landcover':
            image = self.get_landcover(classes=classes, year=year, download=True)

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
                          file_name = '',
                          user_email = None,
                          user_id = None,
                          oauth2object = None,
                          ):

        if not (user_email and user_id and oauth2object):
            return {'error': 'something wrong with the google drive api!'}

        if type == 'landcover':
            image = self.get_landcover(classes=classes, year=year, download=True)

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
    def get_stats(self, year=2018, classes=range(0, 12)):

        image = self.get_landcover(classes=classes, year=year, download=True)

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
        # return {MyanmarPlantation.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}
        return {MyanmarPlantation.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}

    # -------------------------------------------------------------------------
    def get_probability(self, year=2018, download=False):

        image_collection = MyanmarPlantation.PROBABILITY.filterDate('%s-01-01' % year,
                                                            '%s-12-31' % year)

        if image_collection.size().getInfo() > 0:
            image = ee.Image(image_collection.first())
            image = image.select('classification').clip(self.geometry)
        else:
            return {
                'error': 'No probability data available for year {}'.format(year)
            }

        if download:
            return image

        map_id = image.getMapId({
            'min': '50',
            'max': '100',
            'palette': 'red,yellow,darkgreen'
        })
        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }

    # -------------------------------------------------------------------------
    def get_composite(self, year=2018):

        image_collection = MyanmarPlantation.YEARLY_COMPOSITES.filterDate('%s-01-01' % year, '%s-12-31' % year)

        if image_collection.size().getInfo() > 0:
            image = ee.Image(image_collection.first())
        else:
            return {
                'error': 'No composite data available for year {}'.format(year)
            }

        map_id = image.getMapId({
            'min': 0,
            'max': 6000,
            'bands': 'swir1,nir,red'
        })
        print(str(map_id['mapid']))

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }

# END =========================================================================
