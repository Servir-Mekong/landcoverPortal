# -*- coding: utf-8 -*-

import os
import googleapiclient.discovery
from google.oauth2 import service_account

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# GEE authentication
# The service account email address authorized by your Google contact.
EE_ACCOUNT = 'rlcms-526@servir-rlcms.iam.gserviceaccount.com'
EE_PRIVATE_KEY_FILE = os.path.join(BASE_DIR, 'credentials/privatekey.json')

GOOGLE_OAUTH2_CREDENTIALS = service_account.Credentials.from_service_account_file(
    EE_PRIVATE_KEY_FILE,
    scopes = ['https://www.googleapis.com/auth/drive']
)

drive_service = googleapiclient.discovery.build('drive', 'v2', credentials=GOOGLE_OAUTH2_CREDENTIALS)

# list all the files
files = drive_service.files().list().execute()

# get all the items of the files
items = files.get('items')
print('total {} items found'.format(len(items)))

# delete the files by getting its id
deleted = 0
not_deleted = 0
not_deleted_id = []

for f in items:
    response = drive_service.files().delete(fileId=f['id']).execute()
    if not response:
        deleted += 1
    else:
        not_deleted_id.append(f['id'])
        not_deleted += 1

print('total {} items deleted'.format(deleted))
print('total {} items cannot be deleted having ids: {}'.format(not_deleted, not_deleted_id))

folders = drive_service.children().list(folderId='root').execute()
folders = folders.get('items')
print('total {} folder found'.format(len(folders)))

for f in folders:
    drive_service.children().delete(folderId='root', childId=f['id']).execute()
