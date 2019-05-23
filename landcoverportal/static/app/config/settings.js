var settings = {
    menus: [
        {
            'name': 'Methods',
            'url': '/method/',
            'show': true
        },
        {
            'name': 'Service Applications',
            'url': '/service-applications/',
            'show': true
        }
    ],
    applicationName: 'Land Cover Portal',
    footerLinks: [{
            'name': 'About',
            'url': 'https://servir.adpc.net/about/about-servir-mekong',
            'show': true
        },
        {
            'name': 'Tools',
            'url': 'https://servir.adpc.net/tools',
            'show': true
        },
        {
            'name': 'Geospatial Datasets',
            'url': 'https://servir.adpc.net/geospatial-datasets',
            'show': true
        },
        {
            'name': 'Resources and Publications',
            'url': 'https://servir.adpc.net/publications',
            'show': true
        },
        {
            'name': 'News',
            'url': 'https://servir.adpc.net/news',
            'show': true
        },
        {
            'name': 'Events',
            'url': 'https://servir.adpc.net/events',
            'show': true
        },
        {
            'name': 'Contact Us',
            'url': 'https://servir.adpc.net/about/contact-servir-mekong',
            'show': true
        },
        {
            'name': 'Privacy Policy',
            'url': '#',
            'show': true
        }
    ],
    partnersHeader: [{
            'alt': 'The United States Agency for International Development',
            'url': 'https://www.usaid.gov/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/USAID_Logo_Color.png',
            'src': 'images/usaid.png',
            'className': 'usaid',
            'version1': true
        },
        {
            'alt': 'The National Aeronautics and Space Administration',
            'url': 'https://www.nasa.gov/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/NASA_Logo_Color.png',
            'src': 'images/nasa.png',
            'className': 'nasa',
            'version1': true
        },
        {
            'alt': 'Asian Disaster Preparedness Center',
            'url': 'http://www.adpc.net/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-adbc.png',
            'src': 'images/adpc.png',
            'className': 'adpc',
            'version1': true
        },
        {
            'alt': 'ICIMOD',
            'url': 'http://www.icimod.org/',
            'src': 'images/icimod.png',
            'className': 'icimod',
            'version1': false
        },
        {
            'alt': 'SERVIR-HKH',
            'url': 'http://servir.icimod.org/',
            'src': 'images/servir-himalaya.png',
            'className': 'servir-hkh',
            'version1': false
        },
        {
            'alt': 'SERVIR-Mekong',
            'url': 'https://servir.adpc.net/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/Servir_Logo_Color.png',
            'src': 'images/servir-mekong.png',
            'className': 'servir',
            'version1': true
        },
    ],
    partnersFooter: [{
            'alt': 'Spatial Infomatics Group',
            'url': 'https://sig-gis.com/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sig.png',
            'src': 'images/sig.png',
            'className': 'partner-sig'
        },
        {
            'alt': 'Stockholm Environment Institute',
            'url': 'https://www.sei-international.org/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sei.png',
            'src': 'images/sei.png',
            'className': 'partner-sei'
        },
        {
            'alt': 'Deltares',
            'url': 'https://www.deltares.nl/en/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-deltares.png',
            'src': 'images/deltares.png',
            'className': 'partner-deltares'
        }
    ],
    areaIndexSelectors: [{
            'value': 'country',
            'name': 'Country Level'
        },
        {
            'value': 'province',
            'name': 'Administrative Level'
        }
    ],
    fmsDataPurpose: [
        {
            'value': 'agriculture',
            'name': 'Agriculture'
        },
        {
            'value': 'climate_change',
            'name': 'Climate Change'
        },
        {
            'value': 'env',
            'name': 'Environment'
        },
        {
            'value': 'forest',
            'name': 'Forest'
        },
        {
            'value': 'biology',
            'name': 'Biology'
        },
        {
            'value': 'conservation',
            'name': 'Conservation'
        },
        {
            'value': 'others',
            'name': 'Others'
        }
    ],
    countries: ['Cambodia', 'Laos', 'Myanmar', 'Thailand', 'Vietnam'],
    // this list is generated from python script at /scripts/list-provience.py
    provinces: ['Amnat Charoen', 'An Giang', 'Ang Thong', 'Attapu', 'Ayeyarwady', 'Ba Ria - VTau', 'Bac Giang', 'Bac Kan', 'Bac Lieu', 'Bac Ninh', 'Bago', 'Bangkok Metropolis', 'Banteay Mean Cheay', 'Battambang', 'Ben Tre', 'Binh Dinh', 'Binh Duong', 'Binh Phuoc', 'Binh Thuan', 'Bokeo', 'Bolikhamxai', 'Bueng Kan', 'Buri Ram', 'Ca Mau', 'Can Tho', 'Cao Bang', 'Chachoengsao', 'Chai Nat', 'Chaiyaphum', 'Champasak', 'Chanthaburi', 'Chiang Mai', 'Chiang Rai', 'Chin', 'Chon Buri', 'Chumphon', 'Da Nang City', 'Dac Nong', 'Dak Lak', 'Dien Bien', 'Dong Nai', 'Dong Thap', 'Gia Lai', 'Ha Giang', 'Ha Nam', 'Ha Tay', 'Ha Tinh', 'Hai Duong', 'Haiphong', 'Hanoi', 'Hau Giang', 'Ho Chi Minh', 'Hoa Binh', 'Houaphan', 'Hung Yen', 'Kachin', 'Kalasin', 'Kamphaeng Nakhon Viang Chan', 'Kamphaeng Phet', 'Kampong Chaam', 'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kanchanaburi', 'Kandaal', 'Kayah', 'Kayin', 'Keb', 'Khammouan', 'Khanh Hoa', 'Khon Kaen', 'Kien Giang', 'Koh Kong', 'Kompong Chnang', 'Kon Tum', 'Krabi', 'Kratie', 'Lai Chau', 'Lam Dong', 'Lampang', 'Lamphun', 'Lang Son', 'Lao Cai', 'Loei', 'Long An', 'Lop Buri', 'Louang Namtha', 'Louangphrabang', 'Mae Hong Son', 'Magway', 'Maha Sarakham', 'Mandalay', 'Mon', 'Mondul Kiri', 'Mukdahan', 'Nakhon Nayok', 'Nakhon Pathom', 'Nakhon Phanom', 'Nakhon Ratchasima', 'Nakhon Sawan', 'Nakhon Si Thammarat', 'Nam Dinh', 'Nan', 'Narathiwat', 'Naypyitaw', 'Nghe An', 'Ninh Binh', 'Ninh Thuan', 'Nong Bua Lam Phu', 'Nong Khai', 'Nonthaburi', 'Oddar Meanchey', 'Oudomxai', 'Pailin', 'Pathum Thani', 'Pattani', 'Phangnga', 'Phatthalung', 'Phayao', 'Phetchabun', 'Phetchaburi', 'Phichit', 'Phitsanulok', 'Phnum Penh', 'Phongsali', 'Phra Nakhon Si Ayutthaya', 'Phrae', 'Phu Tho', 'Phu Yen', 'Phuket', 'Prachin Buri', 'Prachuap Khiri Khan', 'Preah Vihear', 'Prey Veaeng', 'Pursat', 'Quang Binh', 'Quang Nam', 'Quang Ngai', 'Quang Ninh', 'Quang Tri', 'Rakhine', 'Ranong', 'Ratana Kiri', 'Ratchaburi', 'Rayong', 'Roi Et', 'Sa Kaeo', 'Sagaing', 'Sakon Nakhon', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram', 'Saraburi', 'Saravan', 'Satun', 'Savannakhot', 'Shan', 'Si Sa Ket', 'Siem Reap', 'Sihanoukville', 'Sing Buri', 'Soairieng', 'Soc Trang', 'Son La', 'Songkhla', 'Stung Treng', 'Sukhothai', 'Suphan Buri', 'Surat Thani', 'Surin', 'Tak', 'Takeo', 'Tanintharyi', 'Tay Ninh', 'Tbong Khmum', 'Thai Binh', 'Thai Nguyen', 'Thanh Hoa', 'Thua Thien - Hue', 'Tien Giang', 'Tra Vinh', 'Trang', 'Trat', 'Tuyen Quang', 'Ubon Ratchathani', 'Udon Thani', 'Uthai Thani', 'Uttaradit', 'Vientiane', 'Vinh Long', 'Vinh Phuc', 'Xaignabouri', 'Xaisomboun', 'Xekong', 'Xiangkhoang', 'Yala', 'Yangon', 'Yasothon', 'Yen Bai'],
    myanmarProvinces: ['Ayeyarwady', 'Bago', 'Chin', 'Kachin', 'Kayah', 'Kayin', 'Magway', 'Mandalay', 'Mon', 'Naypyitaw', 'Rakhine', 'Sagaing', 'Shan', 'Tanintharyi', 'Yangon'],
    landCoverClassesV1: [
        {
            'name': 'Unknown',
            'value': '0',
            'color': '#6f6f6f'
        },
        {
            'name': 'Surface Water',
            'value': '1',
            'color': '#aec3d4'
        },
        {
            'name': 'Snow and Ice',
            'value': '2',
            'color': '#b1f9ff'
        },
        {
            'name': 'Mangroves',
            'value': '3',
            'color': '#111149'
        },
        {
            'name': 'Flooded Forest',
            'value': '4',
            'color': '#287463'
        },
        {
            'name': 'Deciduous Forest',
            'value': '5',
            'color': '#152106'
        },
        {
            'name': 'Orchard or Plantation forest',
            'value': '6',
            'color': '#c3aa69'
        },
        {
            'name': 'Evergreen Broadleaf Alpine',
            'value': '7',
            'color': '#9ad2a5'
        },
        {
            'name': 'Evergreen Broadleaf',
            'value': '8',
            'color': '#7db087'
        },
        {
            'name': 'Evergreen Needleleaf',
            'value': '9',
            'color': '#486f50'
        },
        {
            'name': 'Evergreen Mixed Forest',
            'value': '10',
            'color': '#387242'
        },
        {
            'name': 'Mixed Evergreen and Deciduous',
            'value': '11',
            'color': '#115420'
        },
        {
            'name': 'Urban and Built Up',
            'value': '12',
            'color': '#cc0013'
        },
        {
            'name': 'Cropland',
            'value': '13',
            'color': '#8dc33b'
        },
        {
            'name': 'Rice Paddy',
            'value': '14',
            'color': '#ffff00'
        },
        {
            'name': 'Mudflat and Intertidal',
            'value': '15',
            'color': '#a1843b'
        },
        {
            'name': 'Mining',
            'value': '16',
            'color': '#cec2a5'
        },
        {
            'name': 'Barren',
            'value': '17',
            'color': '#674c06'
        },
        {
            'name': 'Wetlands',
            'value': '18',
            'color': '#3bc3b2'
        },
        {
            'name': 'Grassland',
            'value': '19',
            'color': '#f4a460'
        },
        {
            'name': 'Shrubland',
            'value': '20',
            'color': '#800080'
        }
    ],
    landCoverClassesV2: [
        {
            'name': 'Unknown',
            'value': '0',
            'color': '#6f6f6f'
        },
        {
            'name': 'Surface Water',
            'value': '1',
            'color': '#aec3d4'
        },
        {
            'name': 'Snow and Ice',
            'value': '2',
            'color': '#b1f9ff'
        },
        {
            'name': 'Mangroves',
            'value': '3',
            'color': '#111149'
        },
        {
            'name': 'Flooded Forest',
            'value': '4',
            'color': '#287463'
        },
        {
            'name': 'Deciduous Forest',
            'value': '5',
            'color': '#152106'
        },
        {
            'name': 'Orchard or Plantation Forest',
            'value': '6',
            'color': '#c3aa69'
        },
        {
            'name': 'Evergreen Broadleaf',
            'value': '7',
            'color': '#7db087'
        },
        {
            'name': 'Mixed Forest',
            'value': '8',
            'color': '#387242'
        },
        {
            'name': 'Urban and Built Up',
            'value': '9',
            'color': '#cc0013'
        },
        {
            'name': 'Cropland',
            'value': '10',
            'color': '#8dc33b'
        },
        {
            'name': 'Rice',
            'value': '11',
            'color': '#ffff00'
        },
        {
            'name': 'Mining',
            'value': '12',
            'color': '#cec2a5'
        },
        {
            'name': 'Barren',
            'value': '13',
            'color': '#674c06'
        },
        {
            'name': 'Wetlands',
            'value': '14',
            'color': '#3bc3b2'
        },
        {
            'name': 'Grassland',
            'value': '15',
            'color': '#f4a460'
        },
        {
            'name': 'Shrubland',
            'value': '16',
            'color': '#800080'
        },
        {
            'name': 'Aquaculture',
            'value': '17',
            'color': '#51768e'
        }
    ],
    landCoverClasses: [
        {
            'name': 'Unknown',
            'value': '0',
            'color': '#6f6f6f',
            'caret': false
        },
        {
            'name': 'Surface Water',
            'value': '1',
            'color': '#aec3d4',
            'caret': false
        },
        {
            'name': 'Snow and Ice',
            'value': '2',
            'color': '#b1f9ff',
            'caret': false
        },
        {
            'name': 'Mangroves',
            'value': '3',
            'color': '#111149',
            'caret': false
        },
        {
            'name': 'Flooded Forest',
            'value': '4',
            'color': '#287463',
            'caret': false
        },
        {
            'name': 'Forest',
            'value': '5',
            'color': '#152106',
            'caret': true
        },
        {
            'name': 'Orchard or Plantation Forest',
            'value': '6',
            'color': '#c3aa69',
            'caret': false
        },
        {
            'name': 'Evergreen Broadleaf',
            'value': '7',
            'color': '#7db087',
            'nestedUnder': '5',
            'caret': false
        },
        {
            'name': 'Mixed Forest',
            'value': '8',
            'color': '#387242',
            'nestedUnder': '5',
            'caret': false
        },
        {
            'name': 'Urban and Built Up',
            'value': '9',
            'color': '#cc0013',
            'caret': false
        },
        {
            'name': 'Cropland',
            'value': '10',
            'color': '#8dc33b',
            'caret': false
        },
        {
            'name': 'Rice',
            'value': '11',
            'color': '#ffff00',
            'caret': false
        },
        {
            'name': 'Mining',
            'value': '12',
            'color': '#cec2a5',
            'caret': false
        },
        {
            'name': 'Barren',
            'value': '13',
            'color': '#674c06',
            'caret': false
        },
        {
            'name': 'Wetlands',
            'value': '14',
            'color': '#3bc3b2',
            'caret': false
        },
        {
            'name': 'Grassland',
            'value': '15',
            'color': '#f4a460',
            'caret': false
        },
        {
            'name': 'Shrubland',
            'value': '16',
            'color': '#800080',
            'caret': false
        },
        {
            'name': 'Aquaculture',
            'value': '17',
            'color': '#51768e',
            'caret': false
        }
    ],
    primitiveClassesV1: [
        {
            'name': 'Barren',
            'value': '0'
        },
        {
            'name': 'Built up',
            'value': '1'
        },
        {
            'name': 'Canopy',
            'value': '2'
        },
        {
            'name': 'Cropland',
            'value': '3'
        },
        {
            'name': 'Deciduous',
            'value': '4'
        },
        {
            'name': 'Ephemeral Water',
            'value': '5'
        },
        {
            'name': 'Evergreen',
            'value': '6'
        },
        {
            'name': 'Evergreen Broadleaf',
            'value': '7'
        },
        {
            'name': 'Evergreen Needleleaf',
            'value': '8'
        },
        {
            'name': 'Grass',
            'value': '9'
        },
        {
            'name': 'Impervious',
            'value': '10'
        },
        {
            'name': 'Irrigated',
            'value': '11'
        },
        {
            'name': 'Mangrove',
            'value': '12'
        },
        {
            'name': 'Rice',
            'value': '13'
        },
        {
            'name': 'Shrub',
            'value': '14'
        },
        {
            'name': 'Snow Ice',
            'value': '15'
        },
        {
            'name': 'Surface Water',
            'value': '16'
        },
        {
            'name': 'Tree Height',
            'value': '17'
        }
    ],
    primitiveClasses: [
        {
            'name': 'Aquaculture',
            'value': '0'
        },
        {
            'name': 'Barren',
            'value': '1'
        },
        {
            'name': 'Closed Forest',
            'value': '2'
        },
        {
            'name': 'Cropland',
            'value': '3'
        },
        {
            'name': 'Deciduous',
            'value': '4'
        },
        {
            'name': 'Evergreen',
            'value': '5'
        },
        {
            'name': 'Flooded Forest',
            'value': '6'
        },
        {
            'name': 'Grass',
            'value': '7'
        },
        {
            'name': 'Mangrove',
            'value': '8'
        },
        {
            'name': 'Mixed Forest',
            'value': '9'
        },
        {
            'name': 'Open Forest',
            'value': '10'
        },
        {
            'name': 'Plantations',
            'value': '11'
        },
        {
            'name': 'Rice',
            'value': '12'
        },
        {
            'name': 'Shrub',
            'value': '13'
        },
        {
            'name': 'Snow',
            'value': '14'
        },
        {
            'name': 'Tidal',
            'value': '15'
        },
        {
            'name': 'Urban',
            'value': '16'
        },
        {
            'name': 'Water',
            'value': '17'
        },
        {
            'name': 'Wetlands',
            'value': '18'
        },
        {
            'name': 'Woody',
            'value': '19'
        }
    ],
    myanmarNationalClasses: [
        {
            'name': 'Unknown',
            'value': '0',
            'color': '#6f6f6f'
        },
        {
            'name': 'Surface Water',
            'value': '1',
            'color': '#0000ff'
        },
        {
            'name': 'Snow and Ice',
            'value': '2',
            'color': '#808080'
        },
        {
            'name': 'Mangroves',
            'value': '3',
            'color': '#556b2f'
        },
        {
            'name': 'Cropland',
            'value': '4',
            'color': '#7cfc00'
        },
        {
            'name': 'Urban and Built up',
            'value': '5',
            'color': '#8b0000'
        },
        {
            'name': 'Grassland',
            'value': '6',
            'color': '#20b2aa'
        },
        {
            'name': 'Closed Forest',
            'value': '7',
            'color': '#006400'
        },
        {
            'name': 'Open Forest',
            'value': '8',
            'color': '#90ee90'
        },
        {
            'name': 'Wetland',
            'value': '9',
            'color': '#42f4c2'
        },
        {
            'name': 'Woody',
            'value': '10',
            'color': '#8b4513'
        },
        {
            'name': 'Other land',
            'value': '11',
            'color': '#6f6f6f'
        }
    ],
    myanmarIPCCLandCoverClasses: [
        {
            'name': 'Forest',
            'value': '0',
            'color': '#006400'
        },
        {
            'name': 'Grassland',
            'value': '1',
            'color': '#20b2aa'
        },
        {
            'name': 'Cropland',
            'value': '2',
            'color': '#7cfc00'
        },
        {
            'name': 'Settlements',
            'value': '3',
            'color': '#8b0000'
        },
        {
            'name': 'Wetlands',
            'value': '4',
            'color': '#0000ff'
        },
        {
            'name': 'Other Lands',
            'value': '5',
            'color': '#6f6f6f'
        }
    ],
    myanmarFRALandCoverClasses: [
        {
            'name': 'Water Bodies',
            'value': '0',
            'color': '#0000ff'
        },
        {
            'name': 'Forest',
            'value': '1',
            'color': '#006400'
        },
        {
            'name': 'Wooden Land',
            'value': '2',
            'color': '#8b4513'
        },
        {
            'name': 'Other Land',
            'value': '3',
            'color': '#6f6f6f'
        }
    ],
    myanmarPrimitiveClasses: [
        {
            'name': 'Closed Forest',
            'value': '0'
        },
        {
            'name': 'Cropland',
            'value': '1'
        },
        {
            'name': 'Grass',
            'value': '2'
        },
        {
            'name': 'Mangroves',
            'value': '3'
        },
        {
            'name': 'Open Forest',
            'value': '4'
        },
        {
            'name': 'Snow',
            'value': '5'
        },
        {
            'name': 'Urban',
            'value': '6'
        },
        {
            'name': 'Water',
            'value': '7'
        },
        {
            'name': 'Wetlands',
            'value': '8'
        },
        {
            'name': 'Woody',
            'value': '9'
        }
    ],
    serviceApplicationsCards: [{
            'name': 'Regional Land Cover Monitoring System',
            'description': 'The regional land cover monitoring system provides ' +
                'a series of annual land cover maps with a ' +
                'multi-purpose typology for the period of 2000-2016 which includes:<br />' +
                '<ul><li>Highly accurate, high quality regional land cover maps ' +
                'at a 30-meter resolution designed to serve explicit user-defined objectives.</li>' +
                '<li>Highly consistent maps over time, by using consistent regional ' +
                'classification scheme which harmonizes with land cover typologies ' +
                'from five Lower Mekong countries (22 land cover categories, which ' +
                'was identified through the regional consultative meeting).</li>' +
                '<li>Frequently updated (annual or bi annually) maps which leverage ' +
                'advantages of various open available remote sensing data sources.</li></ul>' +
                'The purpose of this system is to facilitate the production of custom, ' +
                'high-quality land cover information products to serve a variety of ' +
                'policy, planning, management, and reporting needs of regional and ' +
                'national institutions in the Lower Mekong Region. The system leverages ' +
                'the power of Google Earth Engine and relies in most cases on field ' +
                'observations and the interpretation of high resolution imagery by ' +
                'stakeholders relevant to a given project.<br /> Once the system has ' +
                'been customized to deliver a given product or set of products, these ' +
                'can be updated regularly in a structured manner to serve ongoing monitoring needs.',
            'url': '/landcover/',
            'imageURL': 'images/rlcms.png'
        },
        {
            'name': 'Forest Monitoring System',
            'description': 'The forest monitoring system is product of collaboration ' +
                'between SERVIR-Mekong and the Global Land Analysis and Discovery Lab ' +
                '(GLAD) from University of Maryland.<br />The tool allows users to view ' +
                'and download annual tree canopy cover percentage, annual tree height, ' +
                'ability to access annual forest extent by customizing country’s forest ' +
                'definition. Users can also perform calculations of forest dynamic which ' +
                'includes forest gain and loss by customizing forest definition and the change period.',
            'url': '/forest-monitor/',
            'imageURL': 'images/fms.png'
        },
        {
            'name': 'State of Land Report (Under Development)',
            'description': 'The Mekong region State of Land report is the application ' +
                'of customizing RLCMS, and a response to request from The Mekong Region ' +
                'Land Governance Project (MRLG), funded by the Swiss Agency for Development ' +
                'and Cooperation (SDC) and other partners. The 2018 State of Land will serve ' +
                'as a benchmark of current conditions, and set a baseline for future ' +
                'measurement and reporting of progress in land governance in the ' +
                'Mekong region.<br />The MRLG project needs a comprehensive overview ' +
                'of land resources in Mekong region including Cambodia, Laos, Myanmar, ' +
                'Thailand and Viet Nam, and the IPCC typologies (6 classes including) are ' +
                'used as representations for these products. The customization of the ' +
                'RLCMS for 6 IPCC classes has been applied to selected primitive layers ' +
                'and data assemblage processes based on the IPCC typology definition ' +
                '(IPCC guidelines in 2006). Regional land cover maps in two dates ' +
                'from 2006 and 2015 are products of this application.',
            'url': 'https://code.earthengine.google.com/64330db9b75742d76777ce01fe131001',
            'imageURL': 'images/solr.png'
        },
        {
            'name': 'Myanmar National Classification (Under Development)',
            'description': 'SERVIR-Mekong and partners are collaborating and supporting ' + 
                'the Forest Department of Myanmar to improve the land cover monitoring system ' +
                'of Myanmar, which contributes for sustainable land use management. <br/>' + 
                'The national land cover product comprises of 11 classes (namely, ' + 
                'Closed Forest, Opened Forest, Other Wooded Land, Mangroves, Wetlands, ' +
                'Snow and Ice, Cropland, Built up, Grassland, Surface Water and Others) ' +
                'and is produced annually. These national land cover products are the ' +
                'primary datasets required for reporting at national level and to FRA and UNFCCC.',
            'imageURL': 'images/myanmar-national.png'
        },
        {
            'name': 'Myanmar IPCC (Under Development)',
            'description': 'SERVIR-Mekong and partners are collaborating and ' +
                'supporting the Forest Department of Myanmar to improve the land ' +
                'cover monitoring system which contributes for greenhouse gas ' +
                'emission inventory, climate change monitoring and reporting to ' +
                'the United Nations Climate Change (UNFCCC) by the government of ' +
                'Myanmar. <br />' +
                'This customized product is a robust and sustainable national ' +
                'land cover monitoring system which can produce accurate LULC ' +
                'baseline datasets, and be updated annually for Myanmar\'s ' +
                'contribution to UNFCCC report.<br />' +
                'Products of this application are annual land cover maps with 6 ' +
                'IPCC typologies classes (includes: Forest land, cropland, ' +
                'grassland, wetland) from 2000 to 2016. Activity data of 6 land cover ' +
                'categories will also be calculated in this application at different ' +
                'administrative levels.',
            'url': '/myanmar-ipcc/',
            'imageURL': 'images/myanmar-ipcc.png'
        },
        {
            'name': 'Myanmar FRA (Under Development)',
            'description': 'SERVIR-Mekong and partners are collaborating and supporting ' +
                'the Forest Department of Myanmar to improve the forest monitoring ' +
                'system of Myanmar, which contributes for Myanmar National Forest ' +
                'Resources Assessment (FRA) to FAO. <br />' +
                'The RLCMS is customized to meet the forest types definition in ' +
                'Myanmar. The product of this application are forest maps with ' +
                'forest categories and sub categories. Forest map products are from ' +
                '2000 to 2016. The uncertainty and accuracy data assessment is ' +
                'integrated in the assemblage and map results.',
            'url': '/myanmar-fra/',
            'imageURL': 'images/myanmar-fra.png'
        }
    ]
};

/*var myanmarPrimitiveClasses = JSON.parse(JSON.stringify(settings.myanmarFRALandCoverClasses));
for (var i = 0; i <= myanmarPrimitiveClasses.length - 1; i++) { 
    delete myanmarPrimitiveClasses[i].color; 
}

settings.myanmarPrimitiveClasses = myanmarPrimitiveClasses;
*/
angular.module('landcoverportal')
.constant('appSettings', settings);
