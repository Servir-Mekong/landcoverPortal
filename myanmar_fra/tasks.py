# -*- coding: utf-8 -*-

from __future__ import absolute_import

from celery import shared_task
from .core import MyanmarFRA
from oauth2client.client import OAuth2Credentials

@shared_task
def export_to_drive_task(**kwargs):

    core = MyanmarFRA(kwargs['province'],
                      kwargs['shape'],
                      kwargs['geom'],
                      kwargs['radius'],
                      kwargs['center']
                      )

    oauth2object = OAuth2Credentials(kwargs['access_token'],
                                     kwargs['client_id'],
                                     kwargs['client_secret'],
                                     kwargs['refresh_token'],
                                     kwargs['token_expiry'],
                                     kwargs['token_uri'],
                                     kwargs['user_agent'],
                                     kwargs['revoke_uri'],
                                     kwargs['id_token'],
                                     kwargs['token_response'],
                                     kwargs['scopes'],
                                     kwargs['token_info_uri'],
                                     kwargs['id_token_jwt']
                                     )

    data = core.download_to_drive(type = kwargs['type'],
                                  year = kwargs['year'],
                                  classes = kwargs['classes'],
                                  index = kwargs['index'],
                                  file_name = kwargs['file_name'],
                                  user_email = kwargs['user_email'],
                                  user_id = kwargs['user_id'],
                                  oauth2object = oauth2object
                                  )

    print data
