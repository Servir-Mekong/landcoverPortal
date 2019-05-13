# -*- coding: utf-8 -*-

from django.conf import settings
from utils.utils import get_unique_string, transfer_files_to_user_drive

import ee, json, os, time

# -----------------------------------------------------------------------------
class LandCoverViewer():
    '''
        Google Earth Engine API
    '''

    ee.Initialize(settings.EE_CREDENTIALS)

    PROBABILITY_MAP = ee.ImageCollection('users/servirmekong/LandCover')

    # geometries
    #MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
    #COUNTRIES_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('Country',
    #                                           settings.COUNTRIES_NAME)).geometry()
    MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('users/biplov/mekong-admin-0')
    COUNTRIES_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('Name',
                                                                       settings.COUNTRIES_NAME)).geometry()

    # -------------------------------------------------------------------------
    def __init__(self, area_path, area_name, shape, geom, radius, center, version):

        self.geom = geom
        self.radius = radius
        self.center = center
        if (area_path and area_name):
            if (area_path == 'country'):
                #if (area_name == 'Myanmar'):
                #    area_name = 'Myanmar (Burma)'
                self.geometry = LandCoverViewer.MEKONG_FEATURE_COLLECTION.filter(\
                                    ee.Filter.inList('Name', [area_name])).geometry()
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
                self.geometry = LandCoverViewer.COUNTRIES_GEOM
        else:
            self.geometry = self._get_geometry(shape)

        self.v1 = False
        self.v2 = False
        self.v3 = False
        if version and version == 'v1':
            self.v1 = True
            self.LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/Assemblage/RegionalLC')
            # Class and Index
            self.LANDCOVERCLASSES = [
                {
                    'name': 'Other',
                    'value': '0',
                    'color': '6f6f6f'
                },
                {
                    'name': 'Surface Water',
                    'value': '1',
                    'color': 'aec3d4'
                },
                {
                    'name': 'Snow and Ice',
                    'value': '2',
                    'color': 'b1f9ff'
                },
                {
                    'name': 'Mangroves',
                    'value': '3',
                    'color': '111149'
                },
                {
                    'name': 'Flooded Forest',
                    'value': '4',
                    'color': '287463'
                },
                {
                    'name': 'Deciduous Forest',
                    'value': '5',
                    'color': '152106'
                },
                {
                    'name': 'Orchard or Plantation Forest',
                    'value': '6',
                    'color': 'c3aa69'
                },
                {
                    'name': 'Evergreen Broadleaf Alpine',
                    'value': '7',
                    'color': '9ad2a5'
                },
                {
                    'name': 'Evergreen Broadleaf',
                    'value': '8',
                    'color': '7db087'
                },
                {
                    'name': 'Evergreen Needleleaf',
                    'value': '9',
                    'color': '486f50'
                },
                {
                    'name': 'Evergreen Mixed Forest',
                    'value': '10',
                    'color': '387242'
                },
                {
                    'name': 'Mixed Evergreen and Deciduous',
                    'value': '11',
                    'color': '115420'
                },
                {
                    'name': 'Urban and Built Up',
                    'value': '12',
                    'color': 'cc0013'
                },
                {
                    'name': 'Cropland',
                    'value': '13',
                    'color': '8dc33b'
                },
                {
                    'name': 'Rice Paddy',
                    'value': '14',
                    'color': 'ffff00'
                },
                {
                    'name': 'Mudflat and Intertidal',
                    'value': '15',
                    'color': 'a1843b'
                },
                {
                    'name': 'Mining',
                    'value': '16',
                    'color': 'cec2a5'
                },
                {
                    'name': 'Barren',
                    'value': '17',
                    'color': '674c06'
                },
                {
                    'name': 'Wetlands',
                    'value': '18',
                    'color': '3bc3b2'
                },
                {
                    'name': 'Grassland',
                    'value': '19',
                    'color': 'f4a460'
                },
                {
                    'name': 'Shrubland',
                    'value': '20',
                    'color': '800080'
                }
            ]
        
            self.INDEX_CLASS = {}
            for _class in self.LANDCOVERCLASSES:
                self.INDEX_CLASS[int(_class['value'])] = _class['name']

            # primitives
            PRIMITIVE_BARREN = ee.ImageCollection('projects/servir-mekong/Primitives/P_barren')
            PRIMITIVE_BUILTUP = ee.ImageCollection('projects/servir-mekong/Primitives/P_builtup')
            PRIMITIVE_CANOPY = ee.ImageCollection('projects/servir-mekong/Primitives/P_canopy')
            PRIMITIVE_CROPLAND = ee.ImageCollection('projects/servir-mekong/Primitives/P_cropland')
            PRIMITIVE_DECIDUOUS = ee.ImageCollection('projects/servir-mekong/Primitives/P_deciduous')
            PRIMITIVE_EPHEMERAL_WATER = ee.ImageCollection('projects/servir-mekong/Primitives/P_ephemeral_water')
            PRIMITIVE_EVERGREEN = ee.ImageCollection('projects/servir-mekong/Primitives/P_evergreen')
            PRIMITIVE_EVERGREEN_BROADLEAF = ee.ImageCollection('projects/servir-mekong/Primitives/P_evergreen_broadleaf')
            PRIMITIVE_EVERGREEN_NEEDLELEAF = ee.ImageCollection('projects/servir-mekong/Primitives/P_evergreen_needleleaf')
            #PRIMITIVE_FOREST_COVER = ee.ImageCollection('projects/servir-mekong/Primitives/P_forest_cover')
            PRIMITIVE_GRASS = ee.ImageCollection('projects/servir-mekong/Primitives/P_grass')
            PRIMITIVE_IMPERVIOUS = ee.ImageCollection('projects/servir-mekong/Primitives/P_impervious')
            PRIMITIVE_IRRIGATED = ee.ImageCollection('projects/servir-mekong/Primitives/P_irrigated')
            PRIMITIVE_MANGROVE = ee.ImageCollection('projects/servir-mekong/Primitives/P_mangrove')
            #PRIMITIVE_MIXED_FOREST = ee.ImageCollection('projects/servir-mekong/Primitives/P_mixed_forest')
            PRIMITIVE_RICE = ee.ImageCollection('projects/servir-mekong/Primitives/P_rice')
            PRIMITIVE_SHRUB = ee.ImageCollection('projects/servir-mekong/Primitives/P_shrub')
            PRIMITIVE_SNOW_ICE = ee.ImageCollection('projects/servir-mekong/Primitives/P_snow_ice').select('max_snow')
            PRIMITIVE_SURFACE_WATER = ee.ImageCollection('projects/servir-mekong/Primitives/P_surface_water')
            PRIMITIVE_TREE_HEIGHT = ee.ImageCollection('projects/servir-mekong/Primitives/P_tree_height')
            self.PRIMITIVES = [
                PRIMITIVE_BARREN, PRIMITIVE_BUILTUP, PRIMITIVE_CANOPY, PRIMITIVE_CROPLAND, PRIMITIVE_DECIDUOUS,
                PRIMITIVE_EPHEMERAL_WATER, PRIMITIVE_EVERGREEN, PRIMITIVE_EVERGREEN_BROADLEAF, PRIMITIVE_EVERGREEN_NEEDLELEAF,
                PRIMITIVE_GRASS, PRIMITIVE_IMPERVIOUS, PRIMITIVE_IRRIGATED, PRIMITIVE_MANGROVE, 
                PRIMITIVE_RICE, PRIMITIVE_SHRUB, PRIMITIVE_SNOW_ICE, PRIMITIVE_SURFACE_WATER, PRIMITIVE_TREE_HEIGHT
            ]
        elif version and version == 'v2':
            self.v2 = True
            self.LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/rlcms')
            # Class and Index
            self.LANDCOVERCLASSES = [
                {
                    'name': 'Unknown',
                    'value': '0',
                    'color': '6f6f6f'
                },
                {
                    'name': 'Surface Water',
                    'value': '1',
                    'color': 'aec3d4'
                },
                {
                    'name': 'Snow and Ice',
                    'value': '2',
                    'color': 'b1f9ff'
                },
                {
                    'name': 'Mangroves',
                    'value': '3',
                    'color': '111149'
                },
                {
                    'name': 'Flooded Forest',
                    'value': '4',
                    'color': '287463'
                },
                {
                    'name': 'Deciduous Forest',
                    'value': '5',
                    'color': '152106'
                },
                {
                    'name': 'Orchard or Plantation Forest',
                    'value': '6',
                    'color': 'c3aa69'
                },
                {
                    'name': 'Evergreen Broadleaf',
                    'value': '7',
                    'color': '7db087'
                },
                {
                    'name': 'Mixed Forest',
                    'value': '8',
                    'color': '387242'
                },
                {
                    'name': 'Urban and Built Up',
                    'value': '9',
                    'color': 'cc0013'
                },
                {
                    'name': 'Cropland',
                    'value': '10',
                    'color': '8dc33b'
                },
                {
                    'name': 'Rice',
                    'value': '11',
                    'color': 'ffff00'
                },
                {
                    'name': 'Mining',
                    'value': '12',
                    'color': 'cec2a5'
                },
                {
                    'name': 'Barren',
                    'value': '13',
                    'color': '674c06'
                },
                {
                    'name': 'Wetlands',
                    'value': '14',
                    'color': '3bc3b2'
                },
                {
                    'name': 'Grassland',
                    'value': '15',
                    'color': 'f4a460'
                },
                {
                    'name': 'Shrubland',
                    'value': '16',
                    'color': '800080'
                },
                {
                    'name': 'Aquaculture',
                    'value': '17',
                    'color': '51768e'
                }
            ]
        
            self.INDEX_CLASS = {}
            for _class in self.LANDCOVERCLASSES:
                self.INDEX_CLASS[int(_class['value'])] = _class['name']

            # primitives
            PRIMITIVE_AQUACULTURE = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/aquaculture')
            PRIMITIVE_BARREN = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/barren')
            PRIMITIVE_CLOSED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/closedForest')
            PRIMITIVE_CROPLAND = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/cropland')
            PRIMITIVE_DECIDUOUS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/deciduous')
            PRIMITIVE_EVERGREEN = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/evergreen')
            PRIMITIVE_FLOODED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/floodedForest')
            PRIMITIVE_GRASS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/grass')
            PRIMITIVE_MANGROVE = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/mangrove')
            PRIMITIVE_MIXED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/mixedForest')
            PRIMITIVE_OPEN_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/openForest')
            PRIMITIVE_PLANTATIONS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/plantations')
            PRIMITIVE_RICE = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/rice')
            PRIMITIVE_SHRUB = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/shrub')
            PRIMITIVE_SNOW = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/snow')
            PRIMITIVE_TIDAL = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/tidal')
            PRIMITIVE_URBAN = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/urban')
            PRIMITIVE_WATER = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/water')
            PRIMITIVE_WETLANDS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/wetlands')
            PRIMITIVE_WOODY = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/woody')
            self.PRIMITIVES = [
                PRIMITIVE_AQUACULTURE, PRIMITIVE_BARREN, PRIMITIVE_CLOSED_FOREST, PRIMITIVE_CROPLAND, PRIMITIVE_DECIDUOUS,
                PRIMITIVE_EVERGREEN, PRIMITIVE_FLOODED_FOREST, PRIMITIVE_GRASS, PRIMITIVE_MANGROVE, PRIMITIVE_MIXED_FOREST,
                PRIMITIVE_OPEN_FOREST, PRIMITIVE_PLANTATIONS, PRIMITIVE_RICE, PRIMITIVE_SHRUB, PRIMITIVE_SNOW,
                PRIMITIVE_TIDAL, PRIMITIVE_URBAN, PRIMITIVE_WATER, PRIMITIVE_WETLANDS, PRIMITIVE_WOODY
            ]
        else:
            self.v3 = True
            self.LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/rlcmsV3')
            # Class and Index
            self.LANDCOVERCLASSES = [
                {
                    'name': 'Unknown',
                    'value': '0',
                    'color': '6f6f6f'
                },
                {
                    'name': 'Surface Water',
                    'value': '1',
                    'color': 'aec3d4'
                },
                {
                    'name': 'Snow and Ice',
                    'value': '2',
                    'color': 'b1f9ff'
                },
                {
                    'name': 'Mangroves',
                    'value': '3',
                    'color': '111149'
                },
                {
                    'name': 'Flooded Forest',
                    'value': '4',
                    'color': '287463'
                },
                {
                    'name': 'Forest',
                    'value': '5',
                    'color': '152106'
                },
                {
                    'name': 'Orchard or Plantation Forest',
                    'value': '6',
                    'color': 'c3aa69'
                },
                {
                    'name': 'Evergreen Broadleaf',
                    'value': '7',
                    'color': '7db087'
                },
                {
                    'name': 'Mixed Forest',
                    'value': '8',
                    'color': '387242'
                },
                {
                    'name': 'Urban and Built Up',
                    'value': '9',
                    'color': 'cc0013'
                },
                {
                    'name': 'Cropland',
                    'value': '10',
                    'color': '8dc33b'
                },
                {
                    'name': 'Rice',
                    'value': '11',
                    'color': 'ffff00'
                },
                {
                    'name': 'Mining',
                    'value': '12',
                    'color': 'cec2a5'
                },
                {
                    'name': 'Barren',
                    'value': '13',
                    'color': '674c06'
                },
                {
                    'name': 'Wetlands',
                    'value': '14',
                    'color': '3bc3b2'
                },
                {
                    'name': 'Grassland',
                    'value': '15',
                    'color': 'f4a460'
                },
                {
                    'name': 'Shrubland',
                    'value': '16',
                    'color': '800080'
                },
                {
                    'name': 'Aquaculture',
                    'value': '17',
                    'color': '51768e'
                }
            ]
        
            self.INDEX_CLASS = {}
            for _class in self.LANDCOVERCLASSES:
                self.INDEX_CLASS[int(_class['value'])] = _class['name']

            # primitives
            PRIMITIVE_AQUACULTURE = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/aquaculture')
            PRIMITIVE_BARREN = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/barren')
            PRIMITIVE_CLOSED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/closedForest')
            PRIMITIVE_CROPLAND = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/cropland')
            PRIMITIVE_DECIDUOUS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/deciduous')
            PRIMITIVE_EVERGREEN = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/evergreen')
            PRIMITIVE_FLOODED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/floodedForest')
            PRIMITIVE_GRASS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/grass')
            PRIMITIVE_MANGROVE = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/mangrove')
            PRIMITIVE_MIXED_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/mixedForest')
            PRIMITIVE_OPEN_FOREST = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/openForest')
            PRIMITIVE_PLANTATIONS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/plantations')
            PRIMITIVE_RICE = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/rice')
            PRIMITIVE_SHRUB = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/shrub')
            PRIMITIVE_SNOW = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/snow')
            PRIMITIVE_TIDAL = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/tidal')
            PRIMITIVE_URBAN = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/urban')
            PRIMITIVE_WATER = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/water')
            PRIMITIVE_WETLANDS = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/wetlands')
            PRIMITIVE_WOODY = ee.ImageCollection('projects/servir-mekong/yearly_primitives_smoothed/woody')
            self.PRIMITIVES = [
                PRIMITIVE_AQUACULTURE, PRIMITIVE_BARREN, PRIMITIVE_CLOSED_FOREST, PRIMITIVE_CROPLAND, PRIMITIVE_DECIDUOUS,
                PRIMITIVE_EVERGREEN, PRIMITIVE_FLOODED_FOREST, PRIMITIVE_GRASS, PRIMITIVE_MANGROVE, PRIMITIVE_MIXED_FOREST,
                PRIMITIVE_OPEN_FOREST, PRIMITIVE_PLANTATIONS, PRIMITIVE_RICE, PRIMITIVE_SHRUB, PRIMITIVE_SNOW,
                PRIMITIVE_TIDAL, PRIMITIVE_URBAN, PRIMITIVE_WATER, PRIMITIVE_WETLANDS, PRIMITIVE_WOODY
            ]

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
    def get_landcover(self, primitives=range(0, 21), year=2016, download=False):

        image = ee.Image(self.LANDCOVERMAP.filterDate('%s-01-01' % year,
                                                      '%s-12-31' % year).mean())
        if self.v2 or self.v3:
            image = image.select('lc')

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the primitives
        for primitive in primitives:
            _mask = image.eq(ee.Number(int(primitive)))
            masked_image = masked_image.add(_mask)

        #palette = '6f6f6f,aec3d4,b1f9ff,111149,287463,152106,c3aa69,9ad2a5,7db087,486f50,387242,115420,cc0013,8dc33b,ffff00,a1843b,cec2a5,674c06,3bc3b2,f4a460,800080'
        palette = []
        for _class in self.LANDCOVERCLASSES:
            palette.append(_class['color'])

        palette = ','.join(palette)

        image = image.updateMask(masked_image).clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': str(len(self.LANDCOVERCLASSES) - 1),
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_primitive(self, index=0, year=2016, download=False):

        primitive_img_coll = self.PRIMITIVES[index]

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
            'palette': 'ffffff, e5e5e5, cccccc, b2b2b2, 999999, 7f7f7f, 666666, 4c4c4c, 323232, 191919, 000000'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_probability(self, year=2017, download=False):

        image = ee.Image(LandCoverViewer.PROBABILITY_MAP.filterDate(\
                                                    '%s-01-01' % year,
                                                    '%s-12-31' % year).mean())
        image = image.select('probability').clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': '100',
            'palette': 'red,orange,yellow,green,darkgreen'
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

        elif type == 'probability':
            image = self.get_probability(year=year, download=True)

        try:
            url = image.getDownloadURL({
                'name': type,
                'scale': 30
            })
            return {'downloadUrl': url}
        except Exception as e:
            return {'error': '{} Try using download to drive options for larger area!'.format(e.message)}

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

        elif type == 'probability':
            image = self.get_probability(year=year, download=True)

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
                region = self.geometry.bounds().getInfo()['coordinates'],#self.geometry.getInfo()['coordinates'],
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
    def get_stats(self, year=2016, primitives=range(0, 21)):

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
        if self.v1:
            data = stats.getInfo()['Mode']
        else:
            data = stats.getInfo()['lc']
        # converting to meter square by multiplying with scale value i.e. 100*100
        # and then converting to hectare multiplying with 0.0001
        # area = reducer.getInfo()['tcc'] * 100 * 100 * 0.0001 # in hectare
        # meaning we can use the value directly as the hectare
        return {self.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}
