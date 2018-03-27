# -*- coding: utf-8 -*-

from core import LandCoverViewer
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
#from tasks import export_to_drive_task
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
                          ]

        if action in public_methods:
            shape = post('shape', '')
            geom = post('geom', '')
            radius = post('radius', '')
            center = post('center', '')
            area_path = post('areaSelectFrom', '')
            area_name = post('areaName', '')
            start_year = post('startYear', '')
            end_year = post('endYear', '')
            type = post('type', '')
            report_area = True if get('report-area') == 'true' else False
            primitives = post('primitives', range(0, 21))
            if isinstance(primitives, (unicode, str)):
                try:
                    primitives = primitives.split(',')
                    primitives = [int(primitive) for primitive in primitives]
                except Exception as e:
                    return JsonResponse({'error': e.message()})
            else:
                return JsonResponse({'error': 'We accept comma-separated string!'})
            # sanitize
            # using older version of bleach to keep intact with the django cms
            file_name = bleach.clean(post('fileName', ''))

            core = LandCoverViewer(area_path, area_name, shape, geom, radius, center)
            if action == 'landcovermap':
                data = core.landcover(primitives=primitives,
                                      year=post('year', ''))

            return JsonResponse(data)
