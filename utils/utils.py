# -*- coding: utf-8 -*-

from django.conf import settings
from django.core.mail import EmailMessage

import logging
logger = logging.getLogger(settings.LOGGER_NAME)
import drive
import random
import string
import time

# -----------------------------------------------------------------------------
def get_unique_string():
    """Returns a likely-to-be unique string."""

    random_str = ''.join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(6)
    )
    date_str = str(int(time.time()))
    return date_str + random_str

# -----------------------------------------------------------------------------
def transfer_files_to_user_drive(temp_file_name, user_email, user_id, file_name, oauth2object):

    app_drive = drive.DriveHelper(settings.GOOGLE_OAUTH2_CREDENTIALS)
    files = app_drive.get_exported_files(temp_file_name)
    # Grant the user write access to the file(s) in the app service account's Drive.
    for f in files:
        app_drive.grant_access(f['id'], user_email)

    user_drive = drive.DriveHelper(oauth2object, True)

    # Copy the file(s) into the user's Drive.
    if len(files) == 1:
        file_id = files[0]['id']
        copied_file_id = user_drive.copy_file(file_id, file_name)
        trailer = 'open?id=' + copied_file_id
    else:
        trailer = ''
        for f in files:
            # The titles of the files include the coordinates separated by a dash.
            coords = '-'.join(f['title'].split('-')[-2:])
            user_drive.copy_file(f['id'], file_name + '-' + coords)

    # Delete the file from the service account's Drive.
    for f in files:
        app_drive.delete_file(f['id'])

    return 'https://drive.google.com/' + trailer

# -----------------------------------------------------------------------------
def get_client_ip(request):

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    logger.info(request.META)
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    else:
        return request.META.get('REMOTE_ADDR')

# -----------------------------------------------------------------------------
def send_email(data, html=False):

    msg = EmailMessage(
        subject = data.get('subject'),
        body = data.get('body'),
        from_email = data.get('from_address'),
        to = data.get('to_address')
    )
    if html:
        msg.content_subtype = 'html'
    msg.send()

# -----------------------------------------------------------------------------
