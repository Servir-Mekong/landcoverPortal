angular.module('landcoverportal').constant('appSettings', {
    menus: [{
            'name': 'Map Viewer',
            'url': '/landcover/',
            'show': false
        },
        {
            'name': 'Methods',
            'url': '/method/',
            'show': true
        },
        {
            'name': 'Service Applications',
            'url': '/service-applications/',
            'show': true
        },
        {
            'name': 'Forest Monitoring',
            'url': '/forest-monitor/',
            'show': false
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
            'className': 'usaid'
        },
        {
            'alt': 'The National Aeronautics and Space Administration',
            'url': 'https://www.nasa.gov/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/NASA_Logo_Color.png',
            'src': 'images/nasa.png',
            'className': 'nasa'
        },
        {
            'alt': 'Asian Disaster Preparedness Center',
            'url': 'http://www.adpc.net/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-adbc.png',
            'src': 'images/adpc.png',
            'className': 'adpc'
        },
        {
            'alt': 'SERVIR',
            'url': 'https://servir.adpc.net/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/Servir_Logo_Color.png',
            'src': 'images/servir-mekong.png',
            'className': 'servir'
        }
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
    countries: ['Cambodia', 'Laos', 'Myanmar', 'Thailand', 'Vietnam'],
    // this list is generated from python script at /scripts/list-provience.py
    provinces: ['Amnat Charoen', 'An Giang', 'Ang Thong', 'Attapu', 'Ayeyarwady', 'Ba Ria - VTau', 'Bac Giang', 'Bac Kan', 'Bac Lieu', 'Bac Ninh', 'Bago', 'Bangkok Metropolis', 'Banteay Mean Cheay', 'Battambang', 'Ben Tre', 'Binh Dinh', 'Binh Duong', 'Binh Phuoc', 'Binh Thuan', 'Bokeo', 'Bolikhamxai', 'Bueng Kan', 'Buri Ram', 'Ca Mau', 'Can Tho', 'Cao Bang', 'Chachoengsao', 'Chai Nat', 'Chaiyaphum', 'Champasak', 'Chanthaburi', 'Chiang Mai', 'Chiang Rai', 'Chin', 'Chon Buri', 'Chumphon', 'Da Nang City', 'Dac Nong', 'Dak Lak', 'Dien Bien', 'Dong Nai', 'Dong Thap', 'Gia Lai', 'Ha Giang', 'Ha Nam', 'Ha Tay', 'Ha Tinh', 'Hai Duong', 'Haiphong', 'Hanoi', 'Hau Giang', 'Ho Chi Minh', 'Hoa Binh', 'Houaphan', 'Hung Yen', 'Kachin', 'Kalasin', 'Kamphaeng Phet', 'Kampong Chaam', 'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kanchanaburi', 'Kandaal', 'Kayah', 'Kayin', 'Keb', 'Khammouan', 'Khanh Hoa', 'Khon Kaen', 'Kien Giang', 'Koh Kong', 'Kompong Chnang', 'Kon Tum', 'Krabi', 'Kratie', 'Lai Chau', 'Lam Dong', 'Lampang', 'Lamphun', 'Lang Son', 'Lao Cai', 'Loei', 'Long An', 'Lop Buri', 'Louang Namtha', 'Louangphrabang', 'Mae Hong Son', 'Magway', 'Maha Sarakham', 'Mandalay', 'Mon', 'Mondul Kiri', 'Mukdahan', 'Nakhon Nayok', 'Nakhon Pathom', 'Nakhon Phanom', 'Nakhon Ratchasima', 'Nakhon Sawan', 'Nakhon Si Thammarat', 'Nam Dinh', 'Nan', 'Narathiwat', 'Naypyitaw', 'Nghe An', 'Ninh Binh', 'Ninh Thuan', 'Nong Bua Lam Phu', 'Nong Khai', 'Nonthaburi', 'Oddar Meanchey', 'Oudomxai', 'Pailin', 'Pathum Thani', 'Pattani', 'Phangnga', 'Phatthalung', 'Phayao', 'Phetchabun', 'Phetchaburi', 'Phichit', 'Phitsanulok', 'Phnum Penh', 'Phongsali', 'Phra Nakhon Si Ayutthaya', 'Phrae', 'Phu Tho', 'Phu Yen', 'Phuket', 'Prachin Buri', 'Prachuap Khiri Khan', 'Preah Vihear', 'Prey Veaeng', 'Pursat', 'Quang Binh', 'Quang Nam', 'Quang Ngai', 'Quang Ninh', 'Quang Tri', 'Rakhine', 'Ranong', 'Ratana Kiri', 'Ratchaburi', 'Rayong', 'Roi Et', 'Sa Kaeo', 'Sagaing', 'Sakon Nakhon', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram', 'Saraburi', 'Saravan', 'Satun', 'Savannakhot', 'Shan', 'Si Sa Ket', 'Siem Reap', 'Sihanoukville', 'Sing Buri', 'Soairieng', 'Soc Trang', 'Son La', 'Songkhla', 'Stung Treng', 'Sukhothai', 'Suphan Buri', 'Surat Thani', 'Surin', 'Tak', 'Takeo', 'Tanintharyi', 'Tay Ninh', 'Tbong Khmum', 'Thai Binh', 'Thai Nguyen', 'Thanh Hoa', 'Thua Thien - Hue', 'Tien Giang', 'Tra Vinh', 'Trang', 'Trat', 'Tuyen Quang', 'Ubon Ratchathani', 'Udon Thani', 'Uthai Thani', 'Uttaradit', 'Vientiane', 'Vinh Long', 'Vinh Phuc', 'Xaignabouri', 'Xaisomboun', 'Xekong', 'Xiangkhoang', 'Yala', 'Yangon', 'Yasothon', 'Yen Bai'],
    landCoverClasses: [{
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
            'name': 'Mangrove',
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
            'name': 'Evergreen Mixed and Deciduous',
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
    primitiveClasses: [{
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
            'name': 'Forest Cover',
            'value': '7'
        },
        {
            'name': 'Grass',
            'value': '8'
        },
        {
            'name': 'Mangrove',
            'value': '9'
        },
        {
            'name': 'Mixed Forest',
            'value': '10'
        },
        {
            'name': 'Rice',
            'value': '11'
        },
        {
            'name': 'Shrub',
            'value': '12'
        },
        {
            'name': 'Snow Ice',
            'value': '13'
        },
        {
            'name': 'Surface Water',
            'value': '14'
        },
        {
            'name': 'Tree Height',
            'value': '15'
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
            'url': 'https://code.earthengine.google.com/2cecf39d7e5587ef0b74e89f76f72ed8',
            'imageURL': 'images/solr.png'
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
            'url': 'http://servir-rlcms.appspot.com/static/html/services.html',
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
            'url': '#',
            'imageURL': 'images/myanmar-fra.png'
        }
    ]
});