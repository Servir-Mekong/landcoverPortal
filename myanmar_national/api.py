# -*- coding: utf-8 -*-

from core import MyanmarNational
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from main.models import ExportDownloadURL
from .tasks import export_to_drive_task

import bleach
import json
import time

PUBLIC_METHODS = [
    'landcovermap',
    'primitive',
    'get-download-url',
    'download-to-drive',
    'get-stats'
]

@csrf_exempt
@require_POST
def api(request):

    post = json.loads(request.body).get
    get = request.GET.get
    action = get('action', '')

    if action and action in PUBLIC_METHODS:
        year = post('year', 2016)
        shape = post('shape', '')
        geom = post('geom', '')
        radius = post('radius', '')
        center = post('center', '')
        area_path = post('areaSelectFrom', '')
        area_name = post('areaName', '')
        type = post('type', 'landcover')
        report_area = True if get('report-area') == 'true' else False
        classes = post('classes', range(0, 21))
        index = int(post('index', 0))
        if isinstance(classes, (unicode, str)):
            try:
                classes = classes.split(',')
                classes = [int(_class) for _class in classes]
            except Exception as e:
                return JsonResponse({'error': e.message()})
        elif isinstance(classes, list):
            # Do nothing
            pass
        else:
            return JsonResponse({'error': 'We accept comma-separated string!'})
        # sanitize
        # using older version of bleach to keep intact with the django cms
        file_name = bleach.clean(post('fileName', ''))

        core = MyanmarNational(area_path, area_name, shape, geom, radius, center)
        if action == 'landcovermap':
            data = core.get_landcover(classes=classes, year=year)
        elif action == 'primitive':
            data = core.get_primitive(index=index, year=year)
        elif action == 'get-download-url':
            data = core.get_download_url(type = type,
                                         year = year,
                                         classes = classes,
                                         index = index
                                         )

            # dump to db if success
            if settings.USE_EMAIL_MODULE and isinstance(data, dict) and 'downloadUrl' in data:
                try:
                    ExportDownloadURL.objects.create(
                        url = data.get('downloadUrl'),
                        app = 'myanmar_national',
                        ip_address = utils.get_client_ip(request)
                    )
                except:
                    # do nothing
                    # @ToDo: logging
                    pass

        elif action == 'get-stats':
            data = core.get_stats(year=year, classes=classes)
        elif action == 'download-to-drive':
            session_get = request.session.get
            if session_get('email') and session_get('sub') and session_get('credentials'):
                credentials = session_get('credentials')
                access_token = credentials['access_token']
                client_id = credentials['client_id']
                client_secret = credentials['client_secret']
                refresh_token = credentials['refresh_token']
                token_expiry = datetime.strptime(credentials['token_expiry'], '%Y-%m-%dT%H:%M:%SZ')
                token_uri = credentials['token_uri']
                user_agent = credentials['user_agent']
                revoke_uri = credentials['revoke_uri']
                id_token = credentials['id_token']
                token_response = credentials['token_response']
                scopes = set(credentials['scopes'])
                token_info_uri = credentials['token_info_uri']
                id_token_jwt = credentials['id_token_jwt']
                user_email = session_get('email')
                user_id = session_get('sub')

                if settings.USE_CELERY:
                    export_to_drive_task.delay(year = year,
                                               province = province,
                                               shape = shape,
                                               geom = geom,
                                               radius = radius,
                                               center = center,
                                               type = type,
                                               file_name = file_name,
                                               classes = classes,
                                               index = index,
                                               access_token = access_token,
                                               client_id = client_id,
                                               client_secret = client_secret,
                                               refresh_token = refresh_token,
                                               token_expiry = token_expiry,
                                               token_uri = token_uri,
                                               user_agent = user_agent,
                                               revoke_uri = revoke_uri,
                                               id_token = id_token,
                                               token_response = token_response,
                                               scopes = scopes,
                                               token_info_uri = token_info_uri,
                                               id_token_jwt = id_token_jwt,
                                               user_email = user_email,
                                               user_id = user_id,
                                               )
                    data = {'info': 'The export is started! Larger area takes longer time!'}
                else:
                    from oauth2client.client import OAuth2Credentials
                    oauth2object = OAuth2Credentials(access_token,
                                                     client_id,
                                                     client_secret,
                                                     refresh_token,
                                                     token_expiry,
                                                     token_uri,
                                                     user_agent,
                                                     revoke_uri,
                                                     id_token,
                                                     token_response,
                                                     scopes,
                                                     token_info_uri,
                                                     id_token_jwt)
                    data = core.download_to_drive(type = type,
                                                  year = year,
                                                  classes = classes,
                                                  user_email = user_email,
                                                  user_id = user_id,
                                                  file_name = file_name,
                                                  oauth2object = oauth2object,
                                                  )
                    data['info'] = 'The export is started! Larger area takes longer time!'
            else:
                # default fallback
                data = {'error': 'You have not allowed the tool to use your google drive to upload file! Allow it first and try again!'}

        if 'error' in data:
            return JsonResponse(data, status=500)
        # success response
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Method not allowed!'}, status=405)
