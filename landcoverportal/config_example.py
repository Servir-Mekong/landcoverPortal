# -*- coding: utf-8 -*-

"""
Earth Engine related config and settings
"""

import ee
import oauth2client
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# GEE authentication
# The service account email address authorized by your Google contact.
EE_ACCOUNT = '<your-ee-account>'
# The private key associated with your service account in Privacy Enhanced
# Email format (deprecated version .pem suffix, new version .json suffix).
EE_PRIVATE_KEY_FILE = os.path.join(BASE_DIR, 'credentials/privatekey.json')

# Service account scope for GEE

GOOGLE_EARTH_SCOPES = (
    'https://www.googleapis.com/auth/earthengine',
)

GOOGLE_OAUTH2_SCOPES = ('https://www.googleapis.com/auth/drive',
                        'profile',
                        'email',
                        )

EE_CREDENTIALS = ee.ServiceAccountCredentials(EE_ACCOUNT,
                                              EE_PRIVATE_KEY_FILE,
                                              GOOGLE_EARTH_SCOPES)

# Frequency to poll for export EE task completion (seconds)
EE_TASK_POLL_FREQUENCY = 10

GOOGLE_OAUTH2_CREDENTIALS = oauth2client.service_account.ServiceAccountCredentials.\
                            from_json_keyfile_name(EE_PRIVATE_KEY_FILE,
                                                   ['https://www.googleapis.com/auth/drive',
                                                    ])

# Filter Image Collection
EE_FMS_TREE_HEIGHT_ID = 'projects/servir-mekong/Primitives/P_tree_height'
EE_FMS_TREE_CANOPY_ID = 'projects/servir-mekong/Primitives/P_canopy'

EE_MEKONG_FEATURE_COLLECTION_ID = 'ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw'

# Other Settings
COUNTRIES_NAME = ['Myanmar (Burma)', 'Thailand', 'Laos', 'Vietnam', 'Cambodia']

EE_USE_CELERY = False
