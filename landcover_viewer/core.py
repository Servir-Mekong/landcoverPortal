# -*- coding: utf-8 -*-

from django.conf import settings
from django.utils import timezone
from main.models import Email, ExportDrive
from utils.utils import get_unique_string, transfer_files_to_user_drive, send_email
from download_link import DownloadLink
import ee, json, os, time

# =============================================================================
class LandCoverViewer():
    '''
        Google Earth Engine API
    '''

    ee.Initialize(settings.EE_CREDENTIALS)

    PROBABILITY_MAP = ee.ImageCollection('users/servirmekong/LandCover')

    YEARLY_COMPOSITES = ee.ImageCollection('projects/servir-mekong/yearlyComposites')

    # geometries
    #MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
    #COUNTRIES_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('Country',
    #                                           settings.COUNTRIES_NAME)).geometry()
    MEKONG_BOUNDARY = ee.FeatureCollection('users/biplov/mekong-boundary')
    MEKONG_FEATURE_COLLECTION = ee.FeatureCollection('users/biplov/Mekong')
    #COUNTRIES_GEOM = MEKONG_FEATURE_COLLECTION.filter(ee.Filter.inList('NAME_0',
    #                                                                   settings.COUNTRIES_NAME)).geometry()

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
                                    ee.Filter.inList('NAME_0', [area_name])).geometry()#.buffer(8500)
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
                self.geometry = LandCoverViewer.MEKONG_BOUNDARY#COUNTRIES_GEOM.buffer(8500)
        else:
            self.geometry = self._get_geometry(shape)

        self.v1 = False
        self.v2 = False
    
        self.v5 = True
        self.LANDCOVERMAP = ee.ImageCollection('projects/servir-mekong/RLCMSV2/lc_rlcms_logical_v6_remap')
        # Class and Index
    
        self.LANDCOVERCLASSES = [
            {
                "name": "aquaculture",
                "value": 1,
                "color": "29B6F6"
            },
            {
                "name": "barren",
                "value": 2,
                "color": "CCCCCC"
            },
            {
                "name": "cropland",
                "value": 3,
                "color": "F2E527"
            },
            {
                "name": "cropPlantation",
                "value": 4,
                "color": "F4CCCC"
            },
            {
                "name": "deciduous",
                "value": 5,
                "color": "70A800"
            },
            {
                "name": "evergreen",
                "value": 6,
                "color": "267300"
            },
            {
                "name": "floodedForest",
                "value": 7,
                "color": "B4D79E"
            },
            {
                "name": "forestPlantation",
                "value": 8,
                "color": "C49963"
            },
            {
                "name": "grass",
                "value": 9,
                "color": "D7C29E"
            },
            {
                "name": "mangrove",
                "value": 10,
                "color": "FF7FBF"
            },
            {
                "name": "otherForest",
                "value": 11,
                "color": "AA66CD"
            },
            {
                "name": "palm",
                "value": 12,
                "color": "F5F57A"
            },
            {
                "name": "rice",
                "value": 13,
                "color": "FFFFBE"
            },
            {
                "name": "rubber",
                "value": 14,
                "color": "AAFF00"
            },
            {
                "name": "shrub",
                "value": 15,
                "color": "89CD66"
            },
            {
                "name": "urban",
                "value": 16,
                "color": "E600A9"
            },
            {
                "name": "water",
                "value": 17,
                "color": "004DA8"
            },
            {
                "name": "wetland",
                "value": 18,
                "color": "91E5A5"
            },
            {
                "name": "snow",
                "value": 19,
                "color": "F4F4F4"
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
        self.area_path = area_path
        self.area_name = area_name
        self.dlink = DownloadLink()
        self.countries = {
            "Cambodia": [
                "Banteay Mean Cheay", "Battambang", "Kampong Chaam", "Kampong Speu", "Kampong Thom", 
                "Kampot", "Kandaal", "Kep", "Koh Kong", "Kompong Chnang", "Mondul Kiri", "Oddar Meanchey", 
                "Pailin", "Phnom Penh", "Preah Vihear", "Prey Veaeng", "Pursat", "Ratanakiri", "Siem Reap", 
                "Sihanoukville", "Soairieng", "Stung Treng", "Tbong Khmum"
            ],
            "Laos": [
                "Attapu", "Bokeo", "Bolikhamxai", "Champasak", "Houaphan", "Khammouan", "Louang Namtha", 
                "Louangphrabang", "Oudomxai", "Phongsali", "Saravan", "Savannakhot", "Vientiane", 
                "Xaignabouri", "Xaisomboun", "Xekong", "Xiangkhoang"
            ],
            "Myanmar": [
                "Ayeyarwady", "Bago", "Chin", "Kachin", "Kayah", "Kayin", "Magway", "Mandalay", "Mon", 
                "Naypyitaw", "Rakhine", "Sagaing", "Shan", "Tanintharyi", "Yangon"
            ],
            "Thailand": [
                "Amnat Charoen", "Ang Thong", "Bangkok Metropolis", "Bueng Kan", "Buri Ram", "Chachoengsao", 
                "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chon Buri", 
                "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi", "Lampang", 
                "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham", "Mukdahan", "Nakhon Nayok", 
                "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Sawan", "Nakhon Si Thammarat", 
                "Nan", "Narathiwat", "Nong Bua Lam Phu", "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", 
                "Phangnga", "Phatthalung", "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", 
                "Phra Nakhon Si Ayutthaya", "Phrae", "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi", 
                "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", 
                "Saraburi", "Satun", "Si Sa Ket", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani", 
                "Surin", "Tak", "Trang", "Trat", "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", 
                "Yasothon"
            ],
            "Vietnam": [
                "An Giang", "Ba Ria - Vung Tau", "Bac Giang", "Bac Kan", "Bac Lieu", "Bac Ninh", "Ben Tre", 
                "Binh Dinh", "Binh Duong", "Binh Phuoc", "Binh Thuan", "Ca Mau", "Can Tho", "Cao Bang", 
                "Da Nang City", "Dak Lak", "Dak Nong", "Dien Bien", "Dong Nai", "Dong Thap", "Gia Lai", 
                "Ha Giang", "Ha Nam", "Ha Tay", "Ha Tinh", "Hai Duong", "Haiphong", "Hanoi", "Hau Giang", 
                "Ho Chi Minh", "Hoa Binh", "Hung Yen", "Khanh Hoa", "Kien Giang", "Kon Tum", "Lai Chau", 
                "Lam Dong", "Lang Son", "Lao Cai", "Long An", "Nam Dinh", "Nghe An", "Ninh Binh", "Ninh Thuan", 
                "Phu Tho", "Phu Yen", "Quang Binh", "Quang Nam", "Quang Ngai", "Quang Ninh", "Quang Tri", 
                "Soc Trang", "Son La", "Tay Ninh", "Thai Binh", "Thai Nguyen", "Thanh Hoa", "Thua Thien - Hue", 
                "Tien Giang", "Tra Vinh", "Tuyen Quang", "Vinh Long", "Vinh Phuc", "Yen Bai"
            ]
        }

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

        return LandCoverViewer.MEKONG_BOUNDARY#COUNTRIES_GEOM.buffer(8500)

    # -------------------------------------------------------------------------
    def get_landcover(self, classes=range(1, 19), year=2023, download=False):
        image = self.LANDCOVERMAP.filterDate('%s-01-01' % year, '%s-12-31' % year).first()
        # ic = ee.ImageCollection('projects/servir-mekong/RLCMSV2/lc_rlcms_logical_v5_remap')
        # image = ic.filterDate('2023-01-01', '2023-12-31').first()
        image = image.select('lc')

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # get the primitives
        for _class in classes:
            _mask = image.eq(ee.Number(int(_class)))
            masked_image = masked_image.add(_mask)

        #palette = '6f6f6f,aec3d4,b1f9ff,111149,287463,152106,c3aa69,9ad2a5,7db087,486f50,387242,115420,cc0013,8dc33b,ffff00,a1843b,cec2a5,674c06,3bc3b2,f4a460,800080'
        palette = []
        for _class in self.LANDCOVERCLASSES:
            palette.append(_class['color'])

        palette = ','.join(palette)
        # image = image.clip(self.geometry)
        image = image.updateMask(masked_image).clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': 1,
            'max': 19,
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
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
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
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
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }

    # -------------------------------------------------------------------------
    def get_download_url(self,
                         type = 'landcover',
                         year = 2016,
                         classes = range(1, 19),
                         index = 0,
                         ):

        if type == 'landcover':
            if self.area_path == "country":
                url = self.dlink.get_download_link_lc(self.area_name, year)
                return {'downloadUrl': url}
            elif self.area_path == "province":
                adm_unit_to_country = {adm_unit: country for country, adm_units in self.countries.items() for adm_unit in adm_units}
                area_name = adm_unit_to_country[self.area_name]
                url = self.dlink.get_download_link_lc(area_name, year)
                return {'downloadUrl': url}
            else:
                image = self.get_landcover(classes=classes, year=year, download=True)
        elif type == 'primitive':
            image = self.get_primitive(index=index, year=year, download=True)
        elif type == 'probability':
            image = self.get_probability(year=year, download=True)
        elif type == 'composite':
            image = self.get_composite(year=year, download=True)
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
                          year = 2016,
                          classes = range(1, 19),
                          index = 0,
                          file_name = '',
                          user_email = None,
                          user_id = None,
                          oauth2object = None,
                          export_id = None,
                          user_name = None
                          ):

        if not (user_email and user_id and oauth2object):
            return {'error': 'something wrong with the google drive api!'}

        if type == 'landcover':
            image = self.get_landcover(classes=classes, year=year, download=True)
        elif type == 'primitive':
            image = self.get_primitive(index=index, year=year, download=True)
        elif type == 'probability':
            image = self.get_probability(year=year, download=True)
        elif type == 'composite':
            image = self.get_composite(year=year, download=True)

        temp_file_name = get_unique_string()

        if not file_name:
            file_name = temp_file_name + '.tif'
        else:
            file_name = file_name + '.tif'

        try:
            task = ee.batch.Export.image.toDrive(
                image = image,
                description = 'Land Cover Export from SERVIR Mekong',
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

                # if export_id:
                    # dump in db now
                    # start with email
                    # @ToDo: use email template
                    # email_data = {
                    #     'subject': 'SERVIR-Mekong: your export is ready',
                    #     'body': 'Hi <strong>{}</strong>,<br/><br/>Your export is ready. Open <a href="https://drive.google.com" target="_blank">google drive</a> or alternatively click this <a href="{}" target="_blank">link</a><br/><br/><i>This is automatically generated email. Do not reply to this email.</i>'.format(user_name, link),
                    #     'from_address': settings.EMAIL_HOST_USER,
                    #     'to_address': [user_email]
                    # }

                    # send notification to user
                    # send_email(email_data, html=True)

                    # create email object
                    # email_data['to_address'] = user_email
                    # email = Email.objects.create(**email_data)

                    # update export drive
                    # ExportDrive.objects.filter(pk=export_id).update(
                    #     email = email,
                    #     url = link,
                    #     completed_on = timezone.now()
                    # )
                return {'driveLink': link}
            except Exception as e:
                print (str(e))
                return {'error': str(e)}
        else:
            print ('Task failed (id: %s) because %s' % (task.id, task.status()['error_message']))
            return {'error': 'Task failed (id: %s) because %s' % (task.id, task.status()['error_message'])}

    # -------------------------------------------------------------------------
    def get_stats(self, year=2016, classes=range(0, 21)):

        image = self.get_landcover(classes=classes, year=year, download=True)

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

# =============================================================================
    def get_composite(self, year=2017, download=False):

        image = ee.Image(LandCoverViewer.YEARLY_COMPOSITES.filterDate('%s-01-01' % year, '%s-12-31' % year).first()).clip(self.geometry)
        if download:
            return image.select(['red','green','blue'])
        map_id = image.getMapId({
            'min': 0,
            'max': 6000,
            'bands': 'swir1,nir,red'
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }
