# -*- coding: utf-8 -*-

from django.conf import settings
import drive
import random
import string
import time

# -----------------------------------------------------------------------------
def get_unique_string():
    """Returns a likely-to-be unique string."""

    random_str = ''.join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    date_str = str(int(time.time()))
    return date_str + random_str

# -----------------------------------------------------------------------------
def transfer_files_to_user_drive(temp_file_name, user_email, user_id, file_name, oauth2object):

    APP_DRIVE_HELPER = drive.DriveHelper(settings.GOOGLE_OAUTH2_CREDENTIALS)
    files = APP_DRIVE_HELPER.GetExportedFiles(temp_file_name)
    # Grant the user write access to the file(s) in the app service account's Drive.
    for f in files:
        APP_DRIVE_HELPER.GrantAccess(f['id'], user_email)

    user_drive_helper = drive.DriveHelper(oauth2object)

    # Copy the file(s) into the user's Drive.
    if len(files) == 1:
        file_id = files[0]['id']
        copied_file_id = user_drive_helper.CopyFile(file_id, file_name)
        trailer = 'open?id=' + copied_file_id
    else:
        trailer = ''
        for f in files:
            # The titles of the files include the coordinates separated by a dash.
            coords = '-'.join(f['title'].split('-')[-2:])
            user_drive_helper.CopyFile(f['id'], file_name + '-' + coords)

    # Delete the file from the service account's Drive.
    for f in files:
        APP_DRIVE_HELPER.DeleteFile(f['id'])

    return 'https://drive.google.com/' + trailer
