angular.module('landcoverportal').constant('appSettings', {
	menus: [
		{
			'name': 'Map Viewer',
			'url': '/landcover/',
			'show': true
		},
		{
			'name': 'Methods',
			'url': '/method/',
			'show': true
		},
		{
			'name': 'Other Applications',
			'url': '#',
			'show': true
		},
		{
			'name': 'Forest Monitoring',
			'url': '/forest-monitor/',
			'show': true
		}
	],
	applicationName: 'Land Cover Portal',
	footerLinks: [
		{
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
	partnersHeader: [
		{
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
	partnersFooter : [
		{
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
	areaIndexSelectors: [
		{
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
	landCoverClasses :[
		{
			'name': 'Unknown',
			'value': 'unknown',
			'color': '#6f6f6f',
			'labelClass': 'lcp-class-label-single-line'
		},
		{
			'name': 'Surface Water',
			'value': 'surface_water',
			'color': '#aec3d4',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Snow and Ice',
			'value': 'snow_ice',
			'color': '#b1f9ff',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Mangrove',
			'value': 'mangrove',
			'color': '#111149',
			'labelClass': 'lcp-class-label-single-line'
		},
		{
			'name': 'Flooded Forest',
			'value': 'forest_flood',
			'color': '#287463',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Deciduous Forest',
			'value': 'forest_deciduous',
			'color': '#152106',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Orchard or Plantation forest',
			'value': 'forest_plantation',
			'color': '#c3aa69',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Evergreen Broadleaf Alpine',
			'value': 'evergreen_broadleaf_alpine',
			'color': '#9ad2a5',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Evergreen Broadleaf',
			'value': 'evergreen_broadleaf',
			'color': '#7db087',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Evergreen Needleleaf',
			'value': 'evergreen_needleleaf',
			'color': '#486f50',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Evergreen Mixed Forest',
			'value': 'evergreen_forest_mix',
			'color': '#387242',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Evergreen Mixed and Deciduous',
			'value': 'evergreen_forest_mix_deciduous',
			'color': '#115420',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Urban and Built Up',
			'value': 'urban',
			'color': '#cc0013',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Cropland',
			'value': 'cropland',
			'color': '#8dc33b',
			'labelClass': 'lcp-class-label-single-line'
		},
		{
			'name': 'Rice Paddy',
			'value': 'rice',
			'color': '#ffff00',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Mudflat and Intertidal',
			'value': 'mudflat',
			'color': '#a1843b',
			'labelClass': 'lcp-class-label-multi-line'
		},
		{
			'name': 'Mining',
			'value': 'mine',
			'color': '#cec2a5',
			'labelClass': 'lcp-class-label-single-line'
		},
		{
			'name': 'Barren',
			'value': 'barren',
			'color': '#674c06',
			'labelClass': 'lcp-class-label-single-line'
		},
		{
			'name': 'Wetlands',
			'value': 'wetland',
			'color': '#3bc3b2',
			'labelClass': 'lcp-class-label-single-line'
		},
		{
			'name': 'Grassland',
			'value': 'grassland',
			'color': '#f4a460',
			'labelClass': 'lcp-class-label-single-line'
		},
		{
			'name': 'Shrubland',
			'value': 'shrubland',
			'color': '#800080',
			'labelClass': 'lcp-class-label-single-line'
		}
	]
});
