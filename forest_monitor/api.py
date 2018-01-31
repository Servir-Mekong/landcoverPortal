# -*- coding: utf-8 -*-

from core import GEEApi
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
import time

@csrf_exempt
@require_POST
def api(request):

    post = json.loads(request.body).get
    action = request.GET.get('action', '')

    if action:
        public_methods = ['tree-canopy',
                          'tree-height',
                          'forest-gain',
                          'forest-loss',
                          'forest-change',
                          ]
        if action in public_methods:
            shape = post('shape', '')
            geom = post('geom', '')
            radius = post('radius', '')
            center = post('center', '')
            area_path = post('areaSelectFrom', '')
            area_name = post('areaName', '')

            core = GEEApi(area_path, area_name, shape, geom, radius, center)
            if action == 'tree-canopy':
                data = core.tree_canopy(year=post('year', ''))
            elif action == 'tree-height':
                data = core.tree_height(year=post('year', ''))
            elif action == 'forest-gain':
                data = core.forest_gain(start_year = post('startYear', ''),
                                        end_year = post('endYear', ''))
            elif action == 'forest-loss':
                data = core.forest_loss(start_year = post('startYear', ''),
                                        end_year = post('endYear', ''))
            elif action == 'forest-change':
                data = core.forest_change(start_year = post('startYear', ''),
                                          end_year = post('endYear', ''))

            return JsonResponse(data)
