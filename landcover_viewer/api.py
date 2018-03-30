# -*- coding: utf-8 -*-

from core import LandCoverViewer
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .tasks import export_to_drive_task
import bleach
import json
import time

@csrf_exempt
@require_POST
def api(request):

    post = json.loads(request.body).get
    get = request.GET.get
    action = get('action', '')

    if action:
        public_methods = ['landcovermap',
                          'primitive',
                          'get-download-url',
                          'download-to-drive'
                          ]

        if action in public_methods:
            year = post('year', 2016)
            shape = post('shape', '')
            geom = post('geom', '')
            radius = post('radius', '')
            center = post('center', '')
            area_path = post('areaSelectFrom', '')
            area_name = post('areaName', '')
            type = post('type', 'landcover')
            report_area = True if get('report-area') == 'true' else False
            primitives = post('primitives', range(0, 21))
            index = int(post('index', 0))
            if isinstance(primitives, (unicode, str)):
                try:
                    primitives = primitives.split(',')
                    primitives = [int(primitive) for primitive in primitives]
                except Exception as e:
                    return JsonResponse({'error': e.message()})
            elif isinstance(primitives, list):
                # Do nothing
                pass
            else:
                return JsonResponse({'error': 'We accept comma-separated string!'})
            # sanitize
            # using older version of bleach to keep intact with the django cms
            file_name = bleach.clean(post('fileName', ''))

            core = LandCoverViewer(area_path, area_name, shape, geom, radius, center)
            if action == 'landcovermap':
                data = core.get_landcover(primitives = primitives,
                                          year = year,
                                          )
            elif action == 'primitive':
                data = core.get_primitive(index = index,
                                          year = year,
                                          )
            elif action == 'get-download-url':
                data = core.get_download_url(type = type,
                                             year = year,
                                             primitives = primitives,
                                             index = index
                                             )
            elif action == 'download-to-drive':
                session_cache = request.session._session_cache
                if 'google_oauth2_credentials' in session_cache:
                    google_oauth2_credentials = json.loads(session_cache['google_oauth2_credentials'])
                    access_token = google_oauth2_credentials['access_token']
                    client_id = google_oauth2_credentials['client_id']
                    client_secret = google_oauth2_credentials['client_secret']
                    refresh_token = google_oauth2_credentials['refresh_token']
                    token_expiry = datetime.strptime(google_oauth2_credentials['token_expiry'], '%Y-%m-%dT%H:%M:%SZ')
                    token_uri = google_oauth2_credentials['token_uri']
                    user_agent = google_oauth2_credentials['user_agent']
                    revoke_uri = google_oauth2_credentials['revoke_uri']
                    id_token = google_oauth2_credentials['id_token']
                    token_response = google_oauth2_credentials['token_response']
                    scopes = set(google_oauth2_credentials['scopes'])
                    token_info_uri = google_oauth2_credentials['token_info_uri']
                    id_token_jwt = google_oauth2_credentials['id_token_jwt']
                    user_email = id_token['email']
                    user_id = id_token['sub']

                    if settings.USE_CELERY:
                        export_to_drive_task.delay(year = year,
                                                   area_path = area_path,
                                                   area_name = area_name,
                                                   shape = shape,
                                                   geom = geom,
                                                   radius = radius,
                                                   center = center,
                                                   type = type,
                                                   file_name = file_name,
                                                   primitives = primitives,
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
                        data = {'info': 'I have started the export! You can check your drive after 5-10 mins to get the exported image!'}
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
                                                      primitives = primitives,
                                                      user_email = user_email,
                                                      user_id = user_id,
                                                      file_name = file_name,
                                                      oauth2object = oauth2object,
                                                      )
                        data['info'] = 'I have started the export! You can check your drive after 5-10 mins to get the exported image!'
                else:
                    # default fallback
                    data = {'error': 'You have not allowed the tool to use your google drive to upload file! Allow it first and try again!'}

            return JsonResponse(data)
